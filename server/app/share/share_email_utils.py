import smtplib
import os
import logging
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

sender_email = os.getenv("SENDER_EMAIL")
sender_password = os.getenv("SENDER_PASSWORD")
email_host = os.getenv("EMAIL_HOST")
email_port = int(os.getenv("EMAIL_PORT"))

def compose_quiz_email(recipient: str, title: str, description: str, shareable_link: str):
    subject = f"Check out this quiz: {title}"
    body = (
        f"Here's a quiz we thought you'd like:\n\n"
        f"Title: {title}\n"
        f"Description: {description}\n"
        f"Access it here: {shareable_link}\n\nEnjoy!"
    )

    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = "noreply@HQuizapp.com"
    message["To"] = recipient
    return message


def send_email(recipient: str, message):
    try:
        with smtplib.SMTP(email_host, email_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail("noreply@HQuizapp.com", recipient, message.as_string())
        logger.info(f"[Email] Email successfully sent to {recipient}")
    except smtplib.SMTPException as e:
        logger.error(f"[Email Error] Failed to send email to {recipient}: {e}")
        raise

