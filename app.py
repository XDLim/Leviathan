from flask import Flask, render_template

app = Flask(__name__)

# Lista de jogos (simulando um banco de dados)
jogos = [
    {"id": 1, "imagem": "aventura.jpg", "nome": "Jogo Aventura", "preco": 59.9},
    {"id": 2, "imagem": "corrida.jpg", "nome": "Corrida Máxima", "preco": 79.9},
    {"id": 3, "imagem": "espacial.jpg", "nome": "Batalha Espacial", "preco": 99.9}
]

@app.route('/')
def index():
    return render_template('index.html', jogos=jogos)

if __name__ == '__main__':
    app.run(debug=True)