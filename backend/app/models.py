from app import db

class Member(db.Model):
    __tablename__ = 'members'
    id        = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name      = db.Column(db.String(100), nullable=False)
    email     = db.Column(db.String(150), nullable=False, unique=True)
    phone     = db.Column(db.String(20))
    gender    = db.Column(db.String(10))
    birthday  = db.Column(db.Date)
    join_date = db.Column(db.Date, nullable=False)

    transactions  = db.relationship('Transaction',  backref='member', cascade='all, delete')
    notifications = db.relationship('Notification', backref='member', cascade='all, delete')

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id          = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id   = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False)
    amount      = db.Column(db.Numeric(10, 2), nullable=False)
    tx_date     = db.Column(db.Date, nullable=False)
    description = db.Column(db.String(200))

class Notification(db.Model):
    __tablename__ = 'notifications'
    id            = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id     = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False)
    offer_content = db.Column(db.Text, nullable=False)
    sent_at       = db.Column(db.DateTime, nullable=False)
    status        = db.Column(db.Enum('sent', 'failed', 'pending'), nullable=False)

class Product(db.Model):
    __tablename__ = 'products'
    id          = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name        = db.Column(db.String(100), nullable=False)
    price       = db.Column(db.Numeric(10, 2), nullable=False)
    category    = db.Column(db.String(20), nullable=False)
    stock       = db.Column(db.Integer, nullable=False, default=0)
    description = db.Column(db.String(200))