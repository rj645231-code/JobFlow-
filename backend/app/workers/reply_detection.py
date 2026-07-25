from app.workers.celery_app import celery_app

@celery_app.task(name="app.workers.reply_detection.check_gmail_replies")
def check_gmail_replies():
    # Implementation for checking Gmail for replies
    pass
