from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()
    
    userData : SQLAlchemyUserDatastore = app.security.datastore
    
    userData.find_or_create_role(name = 'admin')
    userData.find_or_create_role(name = 'user')
    
    if(not userData.find_user(email = 'superadmin@gmail.com')):
        userData.create_user(email = 'superadmin@gmail.com', password = hash_password('12345'), fullname = 'admin', roles = ['admin'])
    if(not userData.find_user(email = 'tripurari18@gmail.com')):
        userData.create_user(email = 'tripurari18@gmail.com', password = hash_password('12345'), fullname = 'tripurari', roles = ['user'])
        
    
    db.session.commit()