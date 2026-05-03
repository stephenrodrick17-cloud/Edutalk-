import re
from typing import List, Dict

class NLPService:
    def __init__(self):
        # Lightweight NLP without heavy dependencies (spaCy, sentence-transformers)
        self.stop_words = {
            'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
            'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
            'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
            'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
            'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both',
            'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
            'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
            'because', 'but', 'and', 'or', 'if', 'while', 'about', 'what', 'which',
            'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'it', 'its',
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'you', 'your', 'he',
            'him', 'his', 'she', 'her', 'they', 'them', 'their', 'up', 'down',
        }

    def extract_questions(self, text: str) -> List[Dict]:
        """Extract questions from OCR text using pattern matching."""
        lines = text.split('\n')
        questions = []
        current_q = ""

        # Patterns that indicate the start of a question
        q_patterns = [
            r'^\s*[Qq]\s*[\.\)\:]?\s*\d+',       # Q1, Q.1, Q:1, Q 1
            r'^\s*\d+\s*[\.\)\:]',                 # 1. or 1) or 1:
            r'^\s*\([a-z]\)',                       # (a), (b), etc.
            r'^\s*[a-z]\s*[\.\)]',                 # a. or a)
            r'^\s*(?:question|ques)\s*\d+',        # Question 1, Ques 1
        ]

        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                continue

            is_new_question = any(re.match(p, line_stripped, re.IGNORECASE) for p in q_patterns)

            if is_new_question:
                if current_q.strip():
                    questions.append({"text": current_q.strip()})
                current_q = line_stripped
            else:
                current_q += " " + line_stripped

        if current_q.strip():
            questions.append({"text": current_q.strip()})

        # If no questions found via patterns, split by sentences
        if not questions:
            sentences = re.split(r'[.?!]+', text)
            for s in sentences:
                s = s.strip()
                if len(s) > 20:  # Only meaningful sentences
                    questions.append({"text": s})

        return questions if questions else [{"text": text.strip()}]

    def get_keywords(self, text: str) -> List[str]:
        """Extract keywords by removing stop words and finding significant terms."""
        # Clean and tokenize
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        # Remove stop words
        keywords = [w for w in words if w not in self.stop_words]
        # Remove duplicates while preserving order
        seen = set()
        unique = []
        for w in keywords:
            if w not in seen:
                seen.add(w)
                unique.append(w)
        return unique[:10] if unique else ["general"]

    def classify_difficulty(self, text: str) -> str:
        """Classify question difficulty based on text complexity heuristics."""
        word_count = len(text.split())
        has_multiple_parts = bool(re.search(r'\b(and|also|furthermore|moreover)\b', text.lower()))
        has_complex_verbs = bool(re.search(
            r'\b(analyze|evaluate|compare|contrast|derive|prove|explain|discuss|critically)\b',
            text.lower()
        ))

        complexity = word_count
        if has_multiple_parts:
            complexity *= 1.5
        if has_complex_verbs:
            complexity *= 1.3

        if complexity < 30:
            return "easy"
        elif complexity < 80:
            return "medium"
        else:
            return "hard"

nlp_service = NLPService()
