from celery import shared_task
from backend.models import Quiz, User, Score, db
from backend.celery.email_sender import email_send


@shared_task(ignore_result = True)
def send_quiz_reminder():
    latest_quiz = Quiz.query.order_by(Quiz.id.desc()).first()
    
    if latest_quiz:
        users = User.query.all()
        users = users[1:] if users else []
        for user in users:
            subject = "📢 New Quiz Available"
            content = f"""
            <h2 style='color:#2c3e50;'>Hey {user.fullname},</h2>
            <p style='font-size:18px;'>A new quiz <strong>{latest_quiz.title}</strong></p>
            <p>Don't miss out! Take the quiz now.</p>
            <p>Good luck! 🚀</p>
            """
            email_send(user.email, subject, content)
            


@shared_task(ignore_result = True)
def send_monthly_performance():
    
    users = User.query.all()
    users = users[1:] if users else []
    
    for user in users:
        user_quizzes = Score.query.filter(Score.user_id==user.id).all()
        
        if not user_quizzes:
            continue
        
        subject = "📊 Your Monthly Quiz Performance Report"
        
        quiz_summary = "<table border=1 cellpadding='8' cellspacing='0' style='border-collapse:collapse;'>"
        quiz_summary += "<tr><th>Quiz Name</th><th>Score</th></tr>"
        
        for quiz in user_quizzes:
            quiz_summary += f"<tr><td>{quiz.quiz.title}</td><td>{quiz.total_scored}</td></tr>"
            
        quiz_summary += "</table>"
        
        content=f"""
        <h2 style='color:#2c3e50;'>Hello {user.fullname},</h2>
        <p>Here's your performance summary for this month:</p>
        {quiz_summary}
        <p>Keep improving and take on more challenges! 💡</p>
        """
        
        email_send(user.email, subject, content)