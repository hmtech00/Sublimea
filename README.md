# Sublimaê — Artes Personalizadas · Site oficial

Vitrine digital do catálogo Sublimaê, construída com HTML, CSS e JavaScript puros (sem frameworks e sem etapa de build).
Este site **não exibe preços** em nenhuma parte: o visitante consulta os produtos e solicita orçamento pelo WhatsApp.

## Estrutura

```
index.html                 Página única (cabeçalho, hero, categorias, catálogo, sobre, chamada final, rodapé)
assets/css/styles.css      Estilos (mobile-first, cores da marca)
assets/js/produtos.js      Dados do catálogo: 72 produtos e 17 categorias (sem preços)
assets/js/app.js           Busca, filtros, galeria ampliada, lista de interesse, links do WhatsApp
assets/img/logo*.webp      Logotipo original
assets/img/destaque-*.webp Fotos de destaque do hero (originais)
assets/img/produtos/       Fotos originais dos produtos em WebP: <codigo>.webp (até 1400 px) e <codigo>-sm.webp (até 640 px)
assets/img/favicon.png, apple-touch-icon.png, og-image.jpg
```

## Como testar localmente

Abrir o `index.html` direto no navegador já funciona. Para simular um servidor (recomendado):

```bash
python3 -m http.server 8765
```

Depois acesse http://localhost:8765.

## Como publicar

É um site estático: envie a pasta inteira (`index.html` + `assets/`) para qualquer hospedagem estática —
Netlify (arrastar a pasta em app.netlify.com/drop), Vercel, GitHub Pages, Cloudflare Pages ou a hospedagem do seu domínio via FTP.
Após publicar com domínio próprio, troque `og:image` em `index.html` pelo endereço completo (ex.: `https://seudominio.com.br/assets/img/og-image.jpg`) para a prévia aparecer ao compartilhar o link.

## Como manter o catálogo

- **Adicionar produto:** salve as fotos em `assets/img/produtos/` como `<codigo>.webp` e `<codigo>-sm.webp` e acrescente um objeto em `assets/js/produtos.js`
  (`codigo`, `nome`, `categoria`, `descricao`, `imagem`, `largura`, `altura` e, opcionalmente, `tamanhos` e `apresentacao`).
- **Nova categoria:** inclua o nome em `SUBLIMAE_CATEGORIAS` (a ordem da lista é a ordem exibida).
- **Número do WhatsApp:** constante `WHATSAPP_NUMBER` em `assets/js/app.js` (atual: 557199593595) e os `href` de `index.html`.
- Não adicione preços em `produtos.js`; nada no site lê ou exibe valores.
