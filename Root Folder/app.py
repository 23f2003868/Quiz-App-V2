from flask import Flask
from backend.config import Local
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from flask_caching import Cache
from backend.celery.celery_config import celery_init_app
import flask_excel as excel


def Quiz():
    app = Flask(__name__, static_folder='frontend', template_folder='frontend', static_url_path='/static')
    
    app.config.from_object(Local)
    
    db.init_app(app)
    
    cache = Cache(app)
    
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.cache = cache
    
    app.security = Security(app, datastore=datastore, register_blueprint = False)
    app.app_context().push()
    
    from backend.resource import api
    api.init_app(app)
    
    return app

app = Quiz()

celery_app = celery_init_app(app)
import backend.celery.schedule_email

import backend.initial_data

import backend.routes

excel.init_excel(app)

if __name__ == "__main__":
    app.run()