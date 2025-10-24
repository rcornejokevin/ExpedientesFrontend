import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Edit as EditUsuario,
  New as NewUsuario,
  Usuario,
} from '@/models/Usuarios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, LoaderCircleIcon, LucideUser, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Alerts, { useFlash } from '@/lib/alerts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getNewSchema, newSchemaType } from './NewSchemaType';

interface AddUsuarioI {
  open: boolean;
  setOpen: any;
  usuario?: Usuario;
  edit: boolean;
}
export default function AddEditUsuario({
  open,
  setOpen,
  usuario,
  edit,
}: AddUsuarioI) {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewSchema()),
    defaultValues: {
      username: '',
      perfil: '',
      email: '',
    },
  });
  const resetForm = () => {
    form.reset({
      username: '',
      perfil: '',
      email: '',
    });
    form.clearErrors();
  };
  async function onSubmit(values: newSchemaType) {
    setLoading(true);
    try {
      let response: any = null;
      if (edit == false) {
        const newUser: Usuario = {
          username: values.username,
          perfil: values.perfil,
          operativo: values.operativo,
          email: values.email,
        };
        response = await NewUsuario(user?.jwt ?? '', newUser);
      } else if (usuario != undefined) {
        const itemEditted: Usuario = usuario;
        itemEditted.username = values.username;
        itemEditted.perfil = values.perfil;
        itemEditted.operativo = values.operativo;
        itemEditted.email = values.email;
        response = await EditUsuario(user?.jwt ?? '', itemEditted);
      }
      if (response.code == '000') {
        if (edit) {
          setAlert({
            type: 'success',
            message: 'Usuario editado correctamente.',
          });
        } else {
          setAlert({
            type: 'success',
            message: 'Usuario creado correctamente.',
          });
        }
        resetForm();
        setOpen(false);
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
    if (edit && usuario) {
      form.reset({
        username: usuario.username,
        perfil: usuario.perfil,
        operativo: usuario.operativo,
        email: usuario.email,
      });
      form.clearErrors();
    }
  }, [usuario]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{edit ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full">
            <DialogBody>
              <Alerts />
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputAddon mode="icon">
                            <LucideUser />
                          </InputAddon>
                          <Input placeholder="Ingrese el username" {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputAddon mode="icon">
                            <Mail />
                          </InputAddon>
                          <Input placeholder="Ingrese el email" {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="perfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputAddon mode="icon">
                            <Key />
                          </InputAddon>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                            }}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el Perfil" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={'ADMINISTRADOR'}>
                                ADMINISTRADOR
                              </SelectItem>
                              <SelectItem value={'ASESOR'}>ASESOR</SelectItem>
                              <SelectItem value={'IT'}>IT</SelectItem>
                              <SelectItem value={'PROCURADOR'}>
                                PROCURADOR
                              </SelectItem>
                              <SelectItem value={'RECEPCIÓN'}>
                                RECEPCIÓN
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operativo" // debe ser boolean en tu schema
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="color-dark-blue-marn font-bold">
                        OPERATIVO
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true);
                          }}
                        />
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
