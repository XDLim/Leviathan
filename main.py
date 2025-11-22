from flask import Flask, render_template, redirect, request, flash
import pyodbc

app = Flask(__name__)
app.config['SECRET_KEY'] = 'LEVIATHAN'

# ---------------- PÁGINA INICIAL ----------------
@app.route('/')
def home():
    return render_template('index.html')  # Página principal do site

# ---------------- LOGIN ----------------
@app.route('/Entrar', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get('email')
        senha = request.form.get('senha')

        conect_BD = pyodbc.connect(
            "Driver={ODBC Driver 17 for SQL Server};"
            "Server=NOTE-JU\\SQLEXPRESS;"
            "Database=leviathan;"
            "Trusted_Connection=yes;"
        )
        cursor = conect_BD.cursor()

        # Verifica se existe usuário com email + senha
        cursor.execute("SELECT email FROM Usuarios WHERE email = ? AND senha = ?", (email, senha))
        usuario = cursor.fetchone()

        cursor.close()
        conect_BD.close()

        if usuario:
            return redirect('/')
        else:
            flash("Email ou senha incorretos!")
            return redirect('/Entrar')

    # GET → mostrar formulário de login
    return render_template('Entrar.html')

# ---------------- CADASTRO ----------------
@app.route('/Cadastrar', methods=["GET", "POST"])
def cadastrar_usuario():
    if request.method == "POST":
        print(request.form) 
        email = request.form.get('email')
        senha = request.form.get('senha')
        confirmarsenha = request.form.get('confirmarsenha')

        if senha != confirmarsenha:
            flash("As senhas não conferem!")
            return redirect('/Cadastrar')

        conect_BD = pyodbc.connect(
            "Driver={ODBC Driver 17 for SQL Server};"
            "Server=NOTE-JU\\SQLEXPRESS;"
            "Database=leviathan;"
            "Trusted_Connection=yes;"
        )
        cursor = conect_BD.cursor()

        # Verifica se o email já existe
        cursor.execute("SELECT email FROM Usuarios WHERE email = ?", (email,))
        if cursor.fetchone():
            flash("Este email já está cadastrado!")
            cursor.close()
            conect_BD.close()
            return redirect('/Cadastrar')

        # Insere usuário
        cursor.execute("INSERT INTO Usuarios (email, senha) VALUES (?, ?)", (email, senha))
        conect_BD.commit()
        cursor.close()
        conect_BD.close()

        flash("Cadastro realizado com sucesso!")
        return redirect('/Entrar')  # redireciona para o mesmo formulário limpo

    return render_template('Cadastrar.html')



# ---------------- EXECUÇÃO ----------------
if __name__ == "__main__":
    app.run(debug=True)
