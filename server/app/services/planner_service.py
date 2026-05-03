from datetime import datetime, timedelta
from typing import List, Dict

class PlannerService:
    def generate_plan(self, exam_date: datetime, topics: List[Dict], daily_hours: float):
        # topics: [{name: str, priority: float, size: int}]
        # size is estimated effort in hours
        
        days_remaining = (exam_date - datetime.now()).days
        if days_remaining <= 0:
            return {"error": "Exam date must be in the future"}

        total_available_hours = days_remaining * daily_hours
        
        # Sort topics by priority
        sorted_topics = sorted(topics, key=lambda x: x['priority'], reverse=True)
        
        plan = []
        current_date = datetime.now()
        
        for topic in sorted_topics:
            topic_hours = topic.get('size', 4) # Default 4 hours per topic
            
            # Distribute topic over days
            needed_days = int(topic_hours / daily_hours) + 1
            
            for _ in range(needed_days):
                plan.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "topic": topic['name'],
                    "hours": min(daily_hours, topic_hours)
                })
                topic_hours -= daily_hours
                current_date += timedelta(days=1)
                if topic_hours <= 0:
                    break
                    
        return plan

planner_service = PlannerService()
