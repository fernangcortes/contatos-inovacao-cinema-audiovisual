import type { Event, EventType, EventStatus, EventScope } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Calendar, MapPin, AlertCircle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface EventsListProps {
  events: Event[];
  search: string;
  setSearch: (s: string) => void;
  typeFilter: EventType | 'all';
  setTypeFilter: (t: EventType | 'all') => void;
  statusFilter: EventStatus | 'all';
  setStatusFilter: (s: EventStatus | 'all') => void;
  scopeFilter: EventScope | 'all';
  setScopeFilter: (s: EventScope | 'all') => void;
  formatDate: (date: string) => string;
  onOpenContact: (institutionId?: string) => void;
}

const typeLabels: Record<EventType | 'all', string> = {
  all: 'Todos',
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Híbrido',
};

const statusLabels: Record<EventStatus | 'all', string> = {
  all: 'Todos',
  confirmado: 'Confirmado',
  em_definicao: 'Em definição',
  cancelado: 'Cancelado',
  encerrado: 'Encerrado',
};

const scopeLabels: Record<EventScope | 'all', string> = {
  all: 'Todos',
  brasil: 'Brasil',
  global: 'Global',
  regional: 'Regional',
};

const statusConfig: Record<EventStatus, { color: string; icon: React.ReactNode }> = {
  confirmado: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
  em_definicao: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <HelpCircle className="w-3 h-3" /> },
  cancelado: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: <XCircle className="w-3 h-3" /> },
  encerrado: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <AlertCircle className="w-3 h-3" /> },
};

const typeConfig: Record<EventType, string> = {
  presencial: 'bg-indigo-100 text-indigo-700',
  online: 'bg-sky-100 text-sky-700',
  hibrido: 'bg-violet-100 text-violet-700',
};

const scopeConfig: Record<EventScope, string> = {
  brasil: 'bg-green-100 text-green-700',
  global: 'bg-amber-100 text-amber-700',
  regional: 'bg-teal-100 text-teal-700',
};

export function EventsList({
  events,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  scopeFilter,
  setScopeFilter,
  formatDate,
  onOpenContact,
}: EventsListProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar eventos, festivais, locais..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(typeLabels) as (EventType | 'all')[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {typeLabels[t]}
            </button>
          ))}

          <div className="w-px h-5 bg-slate-200 hidden sm:block" />

          {(Object.keys(statusLabels) as (EventStatus | 'all')[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}

          <div className="w-px h-5 bg-slate-200 hidden sm:block" />

          {(Object.keys(scopeLabels) as (EventScope | 'all')[]).map((s) => (
            <button
              key={s}
              onClick={() => setScopeFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                scopeFilter === s ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {scopeLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {events.map((e) => {
            const status = statusConfig[e.status];
            return (
              <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className={`text-[10px] ${status.color}`}>
                        <span className="mr-1">{status.icon}</span>
                        {statusLabels[e.status]}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${typeConfig[e.type]}`}>
                        {typeLabels[e.type]}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${scopeConfig[e.scope]}`}>
                        {scopeLabels[e.scope]}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 leading-tight">{e.title}</h3>
                    {e.subtitle && <p className="text-xs text-slate-500 mt-0.5">{e.subtitle}</p>}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">{e.description}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(e.startDate)}
                    {e.endDate && e.endDate !== e.startDate && ` → ${formatDate(e.endDate)}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {e.location.city}
                    {e.location.country && e.location.country !== 'Brasil' && `, ${e.location.country}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {e.institutionId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => onOpenContact(e.institutionId)}
                    >
                      Ver instituição
                    </Button>
                  )}
                  {e.website && (
                    <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
                      <a href={e.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Site oficial
                      </a>
                    </Button>
                  )}
                  {e.registrationUrl && e.registrationUrl !== e.website && (
                    <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
                      <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Inscrição
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">Nenhum evento encontrado</h3>
          <p className="text-sm text-slate-500 mt-1">Tente ajustar os filtros ou buscar por outro termo.</p>
        </div>
      )}
    </div>
  );
}
