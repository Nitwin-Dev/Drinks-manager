import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from src.models.user import db, User, Guest
from src.routes.user import user_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-in-production'

# Configurar JWT
jwt = JWTManager(app)

# Configurar CORS para permitir requisições do frontend
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def create_sample_data():
    """Cria dados de exemplo para teste"""
    # Criar um atendente de exemplo
    if not User.query.filter_by(email='atendente@teste.com').first():
        user = User(email='atendente@teste.com')
        user.set_password('123456')
        db.session.add(user)
    
    # Criar alguns convidados de exemplo com novos códigos de 6 caracteres
    sample_guests = [
        {'qr_code': 'ABC123', 'name': 'João Silva', 'total_drinks_allowed': 3},
        {'qr_code': 'XYZ789', 'name': 'Maria Santos', 'total_drinks_allowed': 2},
        {'qr_code': 'DEF456', 'name': None, 'total_drinks_allowed': 4},
        # Manter códigos antigos para compatibilidade durante transição
        {'qr_code': 'usr_a49fd8', 'name': 'João Silva (Antigo)', 'total_drinks_allowed': 3},
        {'qr_code': 'usr_b52ge9', 'name': 'Maria Santos (Antigo)', 'total_drinks_allowed': 2},
        {'qr_code': 'usr_c73hf1', 'name': 'Convidado (Antigo)', 'total_drinks_allowed': 4},
    ]
    
    for guest_data in sample_guests:
        if not Guest.query.filter_by(qr_code=guest_data['qr_code']).first():
            guest = Guest(
                qr_code=guest_data['qr_code'],
                name=guest_data['name'],
                total_drinks_allowed=guest_data['total_drinks_allowed']
            )
            db.session.add(guest)
    
    db.session.commit()

with app.app_context():
    db.create_all()
    create_sample_data()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

