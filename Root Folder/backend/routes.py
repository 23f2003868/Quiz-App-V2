from flask import current_app as app, jsonify, render_template, request, send_file
from flask_security import auth_required, verify_password, hash_password
from backend.models import UserRoles, db
from datetime import datetime
from backend.celery.task import create_csv_quizzes, create_csv_user
from celery.result import AsyncResult

datastore = app.security.datastore

@app.get('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message':'Invalid inputs'}), 404
    
    user = datastore.find_user(email = email)
    
    if not user:
        return jsonify({'message':'Invalid inputs'}), 404
    
    if verify_password(password , user.password):
        return jsonify({'token':user.get_auth_token(), 'email':user.email, 'role':user.roles[0].name, 'id':user.id})
    return jsonify({'message':'Wrong Password'})


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    fullname = data.get('fullname')
    dob_first = data.get('dob')
    qualification = data.get('qualification')
    
    if not email or not password:
        return jsonify({'message':'Email and Password are required'}), 400
    
    user = datastore.find_user(email = email)
    
    if user:
        return jsonify({'message':'User Already exists'}), 409
    
    try:
        
        role = datastore.find_role('user')  #existing role
        if not role:
            role = datastore.create_role(name = 'user')
            db.session.commit()


        dob = datetime.strptime(dob_first, "%Y-%m-%d").date()

        datastore.create_user(email = email, password = hash_password(password), roles=[role], fullname = fullname, dob = dob, qualification = qualification)
        db.session.commit()
        return jsonify({'message':'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({'message':'Error creating user'}), 500
    
    

@app.get('/create-quiz-csv')
def createcsv():
    task = create_csv_quizzes.delay()
    return {'task_id':task.id},200



@app.get('/get-quiz-csv/<id>')
def getCSVQuizzes(id):
    result = AsyncResult(id)
    
    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}')
    else:
        return {'message':'task not ready'},405
    
    
    
@app.get('/user-csv')
def userCSV():
    task = create_csv_user.delay()
    return {'task_id':task.id},200


@app.get('/get-user-csv/<id>')
def getUserCSV(id):
    result = AsyncResult(id)
    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}')
    else:
        return {'message':'task not ready'},405
        