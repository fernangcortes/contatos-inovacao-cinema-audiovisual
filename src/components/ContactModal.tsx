import { useState } from 'react';
import type { Contact, Channel, Suggestion } from '@/types/contact';
import { useContacts } from '@/hooks/useContacts';
import { ContactAvatarEditor } from './ContactAvatarEditor';
import {
  applyTemplateValues,
  linkifyText,
  type TemplateValues,
} from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  MessageCircle,
  Linkedin,
  Instagram,
  Globe,
  Copy,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Target,
  FileText,
  Smartphone,
  Link2,
  Share2,
  Pencil,
  Save,
  X,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactModalProps {
  contact: Contact | null;
  onClose: () => void;
  onToggle: (id: string) => void;
  templateValues: TemplateValues;
}

const channelIcons: Record<Channel, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  whatsapp: <Smartphone className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  social: <Instagram className="w-4 h-4" />,
  site: <Globe className="w-4 h-4" />,
};

const priorityConfig = {
  '1': { label: 'Prioridade 1 — Maxima', color: 'bg-rose-600' },
  '2': { label: 'Prioridade 2 — Alta', color: 'bg-amber-500' },
  '3': { label: 'Prioridade 3 — Media', color: 'bg-sky-600' },
};

export function ContactModal({
  contact,
  onClose,
  onToggle,
  templateValues,
}: ContactModalProps) {
  const { allContacts, setContacts } = useContacts();
  const liveContact = allContacts.find((c) => c.id === contact?.id) ?? contact;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingSuggestion, setEditingSuggestion] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  if (!liveContact) return null;

  const p = priorityConfig[liveContact.priority];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success('Texto copiado!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const contactUrl = `${window.location.origin}/contato/${liveContact.id}`;
  const shareTitle = `Contato recomendado: ${liveContact.name}`;
  const shareText = `Confira este contato estratégico para inovação em cinema e audiovisual: ${liveContact.name} — ${contactUrl}`;

  const copyLink = () => {
    navigator.clipboard.writeText(contactUrl).then(() => {
      setCopiedLink(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const updateImages = (images: string[]) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === liveContact.id ? { ...c, images } : c))
    );
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    const images = liveContact.images ? [...liveContact.images, newImageUrl.trim()] : [newImageUrl.trim()];
    updateImages(images);
    setNewImageUrl('');
    toast.success('Imagem adicionada!');
  };

  const removeImage = (index: number) => {
    const images = liveContact.images?.filter((_, i) => i !== index) ?? [];
    updateImages(images);
    toast.info('Imagem removida.');
  };

  const updateSuggestions = (suggestions: Suggestion[]) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === liveContact.id ? { ...c, suggestions } : c))
    );
  };

  const updateLinks = (links: { label: string; url: string }[]) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === liveContact.id ? { ...c, links } : c))
    );
  };

  const addLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    const links = [...liveContact.links, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }];
    updateLinks(links);
    setNewLinkLabel('');
    setNewLinkUrl('');
    toast.success('Link adicionado!');
  };

  const removeLink = (idx: number) => {
    const links = liveContact.links.filter((_, i) => i !== idx);
    updateLinks(links);
    toast.info('Link removido.');
  };

  const startEditSuggestion = (idx: number) => {
    setEditingSuggestion(idx);
    setEditText(liveContact.suggestions[idx].text);
  };

  const saveEditSuggestion = () => {
    if (editingSuggestion === null) return;
    const suggestions = liveContact.suggestions.map((s, i) =>
      i === editingSuggestion ? { ...s, text: editText } : s
    );
    updateSuggestions(suggestions);
    setEditingSuggestion(null);
    setEditText('');
    toast.success('Texto atualizado!');
  };

  const cancelEditSuggestion = () => {
    setEditingSuggestion(null);
    setEditText('');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Confira este contato estratégico: ${liveContact.name}`,
          url: contactUrl,
        });
      } catch {
        // Usuário cancelou ou share falhou
      }
    } else {
      toast.info('Compartilhamento nativo não disponível neste dispositivo.');
    }
  };

  return (
    <Dialog open={!!contact} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[92vh] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 pb-3 flex-shrink-0">
          <div className="flex items-start gap-4">
            <ContactAvatarEditor
              contactId={liveContact.id}
              images={liveContact.images}
              type={liveContact.type}
              className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 text-slate-400"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`${p.color} text-white text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0`}>
                  {p.label}
                </span>
                {liveContact.completed && (
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Contatado
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 leading-tight break-words">
                {liveContact.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-slate-600 font-medium">{liveContact.institution}</span>
                {liveContact.role && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="text-xs text-slate-500">{liveContact.role}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content with scroll */}
        <div className="flex-1 overflow-y-auto px-5 pb-5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start bg-slate-100 p-1 mb-4 sticky top-0 z-10">
              <TabsTrigger value="description" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Descricao
              </TabsTrigger>
              <TabsTrigger value="strategy" className="text-xs">
                <Target className="w-3 h-3 mr-1" />
                Estrategia
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                Textos
              </TabsTrigger>
              <TabsTrigger value="links" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Links
              </TabsTrigger>
              <TabsTrigger value="share" className="text-xs">
                <Share2 className="w-3 h-3 mr-1" />
                Compartilhar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4 mt-0">
              {(liveContact.images?.length ?? 0) > 0 && (
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Imagens</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {liveContact.images?.map((src, idx) => (
                      <div key={idx} className="relative flex-shrink-0 group">
                        <img
                          src={src}
                          alt=""
                          crossOrigin="anonymous"
                          className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm flex items-center justify-center"
                          title="Remover imagem"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Adicionar imagem</h4>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Cole a URL da imagem..."
                    className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addImage}>
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Sobre</h4>
                <p className="text-sm text-slate-700 leading-relaxed break-words">{liveContact.description}</p>
              </div>
              <div className="bg-violet-50 rounded-lg p-4 border border-violet-100">
                <h4 className="text-sm font-semibold text-violet-900 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  Por que contatar
                </h4>
                <p className="text-sm text-violet-800 leading-relaxed break-words">{liveContact.relevance}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {liveContact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="strategy" className="mt-0">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Estrategia de Abordagem
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed break-words">{liveContact.strategy}</p>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="mt-0 space-y-4">
              <div className="bg-violet-50 rounded-lg border border-violet-100 p-4">
                <p className="text-xs text-violet-800 flex items-center gap-1">
                  <Pencil className="w-3 h-3" />
                  Preencha suas variáveis na aba <strong className="mx-1">Meus dados</strong> para personalizar os textos abaixo.
                </p>
              </div>

              {liveContact.suggestions.map((suggestion, idx) => {
                const displayText = applyTemplateValues(suggestion.text, templateValues);
                return (
                  <div key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        {channelIcons[suggestion.channel]}
                        <span className="text-sm font-medium text-slate-700">{suggestion.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {editingSuggestion === idx ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-emerald-600"
                              onClick={saveEditSuggestion}
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Salvar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-slate-500"
                              onClick={cancelEditSuggestion}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => startEditSuggestion(idx)}
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => copyToClipboard(displayText, `${liveContact.id}-${idx}`)}
                        >
                          {copiedId === `${liveContact.id}-${idx}` ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 overflow-x-hidden">
                      {editingSuggestion === idx ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full min-h-[120px] px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                      ) : (
                        <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {linkifyText(displayText, liveContact.links).map((part, i) =>
                            part.type === 'link' && part.url ? (
                              <a
                                key={i}
                                href={part.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {part.content}
                              </a>
                            ) : (
                              <span key={i}>{part.content}</span>
                            )
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-500 break-words">
                <strong>Dica:</strong> Substitua [SEU NOME], [DESCRICAO], [LINK DO APP] e outros campos entre colchetes antes de enviar. Personalize sempre!
              </div>
            </TabsContent>

            <TabsContent value="links" className="mt-0 space-y-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Adicionar link</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    placeholder="Ex: Instagram"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                    onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  />
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                    onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  />
                </div>
                <Button type="button" size="sm" variant="outline" className="mt-3" onClick={addLink}>
                  Adicionar link
                </Button>
              </div>

              <div className="space-y-2">
                {liveContact.links.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group gap-3"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 min-w-0 flex-1"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700 truncate">{link.label}</span>
                    </a>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors truncate max-w-[200px]">
                        {link.url}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLink(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remover link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="share" className="mt-0 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Link direto</h4>
                <p className="text-xs text-slate-600 mb-3">
                  Copie o link abaixo para compartilhar este contato.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 truncate">
                    {contactUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLink}
                    className="flex-shrink-0 text-xs"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3 h-3 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={shareViaWhatsApp}
                >
                  <Smartphone className="w-4 h-4 mr-2 text-emerald-600" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={shareViaEmail}
                >
                  <Mail className="w-4 h-4 mr-2 text-sky-600" />
                  E-mail
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={shareNative}
                >
                  <Share2 className="w-4 h-4 mr-2 text-violet-600" />
                  Compartilhar
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <Button
            variant={liveContact.completed ? 'outline' : 'default'}
            size="sm"
            onClick={() => onToggle(liveContact.id)}
            className={`w-full text-xs h-9 ${liveContact.completed ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {liveContact.completed ? (
              <>
                <CircleIcon className="w-3 h-3 mr-1" />
                Desmarcar como contatado
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Marcar como contatado
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
