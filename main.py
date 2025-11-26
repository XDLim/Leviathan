from flask import Flask, render_template, redirect, request, flash, session
import os
from werkzeug.utils import secure_filename
from mysql.connector import pooling

app = Flask(__name__)
app.config['SECRET_KEY'] = 'LEVIATHAN'
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ---------------- POOL DE CONEXÕES ----------------
pool = pooling.MySQLConnectionPool(
    pool_name="meu_pool",
    pool_size=5,
    pool_reset_session=True,
    host=os.getenv("yamabiko.proxy.rlwy.net"),
    database=os.getenv("railway"),
    user=os.getenv("root"),
    password=os.getenv("OcsXzaKGlklNLEGLjUsToGNUZePeUpaQ"),
    port=int(os.getenv(29673))
)


def conectar_bd():
    return pool.get_connection()

# ---------------- FUNÇÃO AUXILIAR ----------------
def obter_usuario_logado():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return None
    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("SELECT email, foto_perfil FROM Usuarios WHERE email = %s", (usuario_email,))
        row = cursor.fetchone()
        cursor.close()
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

        with conectar_bd() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "UPDATE Usuarios SET foto_perfil = %s WHERE email = %s",
                (f"/static/uploads/{filename}", usuario_email)
            )
            conexao.commit()
            cursor.close()

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

        with conectar_bd() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "SELECT email FROM Usuarios WHERE email = %s AND senha = %s",
                (email, senha)
            )
            usuario = cursor.fetchone()
            cursor.close()

        if usuario:
            session['usuario_logado'] = email
            return redirect('/')
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

        with conectar_bd() as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT email FROM Usuarios WHERE email = %s", (email,))
            if cursor.fetchone():
                flash("Este email já está cadastrado!")
                cursor.close()
                return redirect('/Cadastrar')

            cursor.execute("INSERT INTO Usuarios (email, senha) VALUES (%s, %s)", (email, senha))
            conexao.commit()
            cursor.close()

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
    jogos_ids = {
        "skul": 1, "God": 2, "Elder": 3, "Fortnite": 4, "Rocket": 5,
        "Red": 6, "fc2025": 7, "spider": 8, "batman": 9, "nba": 10, "Valorant": 11
    }
    id_jogo = jogos_ids.get(nome_jogo)
    if not id_jogo:
        return "Jogo não encontrado!", 404
    try:
        return render_template(f"{nome_jogo}.html", usuario=usuario, id_jogo=id_jogo)
    except:
        return "Jogo não encontrado!", 404

# ---------------- ADICIONAR AO CARRINHO ----------------
@app.route('/adicionar_carrinho/<int:jogo_id>')
def adicionar_carrinho(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    # Com UNIQUE constraint, não precisamos verificar antes
    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("""
            INSERT INTO Carrinho (usuario_email, jogo_id, quantidade)
            VALUES (%s, %s, 1)
            ON DUPLICATE KEY UPDATE quantidade = quantidade + 1
        """, (usuario_email, jogo_id))
        conexao.commit()
        cursor.close()

    return redirect('/carrinho')

# ---------------- PÁGINA CARRINHO ----------------
@app.route('/carrinho')
def carrinho():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT c.jogo_id, j.nome, j.preco, j.imagem, c.quantidade
            FROM Carrinho c
            JOIN Jogos j ON c.jogo_id = j.id
            WHERE c.usuario_email=%s
        """, (usuario_email,))
        linhas = cursor.fetchall()
        cursor.close()

    itens = [
        {'jogo_id': l[0], 'nome': l[1], 'preco': float(l[2]),
         'imagem': l[3], 'quantidade': l[4], 'total_item': float(l[2])*l[4]}
        for l in linhas
    ]
    subtotal = sum(item['total_item'] for item in itens)

    return render_template('Carrinho.html', itens=itens, subtotal=subtotal)


@app.route('/remover_item/<int:jogo_id>', methods=['POST'])
def remover_item(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM ListaDesejo WHERE usuario_email=%s AND jogo_id=%s",
                       (usuario_email, jogo_id))
        conexao.commit()
        cursor.close()

    return redirect('/carrinho')

# ---------------- LISTA DE DESEJO ----------------
@app.route('/adicionar_listadesejo/<int:jogo_id>')
def adicionar_listadesejo(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    # Mesma otimização que o carrinho
    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("""
            INSERT INTO ListaDesejo (usuario_email, jogo_id, quantidade)
            VALUES (%s, %s, 1)
            ON DUPLICATE KEY UPDATE quantidade = quantidade + 1
        """, (usuario_email, jogo_id))
        conexao.commit()
        cursor.close()

    return redirect('/listadesejo')

@app.route('/listadesejo')
def listadesejo():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT c.jogo_id, j.nome, j.preco, j.imagem, c.quantidade
            FROM ListaDesejo c
            JOIN Jogos j ON c.jogo_id = j.id
            WHERE c.usuario_email=%s
        """, (usuario_email,))
        linhas = cursor.fetchall()
        cursor.close()

    itens = [
        {'jogo_id': l[0], 'nome': l[1], 'preco': float(l[2]),
         'imagem': l[3], 'quantidade': l[4], 'total_item': float(l[2])*l[4]}
        for l in linhas
    ]
    subtotal = sum(item['total_item'] for item in itens)

    return render_template('desejo.html', itens=itens, subtotal=subtotal)



@app.route('/remover_item_lista/<int:jogo_id>', methods=['POST'])
def remover_item_listadesejo(jogo_id):
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM ListaDesejo WHERE usuario_email=%s AND jogo_id=%s",
                       (usuario_email, jogo_id))
        conexao.commit()
        cursor.close()

    return redirect('/listadesejo')

@app.route('/limpar_lista', methods=['POST'])
def limpar_lista():
    usuario_email = session.get('usuario_logado')
    if not usuario_email:
        return redirect('/Entrar')

    with conectar_bd() as conexao:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM ListaDesejo WHERE usuario_email=%s", (usuario_email,))
        conexao.commit()
        cursor.close()

    return redirect('/listadesejo')

#--------------- SOBRE -----------    
@app.route('/sobre')
def sobre():
    return render_template('/sobre.html')

# ---------------- EXECUÇÃO ----------------
if __name__ == "__main__":
    from waitress import serve
    import os
    port = int(os.environ.get("PORT", 5000))
    serve(app, host="0.0.0.0", port=port)

