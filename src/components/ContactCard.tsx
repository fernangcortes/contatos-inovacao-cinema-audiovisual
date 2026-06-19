import type { Contact } from '@/types/contact';
import { ContactAvatarEditor } from './ContactAvatarEditor';
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onOpen: (c: Contact) => void;
  onToggle: (id: string) => void;
}

const priorityConfig = {
  '1': { label: 'P1', color: 'bg-rose-600', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  '2': { label: 'P2', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  '3': { label: 'P3', color: 'bg-sky-600', text: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
};

export function ContactCard({ contact, onOpen, onToggle }: ContactCardProps) {
  const p = priorityConfig[contact.priority];

  return (
    <div
      className={`group bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${
        contact.completed ? 'border-emerald-200 opacity-75' : 'border-slate-200 hover:border-slate-300'
      } ${p.border}`}
    >
      <div className={`h-1 ${p.color}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ContactAvatarEditor
              contactId={contact.id}
              images={contact.images}
              type={contact.type}
              className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-slate-400"
            />
            <h3 className="font-semibold text-sm text-slate-900 truncate">{contact.name}</h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className={`${p.color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>
              {p.label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(contact.id);
              }}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title={contact.completed ? 'Marcar como pendente' : 'Marcar como contatado'}
            >
              {contact.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">{contact.institution}</span>
          {contact.role && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-400">{contact.role}</span>
            </>
          )}
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{contact.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {contact.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.bg} ${p.text}`}
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
                +{contact.tags.length - 3}
              </span>
            )}
          </div>

          <button
            onClick={() => onOpen(contact)}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors group-hover:translate-x-0.5 transition-transform"
          >
            Ver detalhes
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
