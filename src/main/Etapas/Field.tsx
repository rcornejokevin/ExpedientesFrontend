import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListEtapa, ItemEtapa } from '@/models/Etapas';
import { useFlash } from '@/lib/alerts';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface iField {
  form: any;
  onChange: any;
}

const Field = ({ form, onChange }: iField) => {
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const [items, setItems] = useState<ItemEtapa[]>();
  const selectedFlujo = form.watch('flujo');
  const filteredEtapa = items?.filter(
    (i) => String(i.flujo ?? '') === String(selectedFlujo ?? ''),
  );
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetListEtapa(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data.map((f: any) => ({
          id: String(f.id),
          nombre: f.nombre,
          flujo: f.flujoId,
        }));
        setItems(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };

    if (items === undefined || items?.length == 0) fetchData();
  }, []);
  return (
    <FormField
      control={form.control}
      name="etapa" // asegúrate que en tu schema sea string
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg color-dark-blue-marn font-bold">
            SELECCIONE UNA ETAPA
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                onChange();
              }}
              value={field.value}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una etapa" />
              </SelectTrigger>
              <SelectContent>
                {filteredEtapa?.map((item: any) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export { Field };
