from typing import List, Dict
import pandas as pd
from datetime import datetime

class PredictionService:
    def calculate_importance(self, topic_data: List[Dict]):
        # topic_data schema: {topic: str, year: int, marks: float, frequency: int}
        df = pd.DataFrame(topic_data)
        if df.empty:
            return []

        current_year = datetime.now().year
        
        # Aggregate by topic
        summary = df.groupby('topic').agg({
            'marks': 'sum',
            'year': 'max',
            'topic': 'count'
        }).rename(columns={'topic': 'frequency', 'year': 'last_seen'})
        
        # Calculate scores
        # 1. Frequency Score (Normalized)
        max_freq = summary['frequency'].max()
        summary['freq_score'] = (summary['frequency'] / max_freq) * 40

        # 2. Recency Score (Closer to current year is better)
        summary['recency_score'] = (1 - (current_year - summary['last_seen']) / 10).clip(0, 1) * 20

        # 3. Marks Weight
        max_marks = summary['marks'].max()
        summary['marks_score'] = (summary['marks'] / max_marks) * 30

        # 4. Trend Growth (Bonus for topics appearing more in recent years)
        # Simplified: Bonus if last_seen is within 2 years
        summary['trend_score'] = summary['last_seen'].apply(lambda x: 10 if (current_year - x) <= 2 else 0)

        summary['total_score'] = summary['freq_score'] + summary['recency_score'] + summary['marks_score'] + summary['trend_score']
        
        return summary.sort_values(by='total_score', ascending=False).to_dict(orient='index')

prediction_service = PredictionService()
