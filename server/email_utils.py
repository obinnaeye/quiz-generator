import smtplib
import os
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("SENDER_EMAIL")  # Load from .env
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

def send_otp_email(email: str, otp: str, token: str):
    subject = "Please verify your account on Quiz Generator"
    verification_link = f"http://localhost:8000/verify-link/?token={token}"
    body = f"""

    Thank you for registering!
    
    To verify your email, you can either:
    1. Enter the OTP: {otp}
    2. Or click the following link: {verification_link}"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = email

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False