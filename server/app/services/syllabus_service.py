from typing import List, Dict
from .nlp_service import nlp_service

class SyllabusService:
    def map_to_syllabus(self, extracted_topics: List[str], syllabus_topics: List[str]):
        """
        Maps extracted topics from papers to the official syllabus.
        Returns a heatmap of coverage.
        """
        coverage = {}
        for s_topic in syllabus_topics:
            # Check for semantic matches
            matches = [e_topic for e_topic in extracted_topics if self._is_semantic_match(e_topic, s_topic)]
            coverage[s_topic] = {
                "count": len(matches),
                "is_covered": len(matches) > 0,
                "occurrences": matches
            }
        return coverage

    def _is_semantic_match(self, t1: str, t2: str):
        # In a real app, use cosine similarity of embeddings
        # For now, simple keyword overlap
        set1 = set(t1.lower().split())
        set2 = set(t2.lower().split())
        return len(set1.intersection(set2)) > 0

syllabus_service = SyllabusService()
