import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { Input, InputGroup } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePickerMarn from '@/components/datePicker';
import { getNewSchema, newSchemaType } from './NewSchemaType';

interface iFiltro {
  open: boolean;
  setOpen: (open: boolean) => void;
  setFiltro: (values: newSchemaType) => void;
  filtro?: Partial<newSchemaType>;
  asesores: { value: string; nombre: string }[];
  flujos: { value: string; nombre: string }[];
  etapas: { value: string; nombre: string; padre?: string }[];
  subEtapas: { value: string; nombre: string; padre?: string }[];
  remitentes: { value: string; nombre: string }[];
}

const Filtro = ({
  open,
  setOpen,
  setFiltro,
  filtro,
  asesores,
  flujos,
  etapas,
  subEtapas,
  remitentes,
}: iFiltro) => {
  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo<newSchemaType>(
    () => ({
      limit: 100,
      fechaInicioIngreso: '',
      fechaFinIngreso: '',
      fechaInicioActualizacion: '',
      fechaFinActualizacion: '',
      asesorId: 0,
      flujoId: 0,
      etapaId: 0,
      subEtapaId: 0,
      estatus: '',
      asunto: '',
      remitenteId: 0,
      ...(filtro as any),
    }),
    [filtro],
  );

  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewSchema()) as any,
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      form.clearErrors();
    }
  }, [open, defaultValues]);

  const onSubmit = async (values: newSchemaType) => {
    setLoading(true);
    try {
      setFiltro(values);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    form.reset({
      limit: 100,
      fechaInicioIngreso: '',
      fechaFinIngreso: '',
      fechaInicioActualizacion: '',
      fechaFinActualizacion: '',
      asesorId: 0,
      flujoId: 0,
      etapaId: 0,
      subEtapaId: 0,
      estatus: '',
      asunto: '',
      remitenteId: 0,
    });
    form.clearErrors();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Filtrar expedientes</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="block w-full"
          >
            <DialogBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Estatus */}
                <FormField
                  control={form.control}
                  name="estatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estatus</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) =>
                            field.onChange(val === 'ALL' ? '' : val)
                          }
                          value={field.value ?? ''}
                        >
                          <SelectTrigger className="rounded-3xl">
                            <SelectValue placeholder="TODOS" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">TODOS</SelectItem>
                            <SelectItem value="Abierto">Abierto</SelectItem>
                            <SelectItem value="Cerrado">Cerrado</SelectItem>
                            <SelectItem value="Archivado">Archivado</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Límite</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <Input placeholder="SIN LIMITE" {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Asesor */}
                <FormField
                  control={form.control}
                  name="asesorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asesor</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) =>
                            field.onChange(val === '' ? 0 : Number(val))
                          }
                          value={String(field.value ?? 0)}
                        >
                          <SelectTrigger className="rounded-3xl">
                            <SelectValue placeholder="Seleccione asesor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">TODOS</SelectItem>
                            {asesores.map((a) => (
                              <SelectItem key={a.value} value={a.value}>
                                {a.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Flujo */}
                <FormField
                  control={form.control}
                  name="flujoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flujo</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val === '' ? 0 : Number(val));
                            form.setValue('etapaId', 0);
                            form.setValue('subEtapaId', 0);
                          }}
                          value={String(field.value ?? 0)}
                        >
                          <SelectTrigger className="rounded-3xl">
                            <SelectValue placeholder="Seleccione flujo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">TODOS</SelectItem>
                            {flujos.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Etapa (dependiente de Flujo) */}
                <FormField
                  control={form.control}
                  name="etapaId"
                  render={({ field }) => {
                    const etapasFiltradas = form.watch('flujoId')
                      ? etapas.filter(
                          (e) =>
                            String(e.padre ?? '') ===
                            String(form.watch('flujoId') || ''),
                        )
                      : etapas;
                    return (
                      <FormItem>
                        <FormLabel>Etapa</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val === '' ? 0 : Number(val));
                              form.setValue('subEtapaId', 0);
                            }}
                            value={String(field.value ?? 0)}
                          >
                            <SelectTrigger className="rounded-3xl">
                              <SelectValue placeholder="Seleccione etapa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">TODOS</SelectItem>
                              {etapasFiltradas.map((e) => (
                                <SelectItem key={e.value} value={e.value}>
                                  {e.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Sub-Etapa (dependiente de Etapa) */}
                <FormField
                  control={form.control}
                  name="subEtapaId"
                  render={({ field }) => {
                    const subFiltradas = form.watch('etapaId')
                      ? subEtapas.filter(
                          (s) =>
                            String(s.padre ?? '') ===
                            String(form.watch('etapaId') || ''),
                        )
                      : subEtapas;
                    return (
                      <FormItem>
                        <FormLabel>Sub-Etapa</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) =>
                              field.onChange(val === '' ? 0 : Number(val))
                            }
                            value={String(field.value ?? 0)}
                          >
                            <SelectTrigger className="rounded-3xl">
                              <SelectValue placeholder="Seleccione sub-etapa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">TODOS</SelectItem>
                              {subFiltradas.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="remitenteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remitente</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) =>
                            field.onChange(val === '' ? 0 : Number(val))
                          }
                          value={String(field.value ?? 0)}
                        >
                          <SelectTrigger className="rounded-3xl">
                            <SelectValue placeholder="Seleccione remitente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">TODOS</SelectItem>
                            {remitentes.map((r) => (
                              <SelectItem key={r.value} value={r.value}>
                                {r.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Asunto */}

                <FormField
                  control={form.control}
                  name="asunto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asunto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Texto a buscar en asunto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DatePickerMarn
                  form={form}
                  name={'fechaInicioIngreso'}
                  label={'Fecha inicio de ingreso'}
                  defaultValue={''}
                />
                <DatePickerMarn
                  form={form}
                  name={'fechaFinIngreso'}
                  label={'Fecha fin de ingreso'}
                  defaultValue={''}
                />
                <DatePickerMarn
                  form={form}
                  name={'fechaInicioActualizacion'}
                  label={'Fecha inicio de actualización'}
                  defaultValue={''}
                />
                <DatePickerMarn
                  form={form}
                  name={'fechaFinActualizacion'}
                  label={'Fecha fin de actualización'}
                  defaultValue={''}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetAll}>
                Limpiar
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cerrar
                </Button>
              </DialogClose>
              <Button type="submit">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    Aplicando...
                  </span>
                ) : (
                  'Aplicar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default Filtro;
