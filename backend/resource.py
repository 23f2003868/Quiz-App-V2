from flask import jsonify, request
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required
from backend.models import User, Subject, Chapter, Quiz, Question, Score, db
from datetime import datetime

api = Api(prefix='/api')

subjects = {
    'id' : fields.Integer,
    'name' : fields.String,
    'description' : fields.String
}

chapters = {
    'id' : fields.Integer,
    'name' : fields.String,
    'description' : fields.String,
    'subject_id' : fields.Integer
}

quizzes = {
    'id' : fields.Integer,
    'title' : fields.String,
    'date_of_quiz' : fields.String,
    'time_duration' : fields.Integer,
    'chapter_id' : fields.Integer
}

questions = {
    'id' : fields.Integer,
    'title' : fields.String,
    'question_statement' : fields.String,
    'option1' : fields.String,
    'option2' : fields.String,
    'option3' : fields.String,
    'option4' : fields.String,
    'correct_option' : fields.String,
    'quiz_id' : fields.Integer
}

scores = {
    'id' : fields.Integer,
    'quiz_id' : fields.Integer,
    'user_id' : fields.Integer,
    'total_scored' : fields.Integer
}


class Subjects(Resource):
    @marshal_with(subjects)
    @auth_required('token')
    def get(self, id):
        subject = Subject.query.get(id)
        if not subject:
            return {'message' : 'Not Found'}, 404
        return subject
    
    
    @auth_required('token')
    def put(self, id):
        subject = Subject.query.get(id)
        if not subject:
            return {'message' : 'Not Found'}, 404
        data = request.get_json()
        subject.name = data.get('name', subject.name)
        subject.description = data.get('description', subject.description)
        db.session.commit()
        return {'message' : 'Subject updated successfully'}, 200
        
    
    @auth_required('token')
    def delete(self, id):
        subject = Subject.query.get(id)
        if not subject:
            return {'message' : 'Not Found'}, 404
        db.session.delete(subject)
        db.session.commit()
        return {'message' : 'Subject deleted successfully'}, 200
    
    
class SubjectsList(Resource):
    @marshal_with(subjects)
    @auth_required('token')
    def get(self):
        subject = Subject.query.all()
        return subject
    
    
    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        subject = Subject(name = name, description = description)
        db.session.add(subject)
        db.session.commit()
        return {'message':'Subject added successfully'}, 201


class Chapters(Resource):
    @marshal_with(chapters)
    @auth_required('token')
    def get(self, id):
        chapter = Chapter.query.get(id)
        if not chapter:
            return {'message' : 'Not Found'}, 400
        return chapter
    
    
    @auth_required('token')
    def put(self, id):
        chapter = Chapter.query.get(id)
        if not chapter:
            return {'message' : 'Not Found'}, 404
        data = request.get_json()
        chapter.name = data.get('name', chapter.name)
        chapter.description = data.get('description', chapter.description)
        chapter.subject_id = data.get('subject_id', chapter.subject_id)
        db.session.commit()
        return {'message' : 'Chapter updated successfully'}
    
    
    @auth_required('token')
    def delete(self, id):
        chapter = Chapter.query.get(id)
        if not chapter:
            return {'message' : 'Not Found'}, 400
        db.session.delete(chapter)
        db.session.commit()
    
    
class ChaptersList(Resource):
    @marshal_with(chapters)
    @auth_required('token')
    def get(self,subject_id):
        chapters = Chapter.query.filter_by(subject_id=subject_id).all()
        return chapters
    
    
    @auth_required('token')
    def post(self,subject_id):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        chapter = Chapter(name = name, description = description, subject_id = subject_id)
        db.session.add(chapter)
        db.session.commit()
        return {'message':'Chapter added successfully'}


class Quizzes(Resource):
    @marshal_with(quizzes)
    @auth_required('token')
    def get(self, chapter_id):
        quiz = Quiz.query.filter_by(chapter_id=chapter_id).all()
        if not quiz:
            return {'message' : 'Not Found'}, 400
        
        response = [
            {
                'id' : q.id,
                'title' : q.title,
                'date_of_quiz' : q.date_of_quiz.strftime('%Y-%m-%d'),
                'time_duration' : q.time_duration,
                'chapter_id' : q.chapter_id
            }
            for q in quiz
        ]
        return response
    
    
    @auth_required('token')
    def post(self,chapter_id):
        data = request.get_json()
        title = data.get('title')
        date_of_quiz = datetime.strptime(data.get('date_of_quiz'), '%Y-%m-%d')
        time_duration = data.get('time_duration')
        quiz = Quiz(title = title, date_of_quiz = date_of_quiz, time_duration = time_duration, chapter_id = chapter_id)
        db.session.add(quiz)
        db.session.commit()
        return {'message':'Quiz created successfully'}, 201
    
    
class QuizzesList(Resource):
    @marshal_with(quizzes)
    @auth_required('token')
    def put(self, id):
        quiz = Quiz.query.get(id)
        if not quiz:
            return {'message' : 'Not Found'}, 404
        data = request.get_json()
        quiz.title = data.get('title', quiz.title)
        quiz.date_of_quiz = datetime.strptime(data.get('date_of_quiz', quiz.date_of_quiz.strftime('%Y-%m-%d')), '%Y-%m-%d')
        quiz.time_duration = data.get('time_duration', quiz.time_duration)
        db.session.commit()
        return {'message' : 'Quiz updated successfully'}, 200
    
    
    @auth_required('token')
    def get(self,id=None):
        
        if id:
            quiz = Quiz.query.filter_by(id=id).first()
            if not quiz:
                return {'message' : 'Not Found'}, 400
            return{
                'id' : quiz.id,
                'title' : quiz.title,
                'date_of_quiz' : quiz.date_of_quiz.strftime('%Y-%m-%d'),
                'time_duration' : quiz.time_duration,
                'chapter_id' : quiz.chapter_id
            }
    
        else:
            quiz = Quiz.query.all()
            if not quiz:
                return {'message' : 'Not Found'}, 400
            response = [
                {
                    'id' : q.id,
                    'title' : q.title,
                    'date_of_quiz' : q.date_of_quiz.strftime('%Y-%m-%d'),
                    'time_duration' : q.time_duration,
                    'chapter_id' : q.chapter_id
                }
                for q in quiz
            ]
            return response
    
    
    @auth_required('token')
    def delete(self, id):
        quiz = Quiz.query.get(id)
        if not quiz:
            return {'message' : 'Not Found'}, 400
        db.session.delete(quiz)
        db.session.commit()
        return{'message': 'Quiz Deletes successfully'}
    

class Questions(Resource):
    @marshal_with(questions)
    @auth_required('token')
    def get(self, id):
        question = Question.query.filter_by(quiz_id=id).all()
        if not question:
            return {'message' : 'Not Found'}, 404
        return question
    
    
    @auth_required('token')
    def post(self, id):
        data = request.get_json()
        title = data.get('title')
        question_statement = data.get('question_statement')
        options = data.get('options',[])
        option1 = options[0]
        option2 = options[1]
        option3 = options[2]
        option4 = options[3]
        correct_option = data.get('correct_option')
        question = Question(title = title, question_statement = question_statement, option1 = option1, option2 = option2, option3 = option3, option4 = option4, correct_option = correct_option, quiz_id = id)
        db.session.add(question)
        db.session.commit()
        return {'message':'Question added successfully'}
    
    
    @auth_required('token')
    def put(self, id):
        question = Question.query.get(id)
        if not question:
            return {'message' : 'Not Found'}, 404
        data = request.get_json()
        question.title = data.get('title', question.title)
        question.question_statement = data.get('question_statement', question.question_statement)
        question.option1 = data.get('option1', question.option1)
        question.option2 = data.get('option2', question.option2)
        question.option3 = data.get('option3', question.option3)
        question.option4 = data.get('option4', question.option4)
        question.correct_option = data.get('correct_option', question.correct_option)
        db.session.commit()
        return {'message' : 'Question updated successfully'}, 200
    
    
    @auth_required('token')
    def delete(self, id):
        question = Question.query.get(id)
        if not question:
            return {'message' : 'Not Found'}, 400
        db.session.delete(question)
        db.session.commit()


class SubmitQuiz(Resource):
    @marshal_with(scores)
    @auth_required('token')
    def post(self):
        data = request.get_json()
        print(data)
        quiz_id = data.get('quiz_id')
        user_id = data.get('user_id')
        total_scored = data.get('score')
        
        
        newScore = Score(quiz_id = quiz_id, user_id = user_id, total_scored = total_scored)
        db.session.add(newScore)
        db.session.commit()
        print("Store data:", newScore.quiz_id, newScore.user_id, newScore.total_scored)
        return newScore
    
    
    @auth_required('token')
    def get(self,user_id):
        scores = Score.query.filter_by(user_id=user_id).all()
        if not scores:
            return{'message':'No scores found'}
        
        user_statistics = []
        for score in scores:
            quiz = Quiz.query.get(score.quiz_id)
            user_statistics.append({
                'quiz_id' : score.quiz_id,
                'quiz_title' : quiz.title,
                'total_scored' : score.total_scored
            })
        return user_statistics


class QuizSummary(Resource):
    @auth_required('token')
    def get(self):
        role = request.headers.get('Role')
        user_id = request.headers.get('UserId')
        
        if not role or not user_id:
            return{'message':'Missing role and userId'},400
        
        if role == 'user':
            scores = Score.query.filter_by(user_id=user_id).all()
            if not scores:
                return{'message':'No scores found'},400
            
            user_stats = [
                {
                    'quiz_id':score.quiz_id,
                    'quiz_title': Quiz.query.get(score.quiz_id).title,
                    'total_scored':score.total_scored
                } for score in scores
            ]
            
            return jsonify({
                'userStats':user_stats
            })
            
        elif role == 'admin':
            quizzes = Quiz.query.all()
            
            quiz_attempts = [
                {
                    'quiz_id':quiz.id,
                    'quiz_title':quiz.title,
                    'attempts':Score.query.filter_by(quiz_id=quiz.id).count()
                } for quiz in quizzes
            ]
            
            top_scores = Score.query.order_by(Score.total_scored.desc()).limit(5).all()
            top_scores_list = [
                {
                    'quiz_id':score.quiz_id,
                    'quiz_title':Quiz.query.get(score.quiz_id).title,
                    'user_id':score.user_id,
                    'user_name':User.query.get(score.user_id).fullname,
                    'total_scored':score.total_scored
                    
                } for score in top_scores
            ]
            return jsonify({'quizAttempts':quiz_attempts, 'topScores':top_scores_list})





api.add_resource(SubjectsList, '/subjects')
api.add_resource(Subjects, '/subjects/<int:id>')
api.add_resource(ChaptersList, '/subjects/<int:subject_id>/chapters')
api.add_resource(Chapters, '/chapters/<int:id>')
api.add_resource(Quizzes, '/chapters/<int:chapter_id>/quizzes')
api.add_resource(QuizzesList, '/quizzes/<int:id>', '/quizzes')
api.add_resource(Questions, '/quizzes/<int:id>/questions', '/questions/<int:id>')
api.add_resource(SubmitQuiz, '/submit_quiz', '/user/<int:user_id>/score')
api.add_resource(QuizSummary, '/quiz_summary')