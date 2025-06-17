from flask_sqlalchemy import SQLAlchemy
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    """Modelo para atendentes que podem fazer login no sistema"""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        """Define a senha do usuário (hash)"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """Verifica se a senha está correta"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email
        }


class Guest(db.Model):
    """Modelo para convidados que consomem drinks"""
    id = db.Column(db.Integer, primary_key=True)
    qr_code = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=True)
    total_drinks_allowed = db.Column(db.Integer, nullable=False, default=3)
    drinks_consumed = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f'<Guest {self.qr_code}>'

    def can_consume_drink(self):
        """Verifica se o convidado ainda pode consumir mais drinks"""
        return self.drinks_consumed < self.total_drinks_allowed

    def consume_drink(self):
        """Registra o consumo de um drink"""
        if self.can_consume_drink():
            self.drinks_consumed += 1
            return True
        return False

    def to_dict(self):
        return {
            'id': self.id,
            'qr_code': self.qr_code,
            'name': self.name or f'Convidado {self.qr_code}',
            'total_drinks_allowed': self.total_drinks_allowed,
            'drinks_consumed': self.drinks_consumed,
            'can_consume_more': self.can_consume_drink()
        }

