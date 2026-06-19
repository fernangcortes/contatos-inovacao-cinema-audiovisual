import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useContacts } from '@/hooks/useContacts';
import { useSuggestions } from '@/hooks/useSuggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isAdminLoggedIn, logoutAdmin } from '@/lib/adminAuth';
import type { Contact, Priority, Category, ContactType } from '@/types/contact';
import {
  Shield,
  LogOut,
  Users,
  Inbox,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

const priorities: { value: Priority; label: string }[] = [
  { value: '1', label: 'P1 — Máxima' },
  { value: '2', label: 'P2 — Alta' },
  { value: '3', label: 'P3 — Média' },
];

const categories: { value: Category; label: string }[] = [
  { value: 'hub-coworking', label: 'Hub/Coworking' },
  { value: 'laboratorio-publico', label: 'Lab Público' },
  { value: 'aceleracao', label: 'Aceleração' },
  { value: 'evento-mercado', label: 'Evento/Mercado' },
  { value: 'fomento', label: 'Fomento' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'pessoa', label: 'Pessoa' },
  { value: 'outro', label: 'Outro' },
];

const types: { value: ContactType; label: string }[] = [
  { value: 'instituicao', label: 'Instituição' },
  { value: 'pessoa', label: 'Pessoa' },
];

function formatDate(iso?: string) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function AdminPanel() {
  const navigate = useNavigate();
  const { allContacts, setContacts } = useContacts();
  const { pendingSuggestions, suggestions, approveSuggestion, rejectSuggestion, deleteSuggestion } =
    useSuggestions();

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    toast.success('Logout realizado.');
    navigate('/');
  };

  const handleSaveContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingContact) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const tags = String(formData.get('tags') || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const links = String(formData.get('links') || '')
      .split('\n')
      .map((line) => {
        const [label, url] = line.split('|').map((s) => s.trim());
        return label && url ? { label, url } : null;
      })
      .filter((l): l is { label: string; url: string } => l !== null);

    const updated: Contact = {
      ...editingContact,
      name: String(formData.get('name')),
      institution: String(formData.get('institution')),
      role: String(formData.get('role') || ''),
      description: String(formData.get('description')),
      relevance: String(formData.get('relevance')),
      strategy: String(formData.get('strategy')),
      priority: String(formData.get('priority')) as Priority,
      category: String(formData.get('category')) as Category,
      type: String(formData.get('type')) as ContactType,
      tags,
      links,
    };

    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingContact(null);
    toast.success('Contato atualizado com sucesso!');
  };

  const handleDeleteContact = () => {
    if (!deletingContact) return;
    setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id));
    setDeletingContact(null);
    toast.success('Contato removido com sucesso!');
  };

  const handleApproveSuggestion = (id: string) => {
    const suggestion = suggestions.find((s) => s.id === id);
    if (!suggestion) return;

    const newContact: Contact = {
      ...suggestion.contact,
      suggestions: [],
      id: `contact-${suggestion.id.replace('suggestion-', '')}`,
      completed: false,
    };

    setContacts((prev) => [newContact, ...prev]);
    approveSuggestion(id);
    toast.success('Sugestão aprovada e contato adicionado!');
  };

  const handleExport = () => {
    const data = {
      contacts: allContacts,
      suggestions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contatos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exportado!');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h1 className="text-lg font-bold">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleExport} className="text-slate-300 hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="contacts" className="text-sm">
              <Users className="w-4 h-4 mr-1" />
              Contatos ({allContacts.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="text-sm">
              <Inbox className="w-4 h-4 mr-1" />
              Sugestões
              {pendingSuggestions.length > 0 && (
                <Badge variant="destructive" className="ml-2 text-[10px] px-1.5 py-0">
                  {pendingSuggestions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Prioridade</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Badge
                          className={
                            contact.priority === '1'
                              ? 'bg-rose-600'
                              : contact.priority === '2'
                              ? 'bg-amber-500'
                              : 'bg-sky-600'
                          }
                        >
                          P{contact.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.institution}</TableCell>
                      <TableCell className="capitalize">
                        {contact.type === 'instituicao' ? 'Instituição' : 'Pessoa'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingContact(contact)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-600 hover:text-rose-700"
                            onClick={() => setDeletingContact(contact)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {pendingSuggestions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-700">Nenhuma sugestão pendente</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Novas sugestões aparecerão aqui para aprovação.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{s.contact.name}</h3>
                        <p className="text-sm text-slate-600">{s.contact.institution}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Enviada em {formatDate(s.submittedAt)}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        Pendente
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700">{s.contact.description}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApproveSuggestion(s.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-300 text-rose-700 hover:bg-rose-50"
                        onClick={() => {
                          rejectSuggestion(s.id);
                          toast.info('Sugestão rejeitada.');
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-500"
                        onClick={() => {
                          deleteSuggestion(s.id);
                          toast.info('Sugestão excluída.');
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Contact Dialog */}
      <Dialog open={!!editingContact} onOpenChange={(open) => !open && setEditingContact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar contato</DialogTitle>
            <DialogDescription>Altere os dados do contato selecionado.</DialogDescription>
          </DialogHeader>
          {editingContact && (
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input id="name" name="name" defaultValue={editingContact.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Instituição *</Label>
                  <Input
                    id="institution"
                    name="institution"
                    defaultValue={editingContact.institution}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select name="type" defaultValue={editingContact.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select name="category" defaultValue={editingContact.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select name="priority" defaultValue={editingContact.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo/função</Label>
                <Input id="role" name="role" defaultValue={editingContact.role || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingContact.description}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relevance">Por que contatar?</Label>
                <Textarea
                  id="relevance"
                  name="relevance"
                  defaultValue={editingContact.relevance}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategy">Estratégia de abordagem</Label>
                <Textarea
                  id="strategy"
                  name="strategy"
                  defaultValue={editingContact.strategy}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input id="tags" name="tags" defaultValue={editingContact.tags.join(', ')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="links">
                  Links (um por linha, formato: <code>label | url</code>)
                </Label>
                <Textarea
                  id="links"
                  name="links"
                  defaultValue={editingContact.links.map((l) => `${l.label} | ${l.url}`).join('\n')}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingContact(null)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar alterações</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingContact} onOpenChange={(open) => !open && setDeletingContact(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{deletingContact?.name}</strong>? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingContact(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteContact}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
