import { useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandCheck,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';

interface iField {
  expedientes: any[];
  expediente: any;
  form: any;
}
const Field = ({ expedientes, expediente, form }: iField) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const options = useMemo(
    () =>
      (expedientes || []).filter(
        (item) => String(item.id) !== String(expediente?.id ?? ''),
      ),
    [expedientes, expediente?.id],
  );

  const hasQuery = searchTerm.trim().length > 0;

  const filteredOptions = useMemo(() => {
    if (!hasQuery) {
      return [] as typeof options;
    }

    const normalizedQuery = searchTerm.trim().toLowerCase();

    return options.filter((item) =>
      `${item.codigo ?? ''} ${item.nombre ?? ''}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [hasQuery, options, searchTerm]);

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  return (
    <FormField
      control={form.control}
      name={'EXPEDIENTE RELACIONADO'}
      render={({ field }) => {
        const selectedValue = String(field.value ?? '0');
        const selectedOption = options.find(
          (item) => String(item.id) === selectedValue,
        );

        return (
          <FormItem>
            <FormLabel className="color-dark-blue-marn font-bold">
              EXPEDIENTE RELACIONADO
            </FormLabel>
            <FormControl>
              <div>
                <input
                  type="hidden"
                  ref={field.ref}
                  value={field.value ? String(field.value) : ''}
                  name={field.name}
                  readOnly
                />
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between rounded-3xl"
                    >
                      <span className="truncate font-semibold text-[#1E2851]">
                        {selectedOption?.codigo || '[SIN EXPEDIENTE RELACIONADO]'}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar expediente..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandList>
                        {!hasQuery && (
                          <div className="px-3 py-2 text-xs text-muted-foreground">
                            Escribe para buscar expedientes.
                          </div>
                        )}
                        {hasQuery && filteredOptions.length === 0 && (
                          <div className="px-3 py-4 text-sm text-muted-foreground">
                            Sin resultados.
                          </div>
                        )}
                        {hasQuery && filteredOptions.length > 0 && (
                          <CommandGroup>
                            {filteredOptions.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={`${item.codigo ?? ''} ${
                                  item.nombre ?? ''
                                } ${item.id}`.trim()}
                                onSelect={() => {
                                  field.onChange(String(item.id));
                                  setOpen(false);
                                }}
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-[#1E2851]">
                                    {item.codigo}
                                  </span>
                                  {item.nombre && (
                                    <span className="text-xs text-muted-foreground">
                                      {item.nombre}
                                    </span>
                                  )}
                                </div>
                                {selectedValue === String(item.id) && (
                                  <CommandCheck />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                        <CommandGroup>
                          <CommandItem
                            value="0"
                            onSelect={() => {
                              field.onChange('0');
                              setOpen(false);
                            }}
                          >
                            <span className="truncate font-semibold">
                              [SIN EXPEDIENTE RELACIONADO]
                            </span>
                            {selectedValue === '0' && <CommandCheck />}
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
export { Field };
