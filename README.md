# AURORA · Atelier de Perucas de Cabelo Humano Premium
**Versão 2.0.0** — Migração para **React 18 + TypeScript + Vite + Tailwind CSS** com Arquitetura de Segurança por Design (**SDD - Security-Driven Development**) e Gateway de Pagamentos Realista.

---

## 💎 Visão Geral do Projeto

O projeto foi transformado de uma base legada estática em HTML/JS puros em uma **plataforma moderna de e-commerce de alto padrão (Haute Perruquerie)**, com foco em experiência do usuário premium, naturalidade visual, acessibilidade e robustez técnica.

### Principais Pilares da Nova Versão:
1. **Frontend Moderno em React + TypeScript + Tailwind CSS**:
   - Componentização modular, tipagem estrita de ponta a ponta e estilização de luxo com microinterações suaves.
2. **Arquitetura de Segurança SDD (Security-Driven Development & Spec-Driven Development)**:
   - Especificação técnica e Threat Modeling formal documentado em [`docs/SDD_SPECIFICATION.md`](docs/SDD_SPECIFICATION.md).
   - **Anti-Tampering Cart Verification**: Sistema criptográfico (Web Crypto API SHA-256) que detecta tentativas de adulteração de preços via Developer Tools no cliente e auto-reconcilia com a tabela mestre.
   - **Zero Trust & PCI-DSS Compliance**: Dados de cartão são manipulados em memória volátil com validação do algoritmo de Luhn (MOD 10); números e CVV nunca são persistidos em disco/LocalStorage.
   - **Validação e Sanitização Estrita**: Verificação de dígitos verificadores de CPF, máscaras dinâmicas de celular/telefone e prevenção de XSS.
3. **Módulo Completo de Pagamentos & Checkout**:
   - **PIX Instantâneo**: Geração de payload EMV realista (BR Code Bacen), QR Code SVG de alto contraste, botão Copia e Cola com 1 clique, timer de expiração de 15 minutos e simulação de conciliação bancária automática.
   - **Cartão de Crédito 3D Interativo**: Cartão com virada frente/verso tridimensional (CSS 3D perspective flip), identificação automática de bandeiras (Visa, Mastercard, Elo, Amex, Hipercard) e parcelamento de até 10x sem juros.
   - **Boleto Bancário**: Linha digitável com código de barras visual e data de vencimento automática.
   - **Recibo e Confirmação de Pedido**: Tela comemorativa com confetes (`canvas-confetti`), protocolo criptográfico do pedido e atalho direto para acompanhamento privativo via WhatsApp.
4. **Integrações de Logística e Frete**:
   - Integração com a API dos Correios via **ViaCEP** em tempo real com auto-preenchimento de logradouro, bairro, cidade e UF.
   - Opções de PAC e SEDEX prioritário com política de **Frete Grátis acima de R$ 3.000**.
5. **Experiência do Atelier & Design**:
   - Drawer de sacola reativo com cupom de desconto (ex: `AURORA10`).
   - Modal de busca instantânea com debounce e sugestões rápidas.
   - Modal interativo "Guia de Medidas & Tipos de Lace" (como medir circunferência da cabeça, 13x4, 13x6 e Full Lace).
   - Galeria multi-ângulo com zoom e seleção de tamanho de touca (P, M, G).
   - Depoimentos reais de clientes compradoras com avaliação por estrelas.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** + **TypeScript 5**
- **Vite 6** (Build ultrarrápido com Hot Module Replacement)
- **Tailwind CSS 3** (Paleta de cores luxury: Gold, Onyx, Cream e Ivory)
- **Lucide Icons** (Iconografia moderna e acessível)
- **Canvas-Confetti** (Feedback comemorativo no pós-checkout)
- **Web Crypto API** (Geração de assinaturas SHA-256)

---

## 📁 Estrutura do Projeto

```
loja-perucas/
├── docs/
│   └── SDD_SPECIFICATION.md       # Documento de Especificação & Modelagem STRIDE
├── legacy/                        # Arquivos legados originais mantidos intactos
│   ├── css/
│   ├── js/
│   ├── colecao.html
│   ├── index.html
│   └── produto.html
├── src/
│   ├── components/
│   │   ├── cart/                  # Drawer do Carrinho e Linhas de Item
│   │   ├── catalog/               # Cards, Filtros, QuickView e Guia de Touca
│   │   ├── checkout/              # Modal de Checkout, Pix, Card 3D, Boleto, Sucesso
│   │   ├── common/                # Navbar, Footer, Modal, Badges, Ticker
│   │   ├── product/               # Detalhes da Peça, Galeria com Zoom, Avaliações
│   │   └── search/                # Busca Instantânea com Debounce
│   ├── context/                   # Contextos Globais (Cart, Wishlist, Toast)
│   ├── data/                      # Catálogo Enriquecido de Produtos e Cupons
│   ├── security/                  # Sanitizador XSS, Luhn, CPF, Storage Seguro, Cripto
│   ├── services/                  # ViaCEP e Gateway de Pagamentos
│   ├── types/                     # Tipagem estrita TypeScript de Domínio
│   ├── App.tsx                    # Roteador reativo e Layout mestre
│   ├── index.css                  # Diretivas Tailwind e utilitários 3D
│   └── main.tsx                   # Entrada da aplicação
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** v18 ou superior instalado.

### 1. Instalar Dependências
```bash
npm install
```

### 2. Rodar o Ambiente de Desenvolvimento
```bash
npm run dev
```
O servidor Vite iniciará em `http://localhost:3000`.

### 3. Gerar o Build de Produção
```bash
npm run build
```
Os arquivos otimizados e minificados serão gerados no diretório `dist/`.

### 4. Visualizar o Build Localmente
```bash
npm run preview
```

---

## 🏷️ Cupons de Desconto Disponíveis para Demonstração

| Cupom | Desconto | Regra |
| :--- | :--- | :--- |
| `AURORA10` | 10% OFF | Pedidos a partir de R$ 2.000 |
| `BEMVINDA5` | 5% OFF | Válido para qualquer compra |
| `VIPATELIER` | 15% OFF | Pedidos a partir de R$ 4.000 |

---

## 🔒 Arquitetura de Segurança (SDD Highlights)

- **Anti-Tampering no Carrinho**: O estado persistido é assinado com SHA-256 e confrontado com a tabela de produtos. Tentativas de alterar preços no console resultam em reconciliação instantânea e alerta auditado.
- **Validação de Cartão**: Cartões com numeração inválida são barrados antes da submissão com cálculo de Luhn em tempo real.
- **Headers HTTP**: Configurados para proteção contra Clickjacking (`X-Frame-Options: DENY`), MIME sniffing (`X-Content-Type-Options: nosniff`) e vazamento de referrer.
