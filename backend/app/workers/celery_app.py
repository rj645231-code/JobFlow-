from celery import Celery
from celery.schedules import crontab
from app.config import settings

celery_app = Celery(
    "jobflow",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.workers.email_tasks",
        "app.workers.followup_tasks",
        "app.workers.reply_detection"
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

celery_app.conf.beat_schedule = {
    "check-replies-every-5-minutes": {
        "task": "app.workers.reply_detection.check_gmail_replies",
        "schedule": crontab(minute="*/5"),
    },
    "process-due-followups-hourly": {
        "task": "app.workers.followup_tasks.process_due_followups",
        "schedule": crontab(minute="0"),
    }
}
