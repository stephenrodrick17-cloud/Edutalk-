import spacy
from sentence_transformers import SentenceTransformer, util
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Dict

class NLPEngine:
    def __init__(self):
        # Load spaCy model for basic NLP
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            # If not found, download it
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
            
        # Load Sentence Transformer for semantic similarity
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def extract_keywords(self, text: str) -> List[str]:
        doc = self.nlp(text)
        keywords = [chunk.text for chunk in doc.noun_chunks if not chunk.root.is_stop]
        return list(set(keywords))

    def get_semantic_similarity(self, text1: str, text2: str) -> float:
        embeddings1 = self.model.encode(text1, convert_to_tensor=True)
        embeddings2 = self.model.encode(text2, convert_to_tensor=True)
        cosine_score = util.cos_sim(embeddings1, embeddings2)
        return float(cosine_score[0][0])

    def cluster_topics(self, questions: List[str], threshold: float = 0.7) -> Dict[str, List[int]]:
        embeddings = self.model.encode(questions)
        clusters = {}
        processed = [False] * len(questions)

        for i in range(len(questions)):
            if processed[i]:
                continue
            
            topic_name = self.extract_keywords(questions[i])[0] if self.extract_keywords(questions[i]) else f"Topic {i}"
            clusters[topic_name] = [i]
            processed[i] = True
            
            for j in range(i + 1, len(questions)):
                if processed[j]:
                    continue
                
                similarity = util.cos_sim(embeddings[i], embeddings[j])
                if similarity > threshold:
                    clusters[topic_name].append(j)
                    processed[j] = True
                    
        return clusters

    def analyze_trends(self, year_topic_map: Dict[int, List[str]]) -> Dict[str, Dict[str, any]]:
        # Map of topic -> {year: frequency}
        topic_trends = {}
        for year, topics in year_topic_map.items():
            for topic in topics:
                if topic not in topic_trends:
                    topic_trends[topic] = {}
                topic_trends[topic][year] = topic_trends[topic].get(year, 0) + 1
        
        # Calculate growth and importance
        results = {}
        for topic, years in topic_trends.items():
            sorted_years = sorted(years.keys())
            freq_sum = sum(years.values())
            recency_weight = (sorted_years[-1] - 2020) if sorted_years else 0 # Example weight
            
            importance = freq_sum + recency_weight
            results[topic] = {
                "frequency": freq_sum,
                "importance": importance,
                "history": years
            }
            
        return results
