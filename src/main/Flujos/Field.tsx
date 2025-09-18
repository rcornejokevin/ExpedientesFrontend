import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListFlujos, ItemFlujo } from '@/models/Flujos';
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
  const [items, setItems] = useState<ItemFlujo[]>();
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetListFlujos(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data.map((f: any) => ({
          id: String(f.id),
          nombre: f.nombre,
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
      name="flujo" // asegúrate que en tu schema sea string
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg color-dark-blue-marn font-bold">
            SELECCIONE UN FLUJO
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
                <SelectValue placeholder="Seleccione un Flujo" />
              </SelectTrigger>
              <SelectContent>
                {items
                  ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((item: any) => (
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
