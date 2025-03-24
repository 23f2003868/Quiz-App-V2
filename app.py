from flask import Flask
from backend.config import Local
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore, auth_required


def Quiz():
    app = Flask(__name__, static_folder='frontend', template_folder='frontend', static_url_path='/static')
    
    app.config.from_object(Local)
    
    db.init_app(app)
    
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint = False)
    app.app_context().push()
    
    return app

app = Quiz()

import backend.initial_data

import backend.routes

if __name__ == "__main__":
    app.run()