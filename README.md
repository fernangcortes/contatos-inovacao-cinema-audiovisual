# Contatos — Inovação em Cinema e Audiovisual

Aplicação web para organizar, filtrar e acompanhar contatos estratégicos do ecossistema de inovação em cinema e audiovisual. Permite gerenciar instituições, profissionais, oportunidades, mapa de contatos e acompanhar o status de contato de cada lead.

## ✨ Funcionalidades

- **Lista de contatos** em visualização em grade ou lista
- **Filtros avançados** por busca textual, prioridade, tipo, categoria e status (contatado/pendente)
- **Modal de detalhes do contato** com abas:
  - Descrição, estratégia, textos de abordagem, links e compartilhamento
  - Edição inline de textos de contato
  - Gerenciamento de links clicáveis
  - Galeria de imagens com upload/local/URL
- **Avatar clicável e editável** com upload de arquivo, URL externa, ajuste de posição e zoom
- **Aba "Meus dados"** para preencher variáveis de template que são substituídas automaticamente nos textos de contato
- **Mapa interativo** de contatos geolocalizados (Leaflet)
- **Aba de oportunidades** (editais, chamadas, etc.)
- **Painel administrativo** básico para gerenciar sugestões
- **Persistência local** dos dados no `localStorage`
- **Compartilhamento** de contatos por URL, WhatsApp, e-mail ou nativo

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite 7**
- **React Router 7**
- **Tailwind CSS 3** + **shadcn/ui** (componentes Radix)
- **Leaflet** + **React-Leaflet** para mapas
- **Lucide React** para ícones
- **Sonner** para notificações

## 📦 Pré-requisitos

- Node.js 20+
- npm ou yarn

## 🛠️ Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## ▶️ Scripts disponíveis

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Compila o projeto para produção
npm run build

# Pré-visualiza a build de produção localmente
npm run preview

# Executa o linter
npm run lint
```

## 🏗️ Estrutura de pastas

```
src/
  components/        # Componentes reutilizáveis (UI e de negócio)
  data/              # Dados iniciais dos contatos
  hooks/             # Hooks customizados (useContacts, useLocalStorage, etc.)
  lib/               # Utilitários, helpers e tipos auxiliares
  pages/             # Páginas principais (Home, Admin)
  types/             # Definições de tipos TypeScript
```

## 🌐 Deploy no Vercel

O projeto já está configurado para deploy estático na Vercel. O arquivo `vercel.json` redireciona qualquer rota para o `index.html`, permitindo o funcionamento correto do React Router.

### Passo a passo

1. Crie um repositório no GitHub e envie o código:

```bash
git init
git add .
git commit -m "feat: aplicação de contatos inovação cinema/audiovisual"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

2. Acesse [vercel.com](https://vercel.com), importe o repositório e clique em **Deploy**.
3. A Vercel detectará automaticamente o Vite e executará `npm run build`.

### Configuração manual (opcional)

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 📝 Variáveis de ambiente

Não há variáveis de ambiente obrigatórias. Todos os dados são persistidos no `localStorage` do navegador do usuário.

## 🧩 Como usar

1. Preencha seus dados na aba **"Meus dados"**.
2. Navegue até a aba **"Contatos"** e explore a lista.
3. Clique em um card para abrir os detalhes.
4. No modal, personalize textos, adicione links e imagens.
5. Clique no avatar para editar a foto do contato.
6. Use o botão **"Marcar como contatado"** para acompanhar seu progresso.

## 🤝 Contribuição

Contribuições são bem-vindas. Para sugerir um novo contato, use o botão **"Sugerir contato"** no canto superior direito da aplicação.

## 📄 Licença

Este projeto é privado e de uso interno.
