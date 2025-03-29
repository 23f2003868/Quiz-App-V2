from celery.schedules import crontab
from flask import current_app as app
from backend.celery.task import send_quiz_reminder, send_monthly_performance

celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    
    sender.add_periodic_task(crontab(hour=5, minute=50), send_quiz_reminder.s(), name="Send Daily Quiz Reminder")
    sender.add_periodic_task(crontab(day_of_month=1, hour=5, minute=10), send_monthly_performance.s(), name="Send Monthly performance")
