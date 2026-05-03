import httpx
import json
from ..core.config import settings
import os
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://examintel-ai.com", # Optional
            "X-Title": "ExamIntel AI", # Optional
            "Content-Type": "application/json"
        }

    async def generate_response(self, prompt: str, system_prompt: str = "You are ExamIntel AI assistant."):
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": "google/gemini-2.0-flash-001", # High quality & cheap
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ]
                    },
                    timeout=30.0
                )
                data = response.json()
                return data['choices'][0]['message']['content']
            except Exception as e:
                print(f"Error calling OpenRouter: {e}")
                return "I'm sorry, I'm having trouble connecting to my AI core right now."

llm_service = LLMService()
