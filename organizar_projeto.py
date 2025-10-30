import os
import shutil

# Caminho base do projeto (ajuste se necessário)
base_dir = os.path.dirname(os.path.abspath(__file__))

# Pastas principais do novo formato
templates_dir = os.path.join(base_dir, 'templates')
static_dir = os.path.join(base_dir, 'static')
css_dir = os.path.join(static_dir, 'css')
js_dir = os.path.join(static_dir, 'js')
img_dir = os.path.join(static_dir, 'imagens')

# Cria as pastas se não existirem
for folder in [templates_dir, static_dir, css_dir, js_dir, img_dir]:
    os.makedirs(folder, exist_ok=True)

# Extensões de cada tipo
html_ext = ['.html', '.htm']
css_ext = ['.css']
js_ext = ['.js']
img_ext = ['.jpg', '.jpeg', '.png', '.webp', '.ico', '.avif', '.mp4', '.webm']

# Lista de pastas de jogos
jogos_dirs = [d for d in os.listdir(base_dir)
              if os.path.isdir(os.path.join(base_dir, d))
              and d.lower() not in ['templates', 'static', 'node_modules', '.vscode']]

for jogo in jogos_dirs:
    jogo_path = os.path.join(base_dir, jogo)
    print(f'🔄 Reorganizando: {jogo}')

    # Subpasta para imagens desse jogo
    jogo_img_dir = os.path.join(img_dir, jogo.lower())
    os.makedirs(jogo_img_dir, exist_ok=True)

    for root, _, files in os.walk(jogo_path):
        for file in files:
            old_path = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()

            if ext in html_ext:
                shutil.move(old_path, os.path.join(templates_dir, file))
            elif ext in css_ext:
                shutil.move(old_path, os.path.join(css_dir, file))
            elif ext in js_ext:
                shutil.move(old_path, os.path.join(js_dir, file))
            elif ext in img_ext:
                shutil.move(old_path, os.path.join(jogo_img_dir, file))

    # Remove a pasta antiga do jogo
    try:
        shutil.rmtree(jogo_path)
    except Exception as e:
        print(f'⚠️ Não foi possível remover {jogo_path}: {e}')

print("\n✅ Organização concluída com sucesso!")
print("Arquivos HTML → templates/")
print("CSS e JS → static/css e static/js/")
print("Imagens → static/imagens/<jogo>/")