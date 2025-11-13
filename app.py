from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'levia_chave_secreta'  # Necessário para usar sessão

# --- Lista de jogos (simula um banco de dados) ---
jogos = [
    {"id": 1, "imagem": "batman.jpg", "nome": "Batman Arkham", "classificacao": "14 anos", "preco": 99.90},
    {"id": 2, "imagem": "fortnite.jpg", "nome": "Fortnite", "classificacao": "12 anos", "preco": 0.00},
    {"id": 3, "imagem": "elden_ring.jpg", "nome": "Elden Ring", "classificacao": "16 anos", "preco": 249.90},
    {"id": 4, "imagem": "god_of_war.jpg", "nome": "God of War", "classificacao": "18 anos", "preco": 199.90},
    {"id": 5, "imagem": "nba2k25.jpg", "nome": "NBA 2K25", "classificacao": "Livre", "preco": 299.90}
]

# --- Página inicial (lista de jogos) ---
@app.route('/')
def index():
    return render_template('index.html', jogos=jogos)

# --- Adicionar item ao carrinho ---
@app.route('/add_carrinho/<int:id>')
def add_carrinho(id):
    if 'carrinho' not in session:
        session['carrinho'] = []
    for jogo in jogos:
        if jogo['id'] == id:
            session['carrinho'].append(jogo)
            break
    session.modified = True
    return redirect(url_for('ver_carrinho'))

# --- Remover item do carrinho ---
@app.route('/remover/<int:id>')
def remover(id):
    if 'carrinho' in session:
        session['carrinho'] = [j for j in session['carrinho'] if j['id'] != id]
        session.modified = True
    return redirect(url_for('ver_carrinho'))

# --- Página do carrinho ---
@app.route('/carrinho')
def ver_carrinho():
    carrinho = session.get('carrinho', [])
    total = sum(j['preco'] for j in carrinho)
    return render_template('carrinho.html', carrinho=carrinho, total=total)

if __name__ == '__main__':
    app.run(debug=True)