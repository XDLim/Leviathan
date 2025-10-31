import os
import re

templates_dir = "templates"

# Regex para encontrar caminhos de imagens
pattern = re.compile(r'src=["\'](?:.*?)(static/[^"\' ]+|img/[^"\' ]+|images/[^"\' ]+)["\']')

for root, dirs, files in os.walk(templates_dir):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            new_content = pattern.sub(
                lambda m: f'src="{{{{ url_for(\'static\', filename=\'{m.group(1).replace("static/", "")}\') }}}}"',
                content
            )

            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"[✔] Atualizado: {file_path}")
