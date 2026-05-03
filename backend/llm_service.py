import os
import json
import re
from typing import List, Dict, Any
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY is not set in environment variables")
            
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-001")
        
        self.client = AsyncOpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
        )

    def _parse_json_response(self, content: str) -> Dict[str, Any]:
        """Parses JSON from LLM response, handling potential markdown wrapping."""
        try:
            # Try direct parsing
            return json.loads(content)
        except json.JSONDecodeError:
            # Try to find JSON block in markdown
            match = re.search(r"```(?:json)?\s*(.*?)\s*```", content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    pass
            
            # If all fails, raise the error
            raise ValueError(f"Failed to parse JSON from response: {content[:100]}...")

    async def analyze_paper_text(self, text: str) -> Dict[str, Any]:
        """Analyzes paper text to extract questions, marks, and topics."""
        if not text.strip():
            raise ValueError("Empty text provided for analysis")

        prompt = f"""
        Analyze the following text extracted from a past exam paper. 
        Extract the questions, their marks, and the specific topics they cover.
        Return the result in valid JSON format.
        
        Structure:
        {{
            "questions": [
                {{
                    "text": "question text",
                    "marks": 10,
                    "topic": "topic name",
                    "difficulty": "easy/medium/hard"
                }}
            ],
            "subject": "subject name",
            "year": 2023
        }}
        
        Text:
        {text[:5000]}
        """
        
        try:
            print(f"DEBUG: Sending request to OpenRouter for text analysis (length: {len(text)})")
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert exam analyzer. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" }
            )
            
            content = response.choices[0].message.content
            if not content:
                raise ValueError("OpenRouter returned an empty response")
                
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
