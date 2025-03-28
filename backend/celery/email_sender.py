import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_SERVER = "localhost"
SMPT_PORT = 1025
SENDER_EMAIL = 'admin@gmail.com'
SENDER_PASSWORD = ''


def email_send(to, subject, content):
    message = MIMEMultipart()
    message['To'] = to
    message['Subject'] = subject
    message['From'] = SENDER_EMAIL
    
    message.attach(MIMEText(content, 'html'))
    
    with smtplib.SMTP(host=SMTP_SERVER, port=SMPT_PORT) as client:
        client.send_message(message)
        client.quit()