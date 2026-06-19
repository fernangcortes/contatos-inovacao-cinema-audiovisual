import { useState } from 'react';
import { steps } from '@/data/contacts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  FileText,
  Rocket,
  Target,
  Globe,
  Award,
} from 'lucide-react';

const stepIcons: Record<number, React.ReactNode> = {
  1: <FileText className="w-5 h-5" />,
  2: <Rocket className="w-5 h-5" />,
  3: <Target className="w-5 h-5" />,
  4: <Lightbulb className="w-5 h-5" />,
  5: <Globe className="w-5 h-5" />,
  6: <FileText className="w-5 h-5" />,
  7: <Rocket className="w-5 h-5" />,
  8: <Target className="w-5 h-5" />,
  9: <Globe className="w-5 h-5" />,
  10: <Award className="w-5 h-5" />,
  11: <Globe className="w-5 h-5" />,
  12: <Award className="w-5 h-5" />,
};

export function StepsGuide() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const progress = Math.round((completedSteps.size / steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Seu Progresso</h3>
            <p className="text-sm text-slate-500">
              {completedSteps.size} de {steps.length} passos concluídos
            </p>
          </div>
          <Badge variant="outline" className="text-lg font-bold px-4 py-1">
            {progress}%
          </Badge>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isCompleted = completedSteps.has(step.id);
          const isExpanded = expandedStep === step.id;

          return (
            <Card
              key={step.id}
              className={`overflow-hidden transition-all duration-200 ${
                isCompleted ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'
              }`}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStep(step.id);
                    }}
                    className="flex-shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </button>

                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {stepIcons[step.id]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-semibold text-sm ${
                          isCompleted ? 'text-emerald-800 line-through' : 'text-slate-900'
                        }`}
                      >
                        {step.id}. {step.title}
                      </h4>
                      {isCompleted && (
                        <Badge
                          variant="outline"
                          className="border-emerald-300 text-emerald-700 text-[10px]"
                        >
                          Concluído
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{step.description}</p>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pl-16">
                    <p className="text-sm text-slate-700 mb-3">{step.description}</p>
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'default'}
                      onClick={() => toggleStep(step.id)}
                      className={
                        isCompleted
                          ? 'border-emerald-300 text-emerald-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }
                    >
                      {isCompleted ? (
                        <>
                          <Circle className="w-4 h-4 mr-1" />
                          Desmarcar
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Concluir passo
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-slate-800 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-3">Dicas Gerais</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Personalize cada mensagem — nunca envie spam genérico
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Tenha um pitch de 30 segundos pronto
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Mostre um demo funcional — links funcionam melhor que descrições
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Proponha valor mútuo — não peça ajuda; ofereça parceria
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Mensagens curtas e diretas têm mais chances de resposta
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Para contatos internacionais, use LinkedIn como canal principal
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Participe de eventos (BrLab, SET Expo) para networking presencial
          </li>
        </ul>
      </div>
    </div>
  );
}
