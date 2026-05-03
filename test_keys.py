import asyncio
import os
from dotenv import load_dotenv
import httpx

load_dotenv()

async def test_pdf_co():
    api_key = os.getenv("PDF_CO_API_KEY")
    print(f"Testing PDF.co with key: {api_key[:10]}...")
    
    url = "https://api.pdf.co/v1/file/upload/get-presigned-url"
    params = {"name": "test.txt"}
    headers = {"x-api-key": api_key}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, headers=headers)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            if response.status_code == 200:
                print("✅ PDF.co API Key is valid!")
            else:
                print("❌ PDF.co API Key is invalid or error occurred.")
        except Exception as e:
            print(f"❌ Error: {str(e)}")

async def test_openrouter():
    api_key = os.getenv("OPENROUTER_API_KEY")
    print(f"Testing OpenRouter with key: {api_key[:10]}...")
    
    url = "https://openrouter.ai/api/v1/models"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print("✅ OpenRouter API Key is valid!")
            else:
                print(f"❌ OpenRouter API Key error: {response.text}")
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_pdf_co())
    asyncio.run(test_openrouter())
