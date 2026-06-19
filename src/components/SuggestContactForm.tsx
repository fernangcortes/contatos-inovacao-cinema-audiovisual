import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Priority, Category, ContactType } from '@/types/contact';
import { Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export interface SuggestionContact {
  name: string;
  type: ContactType;
  category: Category;
  priority: Priority;
  institution: string;
  role?: string;
  description: string;
  relevance: string;
  strategy: string;
  tags: string[];
  links: { label: string; url: string }[];
}

interface SuggestContactFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (contact: SuggestionContact) => void;
}

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

export function SuggestContactForm({ open, onClose, onSubmit }: SuggestContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'instituicao' as ContactType,
    category: 'outro' as Category,
    priority: '3' as Priority,
    institution: '',
    role: '',
    description: '',
    relevance: '',
    strategy: '',
    tags: '',
    linkLabel: '',
    linkUrl: '',
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const links: { label: string; url: string }[] = [];
    if (form.linkLabel && form.linkUrl) {
      links.push({ label: form.linkLabel, url: form.linkUrl });
    }

    onSubmit({
      name: form.name,
      type: form.type,
      category: form.category,
      priority: form.priority,
      institution: form.institution,
      role: form.role || undefined,
      description: form.description,
      relevance: form.relevance,
      strategy: form.strategy,
      tags,
      links,
    });

    setSubmitted(true);
    toast.success('Sugestão enviada! Ela será analisada antes de aparecer no diretório.');

    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: '',
        type: 'instituicao',
        category: 'outro',
        priority: '3',
        institution: '',
        role: '',
        description: '',
        relevance: '',
        strategy: '',
        tags: '',
        linkLabel: '',
        linkUrl: '',
      });
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sugerir um contato</DialogTitle>
          <DialogDescription>
            Indique uma instituição ou profissional que deveria fazer parte do diretório.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-900">Sugestão enviada!</h3>
            <p className="text-sm text-slate-500">
              Obrigado pela contribuição. Analisaremos antes de publicar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Nome do contato"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição *</Label>
                <Input
                  id="institution"
                  value={form.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  placeholder="Instituição ou empresa"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v) => handleChange('type', v)}>
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
                <Select value={form.category} onValueChange={(v) => handleChange('category', v as Category)}>
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
                <Select value={form.priority} onValueChange={(v) => handleChange('priority', v as Priority)}>
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
              <Input
                id="role"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="Ex: Diretor Executivo de Inovação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva brevemente o contato"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relevance">Por que contatar?</Label>
              <Textarea
                id="relevance"
                value={form.relevance}
                onChange={(e) => handleChange('relevance', e.target.value)}
                placeholder="Relevância estratégica"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Estratégia de abordagem</Label>
              <Textarea
                id="strategy"
                value={form.strategy}
                onChange={(e) => handleChange('strategy', e.target.value)}
                placeholder="Como abordar este contato"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="Ex: inovação, São Paulo, VR"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkLabel">Label do link</Label>
                <Input
                  id="linkLabel"
                  value={form.linkLabel}
                  onChange={(e) => handleChange('linkLabel', e.target.value)}
                  placeholder="Ex: Site oficial"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL do link</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={form.linkUrl}
                  onChange={(e) => handleChange('linkUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Enviar sugestão
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
