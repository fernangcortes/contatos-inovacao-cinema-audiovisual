import type { ResearchSource, ResearchSourceType, ResearchSourceScope, ResearchSourceRelevance } from '@/types/researchSource';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, AlertCircle, Star, Globe, FileText, Newspaper, Database, Globe2, Bookmark } from 'lucide-react';

interface ResearchSourcesListProps {
  sources: ResearchSource[];
  search: string;
  setSearch: (s: string) => void;
  typeFilter: ResearchSourceType | 'all';
  setTypeFilter: (t: ResearchSourceType | 'all') => void;
  scopeFilter: ResearchSourceScope | 'all';
  setScopeFilter: (s: ResearchSourceScope | 'all') => void;
  relevanceFilter: ResearchSourceRelevance | 'all';
  setRelevanceFilter: (r: ResearchSourceRelevance | 'all') => void;
}

const typeLabels: Record<ResearchSourceType | 'all', string> = {
  all: 'Todos',
  documento: 'Documento',
  plataforma: 'Plataforma',
  'site-oficial': 'Site oficial',
  publicacao: 'Publicação',
  dados: 'Dados',
  'rede-social': 'Rede social',
  outro: 'Outro',
};

const scopeLabels: Record<ResearchSourceScope | 'all', string> = {
  all: 'Todos',
  brasil: 'Brasil',
  global: 'Global',
  regional: 'Regional',
};

const relevanceLabels: Record<ResearchSourceRelevance | 'all', string> = {
  all: 'Todas',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const typeConfig: Record<ResearchSourceType, { color: string; icon: React.ReactNode }> = {
  documento: { color: 'bg-slate-100 text-slate-700', icon: <FileText className="w-3 h-3" /> },
  plataforma: { color: 'bg-violet-100 text-violet-700', icon: <Globe2 className="w-3 h-3" /> },
  'site-oficial': { color: 'bg-sky-100 text-sky-700', icon: <Globe className="w-3 h-3" /> },
  publicacao: { color: 'bg-amber-100 text-amber-700', icon: <Newspaper className="w-3 h-3" /> },
  dados: { color: 'bg-emerald-100 text-emerald-700', icon: <Database className="w-3 h-3" /> },
  'rede-social': { color: 'bg-rose-100 text-rose-700', icon: <Bookmark className="w-3 h-3" /> },
  outro: { color: 'bg-slate-100 text-slate-700', icon: <FileText className="w-3 h-3" /> },
};

const scopeConfig: Record<ResearchSourceScope, string> = {
  brasil: 'bg-green-100 text-green-700',
  global: 'bg-amber-100 text-amber-700',
  regional: 'bg-teal-100 text-teal-700',
};

const relevanceConfig: Record<ResearchSourceRelevance, string> = {
  alta: 'bg-rose-100 text-rose-700',
  media: 'bg-amber-100 text-amber-700',
  baixa: 'bg-slate-100 text-slate-700',
};

export function ResearchSourcesList({
  sources,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  scopeFilter,
  setScopeFilter,
  relevanceFilter,
  setRelevanceFilter,
}: ResearchSourcesListProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar fontes, documentos, plataformas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(typeLabels) as (ResearchSourceType | 'all')[]).map((t) => (
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

          {(Object.keys(scopeLabels) as (ResearchSourceScope | 'all')[]).map((s) => (
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

          <div className="w-px h-5 bg-slate-200 hidden sm:block" />

          {(Object.keys(relevanceLabels) as (ResearchSourceRelevance | 'all')[]).map((r) => (
            <button
              key={r}
              onClick={() => setRelevanceFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                relevanceFilter === r ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Star className="w-3 h-3 inline mr-1" />
              {relevanceLabels[r]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {sources.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sources.map((s) => {
            const type = typeConfig[s.type];
            return (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="secondary" className={`text-[10px] ${type.color}`}>
                        <span className="mr-1">{type.icon}</span>
                        {typeLabels[s.type]}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${scopeConfig[s.scope]}`}>
                        {scopeLabels[s.scope]}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${relevanceConfig[s.relevance]}`}>
                        <Star className="w-3 h-3 mr-1" />
                        {relevanceLabels[s.relevance]}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 leading-tight">{s.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">{s.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {s.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {s.url && (
                    <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Acessar fonte
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
          <h3 className="text-lg font-semibold text-slate-700">Nenhuma fonte encontrada</h3>
          <p className="text-sm text-slate-500 mt-1">Tente ajustar os filtros ou buscar por outro termo.</p>
        </div>
      )}
    </div>
  );
}
