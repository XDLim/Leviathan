const imagem = document.getElementById("imagemEscolhida");
const inputImagem = document.getElementById("inputImagem");
const form = document.getElementById("formFoto");

imagem.addEventListener("click", () => inputImagem.click());

inputImagem.addEventListener("change", () => {
    const file = inputImagem.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => {
            imagem.src = reader.result; // mostra a foto imediatamente
        };
        reader.readAsDataURL(file);

        // envia automaticamente para o servidor
        form.submit();
    }
});
