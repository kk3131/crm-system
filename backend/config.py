import os

class Config:
    _db_url = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1:3306/crm_db')
    SQLALCHEMY_DATABASE_URI = _db_url.replace('mysql://', 'mysql+pymysql://') if _db_url.startswith('mysql://') else _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')