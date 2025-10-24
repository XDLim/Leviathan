from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# "base de dados" com jogos
jogos = [
    {"id": 1, "nome": "Jogo Aventura", "preco": 59.90, "imagem": "aventura.jpg"},
    {"id": 2, "nome": "Corrida Máxima", "preco": 79.90, "imagem": "corrida.jpg"},
    {"id": 3, "nome": "Batalha Espacial", "preco": 99.90, "imagem": "espacial.jpg"}
]

carrinho = []

@app.route("/")
def home():
    return jsonify(jogos)  # Retorna os jogos em formato JSON

@app.route("/adicionar", methods=["POST"])
def adicionar_ao_carrinho():
    id_jogo = request.json.get("id")
    jogo = next((j for j in jogos if j["id"] == id_jogo), None)
    if jogo:
        carrinho.append(jogo)
        return jsonify({"mensagem": "Jogo adicionado!", "carrinho": carrinho})
    return jsonify({"erro": "Jogo não encontrado"}), 404

@app.route("/carrinho")
def ver_carrinho():
    return jsonify(carrinho)

if __name__ == "__main__":
    app.run(debug=True)