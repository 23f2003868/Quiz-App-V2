class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATION = False

class Local(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    DEBUG = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'tripurari2006'
    SECRET_KEY = '200418tripurari'
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379
    
    WTF_CSRF_ENABLED = False
    
    