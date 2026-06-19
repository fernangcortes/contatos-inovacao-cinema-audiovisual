import { applyTemplateValues, DEFAULT_TEMPLATE_VALUES, type TemplateValues } from '@/lib/utils';
import { UserCircle, Pencil } from 'lucide-react';

interface UserProfileFormProps {
  templateValues: TemplateValues;
  setTemplateValues: React.Dispatch<React.SetStateAction<TemplateValues>>;
}

const sampleText = `Olá, meu nome é [SEU NOME] e represento a startup [NOME DA STARTUP].

Estamos desenvolvendo um aplicativo focado em [BREVE DESCRIÇÃO DO APP]. Você pode conhecer mais pelo link: [LINK DO APP]. Temos também uma demo disponível em [LINK DEMO].

Meu LinkedIn: [LINKEDIN]
Meu telefone: [TELEFONE]`;

export function UserProfileForm({ templateValues, setTemplateValues }: UserProfileFormProps) {
  const fields: Array<{ key: keyof TemplateValues; placeholder: string }> = [
    { key: 'SEU NOME', placeholder: 'Seu nome completo' },
    { key: 'NOME DA STARTUP', placeholder: 'Nome da startup ou app' },
    { key: 'BREVE DESCRIÇÃO DO APP', placeholder: 'Breve descrição do aplicativo' },
    { key: 'LINK DO APP', placeholder: 'https://...' },
    { key: 'LINK DEMO', placeholder: 'https://...' },
    { key: 'LINKEDIN', placeholder: 'https://linkedin.com/in/...' },
    { key: 'TELEFONE', placeholder: '(XX) XXXXX-XXXX' },
  ];

  const previewText = applyTemplateValues(sampleText, templateValues);
  const hasValues = Object.values(templateValues).some((v) => v.trim().length > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-violet-100 rounded-lg">
          <UserCircle className="w-5 h-5 text-violet-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Meus dados</h2>
          <p className="text-sm text-slate-500">
            Preencha suas variáveis para personalizar os textos de contato.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
              <Pencil className="w-3 h-3 text-slate-400" />
              {key}
            </label>
            <input
              type={key.includes('LINK') || key === 'LINKEDIN' ? 'url' : 'text'}
              value={templateValues[key]}
              onChange={(e) =>
                setTemplateValues((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder={placeholder}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Pré-visualização</h3>
        <p className="text-xs text-slate-500 mb-3">
          Assim ficam os textos quando os valores acima são substituídos:
        </p>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          {hasValues ? (
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {previewText}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">
              Preencha ao menos um campo acima para ver a pré-visualização.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setTemplateValues(DEFAULT_TEMPLATE_VALUES)}
        className="text-xs text-slate-500 hover:text-rose-600 underline transition-colors"
      >
        Limpar todos os campos
      </button>
    </div>
  );
}
