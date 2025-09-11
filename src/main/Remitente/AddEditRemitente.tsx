import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Edit as EditRemitente,
  New as NewRemitente,
  Remitente,
} from '@/models/Remitentes';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon, LucideUser } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Alerts, { useFlash } from '@/lib/alerts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { getNewSchema, newSchemaType } from './NewSchemaType';

interface AddRemitenteI {
  open: boolean;
  setOpen: any;
  remitente?: Remitente;
  edit: boolean;
}
export default function addEditRemitente({
  open,
  setOpen,
  remitente,
  edit,
}: AddRemitenteI) {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewSchema()),
    defaultValues: {
      descripcion: '',
    },
  });
  const resetForm = () => {
    form.reset({
      descripcion: '',
    });
    form.clearErrors();
  };
  async function onSubmit(values: newSchemaType) {
    setLoading(true);
    try {
      let response: any = null;
      if (edit == false) {
        const newRemitente: Remitente = {
          descripcion: values.descripcion,
        };
        response = await NewRemitente(user?.jwt ?? '', newRemitente);
      } else if (remitente != undefined) {
        const itemEditted: Remitente = remitente;
        itemEditted.descripcion = values.descripcion;
        response = await EditRemitente(user?.jwt ?? '', itemEditted);
      }
      if (response.code == '000') {
        if (edit) {
          setAlert({
            type: 'success',
            message: 'Remitente editado correctamente.',
          });
        } else {
          setAlert({
            type: 'success',
            message: 'Remitente creado correctamente.',
          });
        }
        resetForm();
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: `${error}` });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (edit && remitente) {
      form.reset({
        descripcion: remitente.descripcion,
      });
      form.clearErrors();
    }
  }, [remitente]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {edit ? 'Editar Remitente' : 'Crear Remitente'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full">
            <DialogBody>
              <Alerts />
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripcion</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputAddon mode="icon">
                            <LucideUser />
                          </InputAddon>
                          <Input
                            placeholder="Ingrese la descripcion"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cerrar
                </Button>
              </DialogClose>
              <Button type="submit">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    Cargando...
                  </span>
                ) : (
                  'Guardar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
