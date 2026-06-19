import { useState, useRef, useCallback } from 'react';
import type { Contact } from '@/types/contact';
import { useContacts } from '@/hooks/useContacts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building2, User, Pencil, Upload, Link2, ZoomIn, ZoomOut, Move, X } from 'lucide-react';
import { toast } from 'sonner';

interface ContactAvatarEditorProps {
  contactId: string;
  images?: string[];
  type: Contact['type'];
  className?: string;
  fallbackClassName?: string;
}

const POSITIONS = [
  { label: 'Topo', value: 'top' },
  { label: 'Centro', value: 'center' },
  { label: 'Base', value: 'bottom' },
  { label: 'Esquerda', value: 'left' },
  { label: 'Direita', value: 'right' },
];

export function ContactAvatarEditor({
  contactId,
  images,
  type,
  className = '',
  fallbackClassName = '',
}: ContactAvatarEditorProps) {
  const { allContacts, setContacts } = useContacts();
  const contact = allContacts.find((c) => c.id === contactId);
  const src = images?.[0];
  const [open, setOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [editPosition, setEditPosition] = useState(contact?.avatarPosition ?? 'center');
  const [editScale, setEditScale] = useState(contact?.avatarScale ?? 1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const position = contact?.avatarPosition ?? 'center';
  const scale = contact?.avatarScale ?? 1;

  const updateAvatarMeta = useCallback(
    (updates: { avatarPosition?: string; avatarScale?: number }) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, ...updates } : c))
      );
    },
    [contactId, setContacts]
  );

  const handleOpen = () => {
    setEditPosition(contact?.avatarPosition ?? 'center');
    setEditScale(contact?.avatarScale ?? 1);
    setOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, images: [base64, ...(c.images?.slice(1) ?? [])], avatarPosition: 'center', avatarScale: 1 }
            : c
        )
      );
      toast.success('Avatar atualizado!');
      setEditPosition('center');
      setEditScale(1);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (!url) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, images: [url, ...(c.images?.slice(1) ?? [])], avatarPosition: 'center', avatarScale: 1 }
            : c
        )
      );
      toast.success('Avatar atualizado!');
      setUrlInput('');
      setEditPosition('center');
      setEditScale(1);
    };
    img.onerror = () => {
      toast.error('Não foi possível carregar a imagem externa. Tente fazer o upload do arquivo local.');
    };
    img.src = url;
  };

  const handlePositionChange = (value: string) => {
    setEditPosition(value);
    updateAvatarMeta({ avatarPosition: value });
  };

  const handleScaleChange = (delta: number) => {
    const next = Math.max(0.5, Math.min(3, editScale + delta));
    setEditScale(next);
    updateAvatarMeta({ avatarScale: next });
  };

  const fallback = type === 'instituicao' ? (
    <Building2 className={fallbackClassName || className} />
  ) : (
    <User className={fallbackClassName || className} />
  );

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        className="relative group flex-shrink-0"
        title="Editar avatar"
      >
        {src ? (
          <img
            key={src}
            src={src}
            alt=""
            crossOrigin="anonymous"
            className={`object-cover ${className}`}
            style={{
              objectPosition: position,
              transform: `scale(${scale})`,
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className={`flex items-center justify-center overflow-hidden ${className}`}>
            {fallback}
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="w-4 h-4 text-white" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-base">Editar avatar</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-50">
                {src ? (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover transition-all"
                    style={{
                      objectPosition: editPosition,
                      transform: `scale(${editScale})`,
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {fallback}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload de arquivo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Link2 className="w-3 h-3" /> URL da imagem
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <Button type="button" size="sm" variant="outline" onClick={handleUrlSubmit}>
                  Usar
                </Button>
              </div>
              <p className="text-[10px] text-slate-500">
                URLs externas podem ser bloqueadas pelo navegador (CORS). Se falhar, faça upload local.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Move className="w-3 h-3" /> Posição
              </label>
              <div className="flex flex-wrap gap-1">
                {POSITIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePositionChange(p.value)}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                      editPosition === p.value
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <ZoomIn className="w-3 h-3" /> Zoom
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScaleChange(-0.1)}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-xs font-medium text-slate-700 w-10 text-center">
                  {Math.round(editScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => handleScaleChange(0.1)}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(false)}>
              <X className="w-3 h-3 mr-1" />
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
