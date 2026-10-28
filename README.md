# Loja de Perucas · site de exemplo

Exemplo de loja online de perucas de cabelo humano, feito para mostrar à cliente como o site pode ficar.

Duas páginas:

- `index.html`: página inicial com destaque, texturas, coleção com filtro, consultoria pelo WhatsApp, por que cabelo humano, como comprar e dúvidas.
- `produto.html?p=<id>`: página de cada peruca, com galeria, preço, parcelamento, desconto no Pix, botões **Comprar** e **Tirar dúvidas no WhatsApp**, frete e ficha da peça.

## Como ver

Abra o `index.html` no navegador, ou publique a pasta na Vercel ou no GitHub Pages. Não tem build: é HTML, CSS e JavaScript puros.

## Onde mudar as coisas

Tudo que muda de loja para loja fica em `js/data.js`:

- `LOJA`: nome da marca, número do WhatsApp (só dígitos, com 55 e DDD), Instagram, desconto no Pix e número de parcelas.
- `PERUCAS`: lista de peças. Cada uma tem nome, textura (`lisa`, `ondulada` ou `cacheada`), cor, comprimento, touca, densidade, preço e fotos.

Cores e fontes ficam no topo de `css/style.css`.

## Observações

- Preços, nomes e medidas são **exemplos**.
- As fotos são ilustrativas, do [Unsplash](https://unsplash.com) (licença de uso livre). Devem ser trocadas pelas fotos reais das peças.
- Os textos entre colchetes (prazo de envio, política de troca, e-mail) a cliente precisa definir.
- Os botões de sacola, busca e frete são demonstrativos. Na loja de verdade, isso fica com a plataforma de e-commerce.
