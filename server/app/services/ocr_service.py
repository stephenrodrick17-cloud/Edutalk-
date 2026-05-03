# import pytesseract
# from paddleocr import PaddleOCR
# from PIL import Image
# import fitz # PyMuPDF

class OCRService:
    def __init__(self):
        # Initialize PaddleOCR
        # self.ocr = PaddleOCR(use_angle_cls=True, lang='en')
        pass

    async def process_file(self, file_path: str):
        return "This is mocked extracted text from the paper."

    def _process_pdf(self, pdf_path: str):
        doc = fitz.open(pdf_path)
        full_text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img_np = np.array(img)
            
            # Use PaddleOCR for high accuracy
            result = self.ocr.ocr(img_np, cls=True)
            for line in result:
                if line:
                    for word_info in line:
                        full_text += word_info[1][0] + " "
            full_text += "\n"
        return full_text

    def _process_image(self, image_path: str):
        img = cv2.imread(image_path)
        result = self.ocr.ocr(img, cls=True)
        full_text = ""
        for line in result:
            if line:
                for word_info in line:
                    full_text += word_info[1][0] + " "
        return full_text

ocr_service = OCRService()
