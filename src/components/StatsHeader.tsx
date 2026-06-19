import { Building2, Users, CheckCircle2, Target, Layers, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    byPriority: { '1': number; '2': number; '3': number };
    institutions: number;
    people: number;
  };
  activeFilter?:
    | 'total'
    | 'completed'
    | 'pending'
    | 'priority-1'
    | 'priority-2'
    | 'priority-3'
    | 'institutions'
    | 'people';
  onFilterTotal?: () => void;
  onFilterCompleted?: () => void;
  onFilterPriority?: (priority: '1' | '2' | '3') => void;
  onFilterInstitutions?: () => void;
  onFilterPeople?: () => void;
  onFilterPending?: () => void;
}

export function StatsHeader({
  stats,
  activeFilter,
  onFilterTotal,
  onFilterCompleted,
  onFilterPriority,
  onFilterInstitutions,
  onFilterPeople,
  onFilterPending,
}: StatsProps) {
  type CardId = NonNullable<StatsProps['activeFilter']>;
  interface Card {
    id: CardId;
    label: string;
    value: number;
    icon: typeof Layers;
    color: string;
    onClick?: () => void;
  }

  const statusCards: Card[] = [
    { id: 'total', label: 'Total de Contatos', value: stats.total, icon: Layers, color: 'bg-slate-800 text-white', onClick: onFilterTotal },
    { id: 'completed', label: 'Contatados', value: stats.completed, icon: CheckCircle2, color: 'bg-emerald-600 text-white', onClick: onFilterCompleted },
    { id: 'pending', label: 'Pendentes', value: stats.total - stats.completed, icon: Globe, color: 'bg-orange-500 text-white', onClick: onFilterPending },
  ];

  const detailCards: Card[] = [
    { id: 'priority-1', label: 'Prioridade 1', value: stats.byPriority['1'], icon: Target, color: 'bg-rose-600 text-white', onClick: () => onFilterPriority?.('1') },
    { id: 'priority-2', label: 'Prioridade 2', value: stats.byPriority['2'], icon: Target, color: 'bg-amber-500 text-white', onClick: () => onFilterPriority?.('2') },
    { id: 'priority-3', label: 'Prioridade 3', value: stats.byPriority['3'], icon: Target, color: 'bg-sky-600 text-white', onClick: () => onFilterPriority?.('3') },
    { id: 'institutions', label: 'Instituições', value: stats.institutions, icon: Building2, color: 'bg-violet-600 text-white', onClick: onFilterInstitutions },
    { id: 'people', label: 'Pessoas', value: stats.people, icon: Users, color: 'bg-teal-600 text-white', onClick: onFilterPeople },
  ];

  const renderCard = (card: Card) => {
    const isActive = activeFilter === card.id;
    return (
      <button
        key={card.id}
        type="button"
        onClick={card.onClick}
        className={cn(
          card.color,
          'rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl hover:brightness-110 transition-all cursor-pointer',
          isActive && 'ring-2 ring-offset-2 ring-slate-900 brightness-110',
          !isActive && 'opacity-90'
        )}
      >
        <card.icon className="w-5 h-5 mb-1 opacity-80" />
        <span className="text-2xl font-bold">{card.value}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-90">{card.label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="grid grid-cols-3 gap-3 flex-1">{statusCards.map(renderCard)}</div>
      <div className="hidden sm:block w-px bg-slate-300 mx-1" />
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 flex-[2]">{detailCards.map(renderCard)}</div>
    </div>
  );
}
