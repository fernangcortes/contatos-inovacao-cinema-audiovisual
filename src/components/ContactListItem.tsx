import type { Contact } from '@/types/contact';
import { ContactAvatarEditor } from './ContactAvatarEditor';
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';

interface ContactListItemProps {
  contact: Contact;
  onOpen: (c: Contact) => void;
  onToggle: (id: string) => void;
}

const priorityConfig = {
  '1': { label: 'P1', color: 'bg-rose-600', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  '2': { label: 'P2', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  '3': { label: 'P3', color: 'bg-sky-600', text: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
};

export function ContactListItem({ contact, onOpen, onToggle }: ContactListItemProps) {
  const p = priorityConfig[contact.priority];

  return (
    <div
      className={`group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
        contact.completed ? 'border-emerald-200 opacity-75' : 'border-slate-200 hover:border-slate-300'
      } ${p.border}`}
      onClick={() => onOpen(contact)}
    >
      <div className="flex items-center gap-3 p-3 sm:p-4">
        <div className={`w-1 self-stretch rounded-full ${p.color}`} />

        <div className="flex-shrink-0">
          <ContactAvatarEditor
            contactId={contact.id}
            images={contact.images}
            type={contact.type}
            className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-400"
          />
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
          <div className="sm:col-span-4 min-w-0">
            <h3 className="font-semibold text-sm text-slate-900 truncate">{contact.name}</h3>
            <p className="text-xs text-slate-500 truncate">{contact.institution}</p>
          </div>

          <div className="sm:col-span-3 min-w-0">
            {contact.role && <p className="text-xs text-slate-600 truncate">{contact.role}</p>}
            <p className="text-xs text-slate-400 truncate hidden sm:block">
              {contact.description.slice(0, 60)}...
            </p>
          </div>

          <div className="sm:col-span-4 flex flex-wrap gap-1 items-center">
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
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`${p.color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>
            {p.label}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(contact.id);
            }}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            title={contact.completed ? 'Marcar como pendente' : 'Marcar como contatado'}
          >
            {contact.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
