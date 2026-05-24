from flask import Blueprint, request, jsonify
from app import db, mail
from app.models import Member, Transaction, Notification
from flask_mail import Message
from datetime import date, datetime
import pandas as pd

bp = Blueprint('main', __name__)

# 取得所有會員
@bp.route('/api/members', methods=['GET'])
def get_members():
    members = Member.query.all()
    return jsonify([{
        'id': m.id, 'name': m.name, 'email': m.email,
        'phone': m.phone, 'gender': m.gender,
        'birthday': str(m.birthday) if m.birthday else None,
        'join_date': str(m.join_date)
    } for m in members])

# 編輯會員
@bp.route('/api/members/<int:mid>', methods=['PUT'])
def update_member(mid):
    member = Member.query.get_or_404(mid)
    data = request.json
    member.name     = data.get('name',   member.name)
    member.email    = data.get('email',  member.email)
    member.phone    = data.get('phone',  member.phone)
    member.gender   = data.get('gender', member.gender)
    birthday_raw    = data.get('birthday')
    member.birthday = birthday_raw if birthday_raw else None
    db.session.commit()
    return jsonify({'message': '會員更新成功'})

# 刪除會員
@bp.route('/api/members/<int:mid>', methods=['DELETE'])
def delete_member(mid):
    member = Member.query.get_or_404(mid)
    db.session.delete(member)
    db.session.commit()
    return jsonify({'message': '會員刪除成功'})

# 新增會員
@bp.route('/api/members', methods=['POST'])
def add_member():
    data = request.json
    member = Member(
        name=data['name'], email=data['email'],
        phone=data.get('phone'), gender=data.get('gender'),
        birthday=data.get('birthday'), join_date=date.today()
    )
    db.session.add(member)
    db.session.commit()
    return jsonify({'message': '會員新增成功', 'id': member.id}), 201

# 取得所有消費紀錄
@bp.route('/api/transactions', methods=['GET'])
def get_transactions():
    txs = Transaction.query.order_by(Transaction.tx_date.desc()).all()
    return jsonify([{
        'id': t.id, 'member_id': t.member_id,
        'amount': float(t.amount), 'tx_date': str(t.tx_date),
        'description': t.description
    } for t in txs])

# 新增消費紀錄
@bp.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    tx = Transaction(
        member_id=data['member_id'], amount=data['amount'],
        tx_date=data['tx_date'], description=data.get('description')
    )
    db.session.add(tx)
    db.session.commit()
    return jsonify({'message': '消費紀錄新增成功'}), 201

# RFM 分析
@bp.route('/api/rfm', methods=['GET'])
def get_rfm():
    members = Member.query.all()
    txs = Transaction.query.all()
    if not txs:
        return jsonify([])

    tx_data = pd.DataFrame([{
        'member_id': t.member_id, 'amount': float(t.amount),
        'tx_date': pd.to_datetime(t.tx_date)
    } for t in txs])

    today = pd.Timestamp(date.today())
    rfm = tx_data.groupby('member_id').agg(
        recency=('tx_date', lambda x: (today - x.max()).days),
        frequency=('tx_date', 'count'),
        monetary=('amount', 'sum')
    ).reset_index()

    def r_score(days):
        if days <= 7:   return 5
        if days <= 30:  return 4
        if days <= 90:  return 3
        if days <= 180: return 2
        return 1

    def f_score(freq):
        if freq >= 7:  return 5
        if freq >= 5:  return 4
        if freq >= 3:  return 3
        if freq >= 2:  return 2
        return 1

    def m_score(amt):
        if amt >= 8000: return 5
        if amt >= 3000: return 4
        if amt >= 1000: return 3
        if amt >= 500:  return 2
        return 1

    rfm['r'] = rfm['recency'].apply(r_score)
    rfm['f'] = rfm['frequency'].apply(f_score)
    rfm['m'] = rfm['monetary'].apply(m_score)
    rfm['total'] = rfm['r'] + rfm['f'] + rfm['m']

    member_map = {m.id: m.name for m in members}
    result = []
    for _, row in rfm.sort_values('total', ascending=False).iterrows():
        result.append({
            'member_id': int(row['member_id']),
            'name': member_map.get(int(row['member_id']), '未知'),
            'recency': int(row['recency']),
            'frequency': int(row['frequency']),
            'monetary': float(row['monetary']),
            'r': int(row['r']), 'f': int(row['f']), 'm': int(row['m']),
            'total': int(row['total'])
        })
    return jsonify(result)

# 發送優惠通知
@bp.route('/api/notify/<int:member_id>', methods=['POST'])
def send_notify(member_id):
    member = Member.query.get_or_404(member_id)
    data = request.json
    content = data.get('content', 'VIP 專屬優惠，感謝您的支持！')
    try:
        msg = Message(subject='專屬優惠通知',
                      sender=mail.username,
                      recipients=[member.email],
                      body=content)
        mail.send(msg)
        status = 'sent'
    except Exception:
        status = 'failed'

    notif = Notification(
        member_id=member_id, offer_content=content,
        sent_at=datetime.now(), status=status
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify({'message': f'通知已{status}', 'status': status})

# 取得所有商品
@bp.route('/api/products', methods=['GET'])
def get_products():
    from app.models import Product
    products = Product.query.all()
    return jsonify([{
        'id': p.id, 'name': p.name, 'price': float(p.price),
        'category': p.category, 'stock': p.stock,
        'description': p.description
    } for p in products])

# 新增商品
@bp.route('/api/products', methods=['POST'])
def add_product():
    from app.models import Product
    data = request.json
    p = Product(
        name=data['name'], price=data['price'],
        category=data['category'], stock=data.get('stock', 0),
        description=data.get('description')
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'message': '商品新增成功', 'id': p.id}), 201

# 修改商品
@bp.route('/api/products/<int:pid>', methods=['PUT'])
def update_product(pid):
    from app.models import Product
    p = Product.query.get_or_404(pid)
    data = request.json
    p.name        = data.get('name',        p.name)
    p.price       = data.get('price',       p.price)
    p.category    = data.get('category',    p.category)
    p.stock       = data.get('stock',       p.stock)
    p.description = data.get('description', p.description)
    db.session.commit()
    return jsonify({'message': '商品更新成功'})

# 刪除商品
@bp.route('/api/products/<int:pid>', methods=['DELETE'])
def delete_product(pid):
    from app.models import Product
    p = Product.query.get_or_404(pid)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': '商品刪除成功'})