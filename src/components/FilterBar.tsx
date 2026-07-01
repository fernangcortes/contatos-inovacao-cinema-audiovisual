import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Priority, Category, ContactType } from '@/types/contact';

interface FilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  priorityFilter: Priority | 'all';
  setPriorityFilter: (p: Priority | 'all') => void;
  categoryFilter: Category | 'all';
  setCategoryFilter: (c: Category | 'all') => void;
  typeFilter: ContactType | 'all';
  setTypeFilter: (t: ContactType | 'all') => void;
  statusFilter: 'all' | 'completed' | 'pending';
  setStatusFilter: (s: 'all' | 'completed' | 'pending') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const priorities: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: '1', label: 'P1 — Máxima' },
  { value: '2', label: 'P2 — Alta' },
  { value: '3', label: 'P3 — Média' },
];

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'hub-coworking', label: 'Hub/Coworking' },
  { value: 'laboratorio-publico', label: 'Lab Público' },
  { value: 'laboratorio-universidade', label: 'Lab Universitário' },
  { value: 'universidade-ensino', label: 'Universidade/Ensino' },
  { value: 'espaco-cultural', label: 'Espaço Cultural' },
  { value: 'festival', label: 'Festival' },
  { value: 'associacao', label: 'Associação' },
  { value: 'produtora', label: 'Produtora' },
  { value: 'plataforma-pesquisa', label: 'Plataforma de Pesquisa' },
  { value: 'aceleracao', label: 'Aceleração' },
  { value: 'evento-mercado', label: 'Evento/Mercado' },
  { value: 'fomento', label: 'Fomento' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'pessoa', label: 'Pessoa' },
];

const types: { value: ContactType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'instituicao', label: 'Instituições' },
  { value: 'pessoa', label: 'Pessoas' },
];

const statuses: { value: 'all' | 'completed' | 'pending'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'completed', label: 'Contatados' },
  { value: 'pending', label: 'Pendentes' },
];

export function FilterBar({
  search,
  setSearch,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar por nome, instituição, descrição ou tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Filtros:</span>

        <div className="flex gap-1 flex-wrap">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriorityFilter(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                priorityFilter === p.value
                  ? p.value === '1'
                    ? 'bg-rose-600 text-white'
                    : p.value === '2'
                    ? 'bg-amber-500 text-white'
                    : p.value === '3'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        <div className="flex gap-1 flex-wrap">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t.value
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        <div className="flex gap-1 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s.value
                  ? s.value === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : s.value === 'pending'
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border-none outline-none cursor-pointer hover:bg-slate-200 transition-colors"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Visualização em grade"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Visualização em lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
