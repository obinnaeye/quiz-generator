import logging
from server.celery_config import celery_app
from .share_email_utils import compose_quiz_email, send_email
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


@celery_app.task(name="tasks.send_quiz_email")
def send_quiz_email(quiz_title: str, quiz_description: str, recipient: str, shareable_link: str):
    try:
        message = compose_quiz_email(recipient, quiz_title, quiz_description, shareable_link)
        send_email(recipient, message)

        logger.info(f"[Celery Task] Completed send_quiz_email for {recipient}")
    except Exception as e:
        logger.error(f"[Celery Task Error] Unexpected failure in send_quiz_email task: {e}", exc_info=True)
        raise

