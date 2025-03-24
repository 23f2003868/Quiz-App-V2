from flask import current_app as app, jsonify, render_template, request
from flask_security import auth_required, verify_password, hash_password
from backend.models import UserRoles, db
from datetime import datetime

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
        