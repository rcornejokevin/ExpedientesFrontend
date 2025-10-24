import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { ChangePassword as changePasswordRequest } from '@/models/Usuarios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

interface AddUsuarioI {
  open: boolean;
  setOpen: any;
}

const changePasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    confirmPassword: z
      .string({ required_error: 'Debe confirmar la contraseña' })
      .min(1, { message: 'Debe confirmar la contraseña' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePassword({ open, setOpen }: AddUsuarioI) {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const resetForm = () => {
    form.reset({
      password: '',
      confirmPassword: '',
    });
    form.clearErrors();
  };
  async function onSubmit(values: ChangePasswordFormValues) {
    if (!user?.jwt) {
      setAlert({
        type: 'error',
        message: 'No fue posible validar la sesión del usuario.',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await changePasswordRequest(user.jwt, {
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      if (response.code == '000') {
        setAlert({
          type: 'success',
          message: 'Contraseña actualizada correctamente.',
        });
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
    resetForm();
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambio de Contraseña</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full">
            <DialogBody>
              <Alerts />
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputAddon mode="icon">
                            <Key />
                          </InputAddon>
                          <Input
                            type="password"
                            placeholder="Ingrese la nueva contraseña"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputAddon mode="icon">
                            <Key />
                          </InputAddon>
                          <Input
                            type="password"
                            placeholder="Confirme la nueva contraseña"
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
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    Cargando...
                  </span>
                ) : (
                  'Actualizar contraseña'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
