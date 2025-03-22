from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)
    fullname = db.Column(db.String, nullable = False)
    dob = db.Column(db.Date, nullable = True)
    qualification = db.Column(db.String, nullable = True)
    
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)
    active = db.Column(db.Boolean, default = True)
    
    roles = db.relationship('Role', backref = 'users', secondary = 'user_roles', lazy = True)
    scores = db.relationship('Score', backref = 'user', lazy = True)
    


class Role(db.Model, RoleMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False, default = 'user' )
    


class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable = False)
    
 

class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable = False)
    description = db.Column(db.Text, nullable = False)
    
    chapters = db.relationship('Chapter', backref = 'subject', lazy = True, cascade="all, delete")



class Chapter(db.Model):
    __tablename__ = 'chapters'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable = False)
    description = db.Column(db.Text, nullable = False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable = False)
    
    quizzes = db.relationship('Quiz', backref = 'chapter', lazy = True, cascade='all, delete')
    
    
    
class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable=False)
    date_of_quiz = db.Column(db.DateTime, nullable = False)
    time_duration = db.Column(db.Integer, nullable = False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id', ondelete='CASCADE'), nullable = False)
    
    questions = db.relationship('Question', backref='quiz', lazy=True, cascade='all, delete')
    scores = db.relationship('Score', backref='quiz', lazy=True, cascade='all, delete')


class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable = False)
    question_statement = db.Column(db.Text, nullable = False)
    option1 = db.Column(db.String, nullable = False)
    option2 = db.Column(db.String, nullable = False)
    option3 = db.Column(db.String)
    option4 = db.Column(db.String)
    correct_option = db.Column(db.String, nullable = False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable = False)
    

class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key = True)
    total_scored = db.Column(db.Integer, nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)