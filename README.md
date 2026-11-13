# S.A Engenharia — landing page

Landing page em React + TypeScript da S.A Engenharia. Os dois serviços principais — **vistorias e laudos** e **gerenciamento de obras** — têm o mesmo destaque, e o site também apresenta projetos (AutoCAD e 3D) e consultoria.

## Executar localmente

```bash
npm install
npm run dev
```

Verificação de qualidade e build de produção:

```bash
npm run check
```

## Estrutura da página (nov/2026)

1. Topo: vistoria de imóveis e gerenciamento de obras, com atalhos para os dois serviços e botão de orçamento.
2. `#servicos`: os dois serviços lado a lado e o bloco "uma coisa leva à outra" (vistoria → gerenciamento).
3. `#vistorias`: tipos de vistoria e laudo, cada um com botão de orçamento.
4. `#gerenciamento`: o que o gerenciamento inclui.
5. `#como-funciona`: passo a passo de cada serviço.
6. Fotos reais de obras e vistorias + `#galeria` (obras entregues).
7. `#projetos`: projetos e consultoria, com as galerias AutoCAD e 3D.
8. Para quem é, sobre, regiões, `#duvidas` (perguntas frequentes) e `#contato`.

Os links âncora acima podem ser usados como URL final de anúncios (ex.: `https://www.engsaeng.com.br/#vistorias`).

## Configuração principal

Textos, serviços, tipos de vistoria, passo a passo, perguntas frequentes, regiões, imagens e contato ficam centralizados em `src/config.ts`. Os estilos da remodelação ficam em `src/remodel.css` (carregado depois de `src/styles.css`).

Por decisão do cliente, o site não mostra nome de responsável técnico, CREA nem avaliações.

### WhatsApp

Preencha `whatsappNumber` em `src/config.ts` somente com números, no formato internacional (país + DDD + número). `whatsappDisplay` é a versão formatada que aparece no texto.

Cada botão abre o WhatsApp em nova aba com uma mensagem pronta para o serviço escolhido (campo `message` em `src/config.ts`). O visitante ainda precisa tocar em enviar.

Se o número estiver vazio ou inválido, os botões levam à seção de contato e o botão flutuante não aparece.

## Substituir imagens

As imagens ficam em `public/images`. As fotos reais de obra recortadas (sem as bordas pretas de post) estão em `public/images/obras`. Para trocar uma imagem, atualize caminho, dimensões e texto alternativo em `src/config.ts`.

## Analytics

O Google Tag Manager (`GTM-WNMVBDVM`) está em `index.html`. Em nov/2026 o container só tinha a tag do Google Ads (`AW-18509057331`), o remarketing e o vinculador de conversões, sem nenhum acionador nos eventos abaixo. Por isso os eventos puderam ser organizados assim:

- `whatsapp_open` — **um por clique** em qualquer botão de WhatsApp, inclusive o botão principal do topo. Vai com `location` (onde o botão está), `label` (texto do botão, quando houver) e `service` (serviço escolhido, quando houver). É o evento para usar como conversão.
- `cta_click` — atalhos do topo que só rolam a página até Vistorias ou Gerenciamento. Não abre WhatsApp e não deve contar como conversão.

`whatsapp_open` significa apenas abertura da conversa; não representa mensagem enviada, lead confirmado ou venda.
