import { type AssistantMode } from '@/lib/settings';

interface ModeToggleProps {
  mode: AssistantMode;
  onChange: (mode: AssistantMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const modes = [
    {
      id: 'bedrock' as const,
      label: 'Text Only',
      description: 'Direct Bedrock',
      icon: '💬'
    },
    {
      id: 'lex' as const,
      label: 'Lex + Text',
      description: 'Lex → Bedrock',
      icon: '🤖'
    },
    {
      id: 'lex+voice' as const,
      label: 'Lex + Voice',
      description: 'Lex → Bedrock + Polly',
      icon: '🎤'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {modes.map((modeOption) => (
        <button
          key={modeOption.id}
          onClick={() => onChange(modeOption.id)}
          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
            mode === modeOption.id
              ? 'border-jc-cyan bg-jc-cyan/10 text-jc-cyan'
              : 'border-white/10 bg-white/5 text-jc-dim hover:border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{modeOption.icon}</span>
            <span className="font-semibold text-sm">{modeOption.label}</span>
          </div>
          <div className="text-xs opacity-75">{modeOption.description}</div>
        </button>
      ))}
    </div>
  );
}

