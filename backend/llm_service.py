import os
import json
import re
import base64
from typing import List, Dict, Any
from openai import AsyncOpenAI
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        
        if not self.api_key and not self.gemini_key:
            print("WARNING: Neither OPENROUTER_API_KEY nor GEMINI_API_KEY is set. AI features will be limited.")
            self.client = None
            self.gemini_model = None
            return
            
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-001")
        
        # Initialize OpenRouter Client
        if self.api_key:
            self.client = AsyncOpenAI(
                base_url=self.base_url,
                api_key=self.api_key,
            )
        
        # Initialize Google Gemini Client if key provided
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')

    def _parse_json_response(self, content: str) -> Dict[str, Any]:
        """Parses JSON from LLM response, handling potential markdown wrapping."""
        try:
            # Clean up the string - sometimes models return extra markdown characters
            clean_content = content.strip()
            if clean_content.startswith("```"):
                # Use regex to extract JSON from markdown blocks
                match = re.search(r"```(?:json)?\s*(.*?)\s*```", clean_content, re.DOTALL)
                if match:
                    clean_content = match.group(1)
            
            return json.loads(clean_content)
        except Exception as e:
            print(f"JSON Parse Error: {e}. Content: {content[:200]}")
            # Fallback regex attempt if json.loads fails
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except:
                    pass
            raise ValueError(f"Failed to parse JSON from response: {content[:100]}...")

    async def analyze_with_google_gemini(self, file_path: str, prompt: str) -> Dict[str, Any]:
        """Directly uses Google Gemini API for analysis (Better for PDFs/Images)."""
        try:
            print(f"DEBUG: Starting Direct Google Gemini Analysis for {file_path}")
            
            # Load the file
            with open(file_path, "rb") as f:
                file_data = f.read()
            
            mime_type = "application/pdf" if file_path.lower().endswith(".pdf") else "image/png"
            
            # Prepare content
            content = [
                prompt,
                {
                    "mime_type": mime_type,
                    "data": file_data
                }
            ]
            
            # Generate response
            response = await self.gemini_model.generate_content_async(content)
            
            if not response.text:
                raise ValueError("Google Gemini returned an empty response")
                
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"DEBUG: Google Gemini direct analysis error: {str(e)}")
            raise e

    async def analyze_paper_text(self, text: str) -> Dict[str, Any]:
        """Analyzes paper text using OpenRouter as fallback."""
        if not text.strip():
            raise ValueError("Empty text provided for analysis")

        prompt = """
        Analyze the following text extracted from a past exam paper. 
        Extract the questions, their marks, and the specific topics they cover.
        Provide a detailed solution for each question.
        Return the result in valid JSON format.
        
        Structure:
        {
            "questions": [
                {
                    "text": "question text",
                    "marks": 10,
                    "topic": "topic name",
                    "difficulty": "easy/medium/hard",
                    "solution": "step-by-step solution or answer key"
                }
            ],
            "subject": "subject name",
            "year": 2023
        }
        """
        
        try:
            print(f"DEBUG: Sending request to OpenRouter for text analysis (length: {len(text)})")
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert exam analyzer. Always return valid JSON."},
                    {"role": "user", "content": f"{prompt}\n\nText:\n{text[:10000]}"}
                ],
                response_format={ "type": "json_object" }
            )
            
            content = response.choices[0].message.content
            return self._parse_json_response(content)
        except Exception as e:
            print(f"DEBUG: OpenRouter analysis error: {str(e)}")
            raise e

    async def map_to_syllabus(self, questions: List[Dict], syllabus_text: str) -> Dict[str, Any]:
        """Maps extracted questions to the provided syllabus."""
        prompt = f"""
        Given the following questions and the syllabus text, map each question to the corresponding syllabus unit/topic.
        Identify coverage gaps (topics in the syllabus not covered by the questions).
        Return valid JSON.
        
        Questions:
        {json.dumps(questions)}
        
        Syllabus:
        {syllabus_text[:5000]}
        
        Structure:
        {{
            "mapping": [{{ "question_id": 1, "syllabus_topic": "Topic A" }}],
            "coverage_gaps": ["Topic B", "Topic C"],
            "topic_frequency": {{ "Topic A": 5, "Topic D": 2 }}
        }}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert education consultant. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        
        return self._parse_json_response(response.choices[0].message.content)

    async def generate_study_plan(self, analytics: Dict, exam_date: str) -> Dict[str, Any]:
        """Generates a smart study plan based on analysis and exam date."""
        prompt = f"""
        Generate a prioritized study schedule based on the following exam analytics.
        Focus on high-yield topics (high frequency, high marks).
        Exam Date: {exam_date}
        Return valid JSON.
        
        Analytics:
        {json.dumps(analytics)}
        
        Structure:
        {{
            "title": "Smart Study Plan",
            "schedule": [
                {{
                    "day": 1,
                    "date": "...",
                    "topics": ["..."],
                    "tasks": ["..."],
                    "priority": "Critical/High/Medium/Low"
                }}
            ]
        }}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert study planner. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        
        return self._parse_json_response(response.choices[0].message.content)

    async def chat_with_teacher(self, message: str, history: List[Dict]) -> str:
        """Chat with the AI teacher."""
        messages = [{"role": "system", "content": "You are Professor Intel, an expert engineering mentor. Be helpful, technical, and encouraging."}]
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": message})
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages
        )
        
        return response.choices[0].message.content

    async def generate_practice_questions(self, topic: str, difficulty: str) -> List[Dict]:
        """Generates practice questions for a specific topic."""
        prompt = f"""
        Generate 3 exam-style practice questions for the topic: {topic}.
        Difficulty Level: {difficulty}
        Return valid JSON.
        
        Structure:
        {{
            "questions": [
                {{
                    "text": "...",
                    "marks": 10,
                    "hint": "...",
                    "marking_scheme": "..."
                }}
            ]
        }}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert exam question generator. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        
        data = self._parse_json_response(response.choices[0].message.content)
        return data.get("questions", [])
