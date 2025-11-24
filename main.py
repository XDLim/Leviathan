from flask import Flask, render_template, redirect, request, flash, session
import pyodbc
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'LEVIATHAN'
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# ---------------- FUNÇÃO AUXILIAR ----------------
def conectar_bd():
    return pyodbc.connect(
        "Driver={ODBC Driver 17 for SQL Server};"
        "Server=NOTE-JU\\SQLEXPRESS;"
        "Database=leviathan;"
        "Trusted_Connection=yes;"
    )


def obter_usuario_logado():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return None
    conexao = conectar_bd()
    cursor = conexao.cursor()
    cursor.execute("SELECT email, foto_perfil FROM Usuarios WHERE email = ?", (usuario_email,))
    row = cursor.fetchone()
    cursor.close()
    conexao.close()
    if row:
        return {'email': row[0], 'foto_perfil': row[1]}
    return None


# ---------------- UPLOAD DE FOTO ----------------
@app.route('/upload_foto', methods=['POST'])
def upload_foto():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    foto = request.files.get('foto')
    if foto:
        filename = secure_filename(f"{usuario_email}_{foto.filename}")
        caminho_salvar = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        foto.save(caminho_salvar)

        conexao = conectar_bd()
        cursor = conexao.cursor()
        cursor.execute("UPDATE Usuarios SET foto_perfil = ? WHERE email = ?", (f"/static/uploads/{filename}", usuario_email))
        conexao.commit()
        cursor.close()
        conexao.close()

    return redirect('/')


# ---------------- PÁGINA INICIAL ----------------
@app.route('/')
def home():
    usuario = obter_usuario_logado()
    return render_template('index.html', usuario=usuario)


# ---------------- LOGIN ----------------
@app.route('/Entrar', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get('email')
        senha = request.form.get('senha')

        conexao = conectar_bd()
        cursor = conexao.cursor()
        cursor.execute("SELECT email FROM Usuarios WHERE email = ? AND senha = ?", (email, senha))
        usuario = cursor.fetchone()
        cursor.close()
        conexao.close()

        if usuario:
            session['usuario_logado'] = email
            return redirect('/')
        else:
            flash("Email ou senha incorretos!")
            return redirect('/Entrar')

    return render_template('Entrar.html')


# ---------------- CADASTRO ----------------
@app.route('/Cadastrar', methods=["GET", "POST"])
def cadastrar_usuario():
    if request.method == "POST":
        email = request.form.get('email')
        senha = request.form.get('senha')
        confirmarsenha = request.form.get('confirmarsenha')

        if senha != confirmarsenha:
            flash("As senhas não conferem!")
            return redirect('/Cadastrar')

        conexao = conectar_bd()
        cursor = conexao.cursor()
        cursor.execute("SELECT email FROM Usuarios WHERE email = ?", (email,))
        if cursor.fetchone():
            flash("Este email já está cadastrado!")
            cursor.close()
            conexao.close()
            return redirect('/Cadastrar')

        cursor.execute("INSERT INTO Usuarios (email, senha) VALUES (?, ?)", (email, senha))
        conexao.commit()
        cursor.close()
        conexao.close()

        flash("Cadastro realizado com sucesso!")
        return redirect('/Entrar')

    return render_template('Cadastrar.html')


# ---------------- LOGOUT ----------------
@app.route('/logout')
def logout():
    session.pop('usuario_logado', None)
    return redirect('/')


# ---------------- PÁGINA DO JOGO ----------------
@app.route('/jogo/<nome_jogo>')
def jogo(nome_jogo):
    usuario = obter_usuario_logado()

    # Mapeamento de nomes de jogos para IDs
    jogos_ids = {
        "skul": 1,
        "God": 2,
        "Elder": 3,
        "Fortnite": 4,
        "Rocket": 5,
        "Red": 6,
        "fc2025": 7,
        "spider": 8,
        "batman": 9,
        "nba": 10,
        "Valorant": 11
    }

    id_jogo = jogos_ids.get(nome_jogo)
    if not id_jogo:
        return "Jogo não encontrado!", 404

    try:
        return render_template(
            f"{nome_jogo}.html",
            usuario=usuario,
            id_jogo=id_jogo  # PASSA O ID DO JOGO PARA O TEMPLATE
        )
    except:
        return "Jogo não encontrado!", 404


# ---------------- ADICIONAR AO CARRINHO ----------------
@app.route('/adicionar_carrinho/<int:jogo_id>')
def adicionar_carrinho(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    conexao = conectar_bd()
    cursor = conexao.cursor()

    cursor.execute("SELECT quantidade FROM Carrinho WHERE usuario_email=? AND jogo_id=?", (usuario_email, jogo_id))
    row = cursor.fetchone()
    if row:
        cursor.execute("UPDATE Carrinho SET quantidade = quantidade + 1 WHERE usuario_email=? AND jogo_id=?", (usuario_email, jogo_id))
    else:
        cursor.execute("INSERT INTO Carrinho (usuario_email, jogo_id, quantidade) VALUES (?, ?, 1)", (usuario_email, jogo_id))

    conexao.commit()
    cursor.close()
    conexao.close()

    return redirect('/carrinho')


# ---------------- PÁGINA CARRINHO ----------------
@app.route('/carrinho')
def carrinho():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    conexao = conectar_bd()
    cursor = conexao.cursor()
    cursor.execute("""
        SELECT c.jogo_id, j.nome, j.preco, j.imagem, c.quantidade
        FROM Carrinho c
        JOIN Jogos j ON c.jogo_id = j.id
        WHERE c.usuario_email=?
    """, (usuario_email,))
    linhas = cursor.fetchall()
    cursor.close()
    conexao.close()

    itens = []
    subtotal = 0

    for linha in linhas:
        preco_unit = float(linha[2])
        quantidade = linha[4]
        total_item = preco_unit * quantidade

        subtotal += total_item

        itens.append({
            'jogo_id': linha[0],
            'nome': linha[1],
            'preco': preco_unit,
            'imagem': linha[3],
            'quantidade': quantidade,
            'total_item': total_item
        })

    return render_template('Carrinho.html', itens=itens, subtotal=subtotal)

# ---------- REMOVER JOGO ------------
@app.route('/remover_item/<int:jogo_id>', methods=['POST'])
def remover_item(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    conexao = conectar_bd()
    cursor = conexao.cursor()
    cursor.execute("DELETE FROM Carrinho WHERE usuario_email=? AND jogo_id=?", 
        (usuario_email, jogo_id))
    conexao.commit()
    cursor.close()
    conexao.close()

    return redirect('/carrinho')

# --------- ADICIONAR A LISTA DE DESEJO -----------

@app.route('/adicionar_listadesejo/<int:jogo_id>')
def adicionar_listadesejo(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    conexao = conectar_bd()
    cursor = conexao.cursor()

    cursor.execute("SELECT quantidade FROM ListaDesejo WHERE usuario_email=? AND jogo_id=?", (usuario_email, jogo_id))
    row = cursor.fetchone()
    if row:
        cursor.execute("UPDATE ListaDesejo SET quantidade = quantidade + 1 WHERE usuario_email=? AND jogo_id=?", (usuario_email, jogo_id))
    else:
        cursor.execute("INSERT INTO ListaDesejo (usuario_email, jogo_id, quantidade) VALUES (?, ?, 1)", (usuario_email, jogo_id))

    conexao.commit()
    cursor.close()
    conexao.close()

    return redirect('/listadesejo')


#-------------- PAGINA LISTA DE DESEJO -------------------
@app.route('/listadesejo')
def listadesejo():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')
    
    conexao = conectar_bd()
    cursor = conexao.cursor()
    
    cursor.execute("""
    SELECT c.jogo_id, j.nome, j.preco, j.imagem, c.quantidade
    FROM ListaDesejo c
    JOIN Jogos j ON c.jogo_id = j.id
    WHERE c.usuario_email=?
    """, (usuario_email,))


    linhas = cursor.fetchall()
    cursor.close()
    conexao.close()

    itens = []
    subtotal = 0

    for linha in linhas:
        preco_unit = float(linha[2])  # agora é o preço
        quantidade = linha[4]  # cada item na lista de desejos é 1 por padrão
        total_item = preco_unit * quantidade

        subtotal += total_item

        itens.append({
            'jogo_id': linha[0],
            'nome': linha[1],
            'preco': preco_unit,
            'imagem': linha[3],
            'quantidade': quantidade,
            'total_item': total_item
        })


    return render_template('desejo.html', itens=itens, subtotal=subtotal)

#------------ REMOVER JOGO LISTA DE DESEJO -----------
@app.route('/remover_item_lista/<int:jogo_id>', methods=['POST'])
def remover_item_listadesejo(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    conexao = conectar_bd()
    cursor = conexao.cursor()
    cursor.execute("DELETE FROM ListaDesejo WHERE usuario_email=? AND jogo_id=?", 
        (usuario_email, jogo_id))
    
    conexao.commit()
    cursor.close()
    conexao.close()

    return redirect('/listadesejo')

# ---------- LIMPAR LISTA DE DESEJO --------------
@app.route('/limpar_lista', methods=['POST'])
def limpar_lista():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    conexao = conectar_bd()
    cursor = conexao.cursor()

    # Deleta todos os itens do usuário logado
    cursor.execute("DELETE FROM ListaDesejo WHERE usuario_email = ?", (usuario_email,))
    
    conexao.commit()
    cursor.close()
    conexao.close()

    return redirect('/listadesejo')





# ---------------- EXECUÇÃO ----------------
if __name__ == "__main__":
    app.run(debug=True)
