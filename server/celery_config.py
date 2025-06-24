from celery import Celery

celery_app = Celery(
    "quiz_app",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

celery_app.conf.task_routes = {
    "server.tasks.send_quiz_email": {"queue": "email"}
}

import server.app.share.share_tasks
