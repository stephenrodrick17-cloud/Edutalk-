import pytesseract
from PIL import Image, ImageOps, ImageFilter
import io
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

class OCREngine:
    def __init__(self):
        # Tesseract configuration
        self.tesseract_config = r'--oem 3 --psm 6'
        self.pdf_co_api_key = os.getenv("PDF_CO_API_KEY")
        if self.pdf_co_api_key:
            self.pdf_co_api_key = self.pdf_co_api_key.strip()

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        # Convert to grayscale
        image = ImageOps.grayscale(image)
        # Apply thresholding
        image = image.point(lambda x: 0 if x < 128 else 255, '1')
        # Denoising
        image = image.filter(ImageFilter.MedianFilter())
        return image

    def extract_text(self, image_path: str) -> str:
        try:
            image = Image.open(image_path)
            processed_image = self.preprocess_image(image)
            text = pytesseract.image_to_string(processed_image, config=self.tesseract_config)
            return text
        except Exception as e:
            print(f"Error in OCR: {e}")
            return ""

    def extract_from_bytes(self, image_bytes: bytes) -> str:
        try:
            image = Image.open(io.BytesIO(image_bytes))
            processed_image = self.preprocess_image(image)
            text = pytesseract.image_to_string(processed_image, config=self.tesseract_config)
            return text
        except Exception as e:
            print(f"Error in OCR from bytes: {e}")
            return ""

    async def extract_with_pdf_co(self, file_path: str) -> str:
        """Extracts text from PDF or Image using PDF.co API."""
        if not self.pdf_co_api_key:
            print("PDF.co API key not found. Falling back to local OCR.")
            return self.extract_text(file_path)

        try:
            print(f"DEBUG: Starting PDF.co extraction for: {file_path}")
            is_pdf = file_path.lower().endswith('.pdf')
            
            # Step 1: Get presigned URL for upload
            upload_url_endpoint = "https://api.pdf.co/v1/file/upload/get-presigned-url"
            # Ensure the filename is safe for the API
            safe_name = os.path.basename(file_path).replace(" ", "_")
            params = {"name": safe_name}
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                headers = {"x-api-key": self.pdf_co_api_key}
                print(f"DEBUG: Requesting presigned URL...")
                response = await client.get(upload_url_endpoint, params=params, headers=headers)
                
                if response.status_code != 200:
                    raise Exception(f"PDF.co API returned status {response.status_code}: {response.text}")
                
                response_data = response.json()
                if response_data.get("error"):
                    raise Exception(f"PDF.co API Error: {response_data.get('message', 'Unknown error')}")
                
                upload_url = response_data["presignedUrl"]
                file_url = response_data["url"]
                print(f"DEBUG: Presigned URL obtained. Uploading file...")
                
                # Step 2: Upload file
                with open(file_path, "rb") as f:
                    file_content = f.read()
                    upload_response = await client.put(upload_url, content=file_content)
                    if upload_response.status_code not in [200, 201]:
                        raise Exception(f"Failed to upload file to PDF.co storage. Status: {upload_response.status_code}")
                
                print(f"DEBUG: Upload successful. Converting to text...")
                
                # Step 3: Convert to text
                if is_pdf:
                    convert_endpoint = "https://api.pdf.co/v1/pdf/convert/to/text"
                else:
                    convert_endpoint = "https://api.pdf.co/v1/pdf/convert/to/text-from-image"
                
                payload = {
                    "url": file_url,
                    "inline": True,
                    "async": False
                }
                
                response = await client.post(convert_endpoint, json=payload, headers=headers)
                if response.status_code != 200:
                    raise Exception(f"Conversion request failed with status {response.status_code}: {response.text}")
                    
                convert_data = response.json()
                if convert_data.get("error"):
                    raise Exception(f"Conversion Error: {convert_data.get('message', 'Unknown error')}")
                
                extracted_text = convert_data.get("body", "")
                if not extracted_text and not is_pdf:
                    print("DEBUG: PDF.co returned empty body, trying local OCR fallback...")
                    return self.extract_text(file_path)
                    
                print(f"DEBUG: Successfully extracted {len(extracted_text)} characters.")
                return extracted_text
                
        except Exception as e:
            print(f"DEBUG: PDF.co Critical Error: {str(e)}")
            # Fallback to local OCR for images
            if not file_path.lower().endswith('.pdf'):
                print("DEBUG: Falling back to local OCR for image...")
                return self.extract_text(file_path)
            # Re-raise for PDFs as we don't have a local PDF parser yet
            raise Exception(f"PDF.co Processing Failed: {str(e)}")
