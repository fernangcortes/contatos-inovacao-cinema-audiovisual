# Plano de Melhorias — Contatos Inovação Cinema/Audiovisual

## Diagnóstico dos problemas atuais

1. **Persistência no modal não reflete na UI**: `ContactModal` recebe `contact` como prop de `selectedContact` em `useContacts`. Quando o modal edita imagens, textos ou links via `setContacts`, o `selectedContact` não é atualizado, então a UI só reflete as alterações ao reabrir o modal ou recarregar a página.
2. **Imagens externas com CORS**: ao colar uma URL de imagem hospedada em outro domínio, o navegador bloqueia o carregamento em `localhost` por `NotSameOrigin`. É preciso `crossOrigin="anonymous"` e fallback para upload local (base64).
3. **Avatar não é editável**: o avatar circular nos cards/modal deve ser clicável e abrir um editor com upload, URL e ajuste de corte/posição.
4. **Formulário de variáveis no lugar errado**: deve ser uma aba global "Meus dados" antes de "Contatos", não dentro do modal.
5. **StatsHeader com UX confusa**: filtros de prioridade/tipo não interagem corretamente com o filtro de status (contatados/pendentes), e falta feedback visual de seleção.
6. **Botão "Sugerir contato" ainda ilegível**: deve usar o mesmo estilo do botão "Painel administrativo" (`ghost` com texto claro e hover escuro).

---

## Tarefas de implementação

### Task 1 — Corrigir atualização ao vivo dos dados no modal

**Problema:** alterações feitas no `ContactModal` (imagens, textos, links) só aparecem após refresh/reabrir modal.

**Solução:**
- Em `ContactModal.tsx`, usar `useContacts()` para obter o contato atualizado em tempo real:
  ```tsx
  const { allContacts, setContacts } = useContacts();
  const liveContact = allContacts.find((c) => c.id === contact?.id) ?? contact;
  ```
- Renderizar sempre a partir de `liveContact` em vez da prop `contact`.
- Manter `contact` na prop apenas para abrir o modal; todas as operações de edição usam `liveContact.id`.
- Garantir que `useLocalStorage` está salvando corretamente (já está, mas verificar se o listener de `storage` não está causando problemas).

**Arquivos:** `src/components/ContactModal.tsx`, `src/hooks/useContacts.ts`.

---

### Task 2 — Melhorar upload e exibição de imagens

**2.1 Avatar clicável e editor**
- Transformar o avatar circular em `ContactCard`, `ContactListItem` e `ContactModal` em um botão clicável.
- Ao clicar, abrir um Dialog/modal com:
  - Pré-visualização da imagem maior.
  - Opção de upload de arquivo do computador (convertido para base64 via `FileReader`).
  - Campo para colar URL externa.
  - Controles de corte/posição: usar `object-fit: cover` + `object-position` ajustável (botões ou slider para top/center/bottom/left/right) e zoom (scale via CSS transform ou ajuste de `object-position`).
  - Ícone de lápis sutil no hover do avatar.

**2.2 CORS e fallback**
- Adicionar `crossOrigin="anonymous"` nas tags `<img>` que carregam URLs externas.
- Se a imagem externa falhar (`onError`), exibir fallback (ícone ou imagem base64 local).
- Ao adicionar URL, tentar carregar primeiro; se falhar por CORS, mostrar toast avisando e sugerir upload local.

**2.3 Persistência**
- Salvar imagens base64 ou URLs no array `images` do contato, persistido via `useContacts`/`useLocalStorage`.
- Manter campo "Adicionar imagem" existente na aba Descrição para a galeria.

**Arquivos:** `src/components/ContactCard.tsx`, `src/components/ContactListItem.tsx`, `src/components/ContactModal.tsx`.

---

### Task 3 — Mover formulário de variáveis para aba "Meus dados"

**3.1 Nova aba global**
- Em `Home.tsx`, adicionar uma aba "Meus dados" antes de "Contatos" na lista de tabs.
- Usar ícone de usuário/perfil.

**3.2 Estado global das variáveis**
- Mover o estado `templateValues` de `ContactModal.tsx` para `Home.tsx` (ou para um novo hook `useTemplateValues`).
- Passar `templateValues` e `setTemplateValues` para `ContactModal` via props.
- Persistir no `localStorage` com chave `contact-template-values`.

**3.3 Conteúdo da aba**
- Criar componente `UserProfileForm` com os campos:
  - `[SEU NOME]`
  - `[NOME DA STARTUP]`
  - `[BREVE DESCRIÇÃO DO APP]`
  - `[LINK DO APP]`
  - `[LINK DEMO]`
  - `[LINKEDIN]`
  - `[TELEFONE]`
- Incluir uma pré-visualização de como os textos ficam com os valores preenchidos (opcional, mas útil).

**Arquivos:** `src/pages/Home.tsx`, `src/components/ContactModal.tsx`, novo `src/components/UserProfileForm.tsx` (ou similar).

---

### Task 4 — Corrigir textos editáveis manualmente

**Problema:** ao salvar a edição de um texto, a UI não atualiza.

**Solução:**
- Usar `liveContact` (Task 1) para garantir que o texto renderizado vem do estado atualizado.
- Verificar se `updateSuggestions` está realmente atualizando o array de sugestões com o texto editado.
- Após salvar, garantir que `editingSuggestion` é resetado e o `copiedId` não fica preso.

**Arquivos:** `src/components/ContactModal.tsx`.

---

### Task 5 — Corrigir links clicáveis e adição/remoção de links

**Problema:** palavras não ficam clicáveis e links adicionados só aparecem após refresh.

**Solução:**
- Usar `liveContact.links` (Task 1) no `linkifyText`.
- Garantir que `updateLinks` atualiza o contato correto.
- Normalizar labels dos links antes de passar para `linkifyText` (ex: remover acentos não é necessário, mas garantir correspondência exata de palavras).
- Adicionar tratamento para "Instagram" mesmo quando o label for "Instagram CineHub" — usar correspondência por substring se necessário.

**Arquivos:** `src/components/ContactModal.tsx`, `src/lib/utils.ts`.

---

### Task 6 — Reorganizar e corrigir filtros do StatsHeader

**6.1 Layout**
- Reorganizar os cards em dois grupos visuais:
  - Grupo 1: Total, Contatados, Pendentes.
  - Grupo 2: Prioridade 1, Prioridade 2, Prioridade 3, Instituições, Pessoas.
- Adicionar separação sutil entre os grupos (borda, espaçamento ou label pequeno).
- Mover "Pendentes" para ao lado de "Contatados".

**6.2 Comportamento dos filtros**
- Criar um estado adicional `baseStatusFilter` em `useContacts` com valores `'all' | 'completed' | 'pending'`.
- Quando clicar em "Contatados", setar `baseStatusFilter = 'completed'`.
- Quando clicar em "Pendentes", setar `baseStatusFilter = 'pending'`.
- Quando clicar em "Total", setar `baseStatusFilter = 'all'`.
- Quando clicar em Prioridade/Tipo/Instituições/Pessoas, manter o `baseStatusFilter` atual e aplicar o filtro adicional.
- Integrar `baseStatusFilter` no `filteredContacts` de `useContacts`.
- Remover o `statusFilter` atual do `FilterBar` ou mantê-lo sincronizado com `baseStatusFilter`.

**6.3 Estado visual de seleção**
- Adicionar prop `activeFilter` em `StatsHeader` indicando qual card está ativo.
- Aplicar classe de destaque (ex: ring, brightness, border) no card ativo.
- Cards desativados ficam com opacidade menor ou sem destaque.

**Arquivos:** `src/components/StatsHeader.tsx`, `src/hooks/useContacts.ts`, `src/pages/Home.tsx`.

---

### Task 7 — Corrigir contraste do botão "Sugerir contato"

- Aplicar o mesmo estilo do botão "Painel administrativo":
  ```tsx
  <Button
    variant="ghost"
    size="sm"
    className="text-slate-300 hover:bg-slate-800 hover:text-white"
    onClick={() => setSuggestOpen(true)}
  >
    <PlusCircle className="w-4 h-4 mr-2" />
    Sugerir contato
  </Button>
  ```
- Opcionalmente adicionar `border border-transparent hover:border-slate-700` para manter o alinhamento visual.

**Arquivos:** `src/pages/Home.tsx`.

---

## Ordem recomendada de execução

1. **Task 1** (liveContact) — resolve a base dos bugs de persistência nas Tasks 4 e 5.
2. **Task 2** (imagens) — depende do liveContact.
3. **Task 3** (aba Meus dados) — move estado do modal para Home.
4. **Task 4** (textos editáveis) — resolvido com liveContact.
5. **Task 5** (links clicáveis e adicionar links) — resolvido com liveContact.
6. **Task 6** (StatsHeader) — UX dos filtros.
7. **Task 7** (botão Sugerir contato) — ajuste visual rápido.
8. **Testes finais**: `npm run lint` e `npm run build`.

---

## Prompt sucinto para o próximo chat

```
Implemente as melhorias no projeto React/Vite em c:\Users\FGC\Desktop\programas\contatos_inovacao:

1. Corrija a persistência ao vivo no ContactModal: use useContacts() para obter o contato atualizado (liveContact) e renderizar a partir dele, para que edições de imagens, textos e links apareçam imediatamente sem precisar recarregar.

2. Melhore imagens: avatar circular clicável em cards e modal, abrindo editor com upload de arquivo (base64), campo URL, preview maior, ícone de lápis no hover e ajuste básico de corte/posição. Adicione crossOrigin="anonymous" nas imgs e fallback para upload local quando a URL externa falhar por CORS.

3. Mova o formulário de variáveis ([SEU NOME], [NOME DA STARTUP], [BREVE DESCRIÇÃO DO APP], [LINK DO APP], [LINK DEMO], [LINKEDIN], [TELEFONE]) para uma nova aba global "Meus dados" antes da aba "Contatos" no Home. Crie um componente separado e mantenha persistência no localStorage.

4. Corrija textos editáveis manualmente e links clicáveis usando liveContact.

5. Reorganize o StatsHeader: grupo "Total | Contatados | Pendentes" separado do grupo "Prioridade 1/2/3 | Instituições | Pessoas". Filtros de prioridade/tipo devem respeitar o status selecionado (contatados/pendentes/todos). Adicione feedback visual de card ativo.

6. Deixe o botão "Sugerir contato" no header com o mesmo estilo visual do botão "Painel administrativo" (ghost, texto slate-300, hover bg-slate-800).

Ao final, rode npm run lint e npm run build e garanta que ambos passem.
```
