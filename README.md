# Sublimaê Artes Personalizadas | Site oficial

Vitrine digital do catálogo Sublimaê, construída com HTML, CSS e JavaScript puros (sem frameworks e sem etapa de build).
Este site **não exibe preços** em nenhuma parte: o visitante consulta os produtos e solicita orçamento pelo WhatsApp.
Os produtos, as fotos e as categorias são editados pelo **painel de administração** em `/admin`.

## Estrutura

```
index.html                 Página única (cabeçalho, hero, categorias, catálogo, sobre, chamada final, rodapé)
admin/index.html           Painel de administração (Sveltia CMS)
admin/config.yml           Campos e regras do painel
dados/produtos.json        Produtos do catálogo, na ordem exibida (sem preços)
dados/categorias.json      Categorias, na ordem exibida
assets/css/styles.css      Estilos (mobile-first, cores da marca)
assets/js/app.js           Carrega os dados; busca, filtros, galeria ampliada, lista de interesse, links do WhatsApp
assets/img/produtos/       Fotos dos produtos em WebP (até 1400 px)
assets/img/logo*.webp      Logotipo original
assets/img/destaque-*.webp Fotos de destaque do hero (originais)
assets/img/favicon.png, apple-touch-icon.png, og-image.jpg
```

## Painel de administração

Acesse `https://SEU-SITE/admin` (ou http://localhost:8765/admin localmente).

**Entrar:** clique em **"Entrar com token de acesso"** (Sign In Using Access Token). A janela traz um link para o GitHub
que já gera o token com as permissões certas; copie o token, cole no painel e pronto. O navegador lembra o acesso.
Só quem tem permissão de escrita no repositório `hmtech00/Sublimea` consegue entrar.

**O que dá para fazer:**
- **Produtos:** editar nome, código, categoria, descrição, foto, tamanhos e apresentação; criar produtos novos; excluir; arrastar para mudar a ordem no site.
- **Fotos:** envie JPG, PNG ou WebP. O painel converte para WebP e reduz para no máximo 1400 px antes de salvar.
- **Categorias:** criar, renomear e reordenar. Ao renomear uma categoria, confira os produtos que usavam o nome antigo.

**Publicar:** ao salvar, o painel cria um commit no GitHub. Com o site hospedado na Netlify, Cloudflare Pages ou GitHub Pages
ligado ao repositório, a alteração vai ao ar sozinha em cerca de 1 minuto.

**Login com o botão "Entrar com GitHub" (opcional):** exige um app OAuth no GitHub. Se o site estiver na Netlify, siga
https://sveltiacms.app/en/docs/backends/github (seção *Using Netlify as an OAuth Client*); fora da Netlify, use o
Sveltia CMS Authenticator e adicione `base_url` em `admin/config.yml`.

**Regras de segurança do catálogo:** o site ignora produtos sem código ou sem nome e códigos repetidos.
Não escreva preços na descrição; o site não tem campo de preço.

## Como testar localmente

O site lê os arquivos de `dados/`, então precisa de um servidor (abrir o `index.html` direto não carrega o catálogo):

```bash
python3 -m http.server 8765
```

Depois acesse http://localhost:8765.

## Como publicar

É um site estático: publique a pasta inteira em qualquer hospedagem estática (Netlify, Cloudflare Pages, GitHub Pages, Vercel).
Para o painel atualizar o site automaticamente, conecte a hospedagem ao repositório do GitHub em vez de enviar os arquivos à mão.
Após publicar com domínio próprio, troque `og:image` em `index.html` pelo endereço completo (ex.: `https://seudominio.com.br/assets/img/og-image.jpg`).

## Outras configurações

- **Número do WhatsApp:** constante `WHATSAPP_NUMBER` em `assets/js/app.js` (atual: 557199593595) e os `href` de `index.html`.
- **Versão do painel:** fixada em `admin/index.html` (`@sveltia/cms@0.227.0`); para atualizar, troque o número da versão.
