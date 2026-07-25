from app.workers.celery_app import celery_app

@celery_app.task(name="app.workers.followup_tasks.process_due_followups")
def process_due_followups():
    # Implementation for finding and sending due followups
    pass

@celery_app.task(name="app.workers.followup_tasks.schedule_followup")
def schedule_followup(application_id: str, followup_number: int, days_delay: int):
    # Implementation for scheduling a followup
    pass
