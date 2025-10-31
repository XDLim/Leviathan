import os
import re

# Caminhos base
templates_dir = "templates"
static_css = "../static/css/"
static_img = "../static/imagens/"

# Regex simples para capturar links relativos
link_pattern = re.compile(r'href="([^"]+)"')
src_pattern = re.compile(r'src="([^"]+)"')

def corrigir_caminhos(html):
    # Corrigir CSS
    html = re.sub(r'href="\./.*?\.css"', f'href="{static_css}batman.css"', html)
    
    # Corrigir imagens
    html = re.sub(r'src="\./imagem/', f'src="{static_img}', html)

    # Corrigir vídeos
    html = re.sub(r'src="\./imagem/video ', f'src="{static_img}video ', html)

    return html

def processar_arquivos():
    for root, _, files in os.walk(templates_dir):
        for file in files:
            if file.endswith(".html"):
                caminho = os.path.join(root, file)
                with open(caminho, "r", encoding="utf-8") as f:
                    conteudo = f.read()

                novo_conteudo = corrigir_caminhos(conteudo)

                with open(caminho, "w", encoding="utf-8") as f:
                    f.write(novo_conteudo)

                print(f"✅ Atualizado: {caminho}")

if __name__ == "__main__":
    processar_arquivos()
