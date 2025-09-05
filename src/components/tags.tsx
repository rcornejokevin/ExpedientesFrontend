import { useEffect, useState } from 'react';

// Componente de entrada tipo "tags" para opciones únicas (CSV en el form)
function OptionsTagsInput({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Inicializa desde el valor (CSV) cuando cambia
  useEffect(() => {
    const parsed = (value ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setTags(parsed);
  }, [value]);

  const commitTags = (next: string[]) => {
    setTags(next);
    onChange(next.join(','));
  };

  const addFromInput = () => {
    const raw = inputValue.trim();
    if (!raw) return;
    const exists = tags.some((t) => t.toLowerCase() === raw.toLowerCase());
    if (!exists) {
      commitTags([...tags, raw]);
    }
    setInputValue('');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      addFromInput();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Backspace con input vacío elimina el último tag
      const next = tags.slice(0, -1);
      commitTags(next);
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();
    const pieces = text
      .split(/[,\n\t]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (pieces.length === 0) return;
    const dedup = [...tags];
    for (const p of pieces) {
      const exists = dedup.some((t) => t.toLowerCase() === p.toLowerCase());
      if (!exists) dedup.push(p);
    }
    commitTags(dedup);
  };

  const removeTag = (idx: number) => {
    const next = tags.filter((_, i) => i !== idx);
    commitTags(next);
  };

  return (
    <div className="rounded-3xl border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring/50">
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm"
          >
            {t}
            <button
              type="button"
              className="text-blue-700/70 hover:text-blue-900"
              onClick={() => removeTag(i)}
              aria-label={`Eliminar ${t}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[8rem] bg-transparent outline-none text-foreground"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={addFromInput}
          placeholder={placeholder ?? 'Escribe y presiona Enter'}
        />
      </div>
    </div>
  );
}
export default OptionsTagsInput;
