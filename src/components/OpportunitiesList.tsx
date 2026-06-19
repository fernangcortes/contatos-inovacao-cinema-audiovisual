import type { Opportunity, OpportunityType, OpportunityStatus } from '@/types/opportunity';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  search: string;
  setSearch: (s: string) => void;
  typeFilter: OpportunityType | 'all';
  setTypeFilter: (t: OpportunityType | 'all') => void;
  statusFilter: OpportunityStatus | 'all';
  setStatusFilter: (s: OpportunityStatus | 'all') => void;
  formatDate: (date?: string) => string | null;
  onOpenContact: (institutionId: string) => void;
}

const typeLabels: Record<OpportunityType | 'all', string> = {
  all: 'Todos',
  edital: 'Editais',
  chamada: 'Chamadas',
  evento: 'Eventos',
  noticia: 'Notícias',
};

const statusLabels: Record<OpportunityStatus | 'all', string> = {
  all: 'Todos',
  aberto: 'Aberto',
  em_breve: 'Em breve',
  encerrado: 'Encerrado',
};

const statusConfig: Record<OpportunityStatus, { color: string; icon: React.ReactNode }> = {
  aberto: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
  em_breve: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-3 h-3" /> },
  encerrado: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <AlertCircle className="w-3 h-3" /> },
};

const typeConfig: Record<OpportunityType, string> = {
  edital: 'bg-violet-100 text-violet-700',
  chamada: 'bg-sky-100 text-sky-700',
  evento: 'bg-rose-100 text-rose-700',
  noticia: 'bg-teal-100 text-teal-700',
};

export function OpportunitiesList({
  opportunities,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  formatDate,
  onOpenContact,
}: OpportunitiesListProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar editais, chamadas, eventos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(typeLabels) as (OpportunityType | 'all')[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {typeLabels[t]}
            </button>
          ))}

          <div className="w-px h-5 bg-slate-200 hidden sm:block" />

          {(Object.keys(statusLabels) as (OpportunityStatus | 'all')[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities.map((o) => {
            const status = statusConfig[o.status];
            return (
              <div
                key={o.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className={`text-[10px] ${status.color}`}>
                        <span className="mr-1">{status.icon}</span>
                        {statusLabels[o.status]}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${typeConfig[o.type]}`}>
                        {typeLabels[o.type]}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 leading-tight">{o.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">{o.description}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 flex-wrap">
                  <span className="font-medium">Fonte: {o.source}</span>
                  {o.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Prazo: {formatDate(o.deadline)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => onOpenContact(o.institutionId)}
                  >
                    Ver instituição
                  </Button>
                  {o.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8"
                      asChild
                    >
                      <a href={o.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Site oficial
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
          <h3 className="text-lg font-semibold text-slate-700">Nenhuma oportunidade encontrada</h3>
          <p className="text-sm text-slate-500 mt-1">
            Tente ajustar os filtros ou buscar por outro termo.
          </p>
        </div>
      )}
    </div>
  );
}
