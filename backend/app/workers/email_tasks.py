from app.workers.celery_app import celery_app
import uuid
from typing import List

@celery_app.task(name="app.workers.email_tasks.send_email_task")
def send_email_task(application_id: str, email_type: str, user_id: str):
    # Implementation for sending an email (Gmail API or SMTP)
    pass

@celery_app.task(name="app.workers.email_tasks.send_bulk_email_task")
def send_bulk_email_task(application_ids: List[str], template_id: str, resume_id: str, followup_interval: int):
    # Implementation for bulk sending emails
    pass
