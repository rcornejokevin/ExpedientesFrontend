import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListCampo } from '@/models/Campos';
import { GetList as GetListEtapas, ItemEtapa } from '@/models/Etapas';
import { GetList as GetListFlujos, ItemFlujo } from '@/models/Flujos';
import {
  Delete as DeleteSubEtapa,
  Edit as EditSubEtapa,
  GetList as GetListSubEtapa,
  ItemSubEtapa,
  New as NewSubEtapa,
  Orden as OrdenSubEtapa,
} from '@/models/SubEtapas';
import {
  Edit as EditUsuario,
  GetList as GetListUsuario,
  New as NewUsuario,
  Usuario,
} from '@/models/Usuarios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, LoaderCircleIcon, LucideUser, SquarePenIcon } from 'lucide-react';
import { Text } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import Alerts, { useFlash } from '@/lib/alerts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
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
import datePicker from '@/components/datePicker';
import DatePickerMarn from '@/components/datePicker';
import { ApiSchemaConfig, getNewSchema } from './NewSchemaType';

interface AddUsuarioI {
  open: boolean;
  setOpen: any;
  edit: boolean;
}
interface ItemSelect {
  nombre: string;
  value: string;
  padre?: string;
  orden?: number;
}
export default function NuevoExpediente({ open, setOpen, edit }: AddUsuarioI) {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const [schemaCfg, setSchemaCfg] = useState<ApiSchemaConfig | null>(null);
  const [filteredSchemaCfg, setFilteredSchemaCfg] =
    useState<ApiSchemaConfig | null>(null);
  const [flujo, setFlujo] = useState<ItemSelect[]>();
  const [etapa, setEtapa] = useState<ItemSelect[]>();
  const [subEtapa, setSubEtapa] = useState<ItemSelect[]>();
  const [asesor, setAsesor] = useState<ItemSelect[]>();
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetListCampo(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        let cfg: ApiSchemaConfig = { fields: [] };
        cfg.fields = [
          ...(await data
            .sort((a: any, b: any) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((f: any) => ({
              nombre: f.nombre,
              tipo: f.tipo,
              requerido: f.requerido,
              etapaId: f.etapaId,
              etapaDetalleId: f.etapaDetalleId,
            }))),
        ];
        setSchemaCfg(cfg);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    const fetchDataFlujo = async () => {
      const response = await GetListFlujos(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data.map((f: any) => ({
          value: String(f.id),
          nombre: f.nombre,
        }));
        setFlujo(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    const fetchDataSubEtapa = async () => {
      const response = await GetListSubEtapa(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data
          .sort((a: any, b: any) => (a.orden ?? 0) - (b.orden ?? 0))
          .map((f: any) => ({
            value: String(f.id),
            nombre: f.nombre,
            padre: String(f.etapaId ?? ''),
          }));
        setSubEtapa(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    const fetchDataEtapa = async () => {
      const response = await GetListEtapas(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data
          .sort((a: any, b: any) => (a.orden ?? 0) - (b.orden ?? 0))
          .map((f: any) => ({
            value: String(f.id),
            nombre: f.nombre,
            padre: f.flujoId,
          }));
        setEtapa(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    const fetchDataUsuario = async () => {
      const response = await GetListUsuario(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data.map((f: any) => ({
          value: String(f.id),
          nombre: f.username,
        }));
        setAsesor(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchData();
    fetchDataFlujo();
    fetchDataUsuario();
    fetchDataSubEtapa();
    fetchDataEtapa();
  }, [user?.jwt]);

  const schema = schemaCfg ? getNewSchema(schemaCfg) : null;

  const defaultValues = useMemo(() => {
    if (!schemaCfg) return {};
    const def: Record<string, any> = {};
    for (const f of schemaCfg.fields) {
      def[f.nombre] = '';
    }
    return def;
  }, [schemaCfg]);

  const form = useForm<Record<string, any>>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const resetForm = () => {
    form.reset({
      username: '',
      perfil: '',
    });
    form.clearErrors();
  };
  async function onSubmit(values: Record<string, any>) {
    setLoading(true);
    try {
      let response: any = null;
      if (edit == false) {
        const newUser: Usuario = {
          username: values.username,
          perfil: values.perfil,
        };
        response = await NewUsuario(user?.jwt ?? '', newUser);
      } else if (usuario != undefined) {
        const itemEditted: Usuario = usuario;
        itemEditted.username = values.username;
        itemEditted.perfil = values.perfil;
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
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: `${error}` });
    } finally {
      setLoading(false);
    }
  }
  function changeFunction(value: any) {
    const firstEtapa = etapa?.filter((item: ItemSelect) => item.padre == value);
    let valueEtapa = '';
    let valueSubEtapa = '';
    let idEtapa = 0;
    let idSubEtapa = 0;
    if (firstEtapa !== undefined && firstEtapa.length > 0) {
      valueEtapa = firstEtapa[0].nombre;
      idEtapa = Number.parseInt(firstEtapa[0].value);
      const firstSubEtapa = subEtapa?.filter(
        (item: ItemSelect) => item.padre == firstEtapa[0].value,
      );
      if (firstSubEtapa !== undefined && firstSubEtapa.length > 0) {
        valueSubEtapa = firstSubEtapa[0].nombre;
        idSubEtapa = Number.parseInt(firstSubEtapa[0].value);
      } else {
        valueSubEtapa = '[SIN PRIMERA SUB-ETAPA]';
      }
    } else {
      valueEtapa = '[SIN PRIMERA ETAPA]';
    }
    if (idSubEtapa) {
      const mapped = schemaCfg?.fields.filter((item) => {
        return Number(item.etapaDetalleId) === idSubEtapa;
      });
      setFilteredSchemaCfg(mapped ? { fields: mapped } : null);
    }
    if (!idSubEtapa) {
      const mapped = schemaCfg?.fields.filter((item) => {
        return Number(item.etapaId) === idEtapa;
      });
      setFilteredSchemaCfg(mapped ? { fields: mapped } : null);
    }

    form.reset({
      'ESTATUS ACTUAL': valueEtapa,
      'SUB-ETAPA ACTUAL': valueSubEtapa,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex w-full max-w-6xl"
        style={{ backgroundColor: '#E2E8EB' }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <SquarePenIcon
                size={40}
                className="mr-5 font-bold color-blue-marn"
              />
              <Text className="text-xl font-bold color-dark-blue-marn">
                Ingreso de Expedientes
              </Text>
            </div>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <Alerts />
              <Button
                type="button"
                className="w-30 shadow-none font-bold"
                variant="outline"
                size="lg"
                style={{
                  marginLeft: '-25px',
                  marginBottom: '-5px',
                  borderColor: 'transparent',
                }}
              >
                GENERAL
              </Button>
              <div
                style={{
                  backgroundColor: 'white',
                  marginLeft: '-25px',
                  marginRight: '-25px',
                  padding: '30px',
                  marginBottom: '-25px',
                }}
              >
                <div className="flex">
                  <div className="basis-1/2 space-y-5  mx-5">
                    <FormField
                      control={form.control}
                      name={'NOMBRE DE EXPEDIENTE'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            NOMBRE DE EXPEDIENTE
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DatePickerMarn
                      form={form}
                      name={'FECHA DE INGRESO'}
                      label={'FECHA DE INGRESO'}
                    />

                    <FormField
                      control={form.control}
                      name={'TIPO DE PROCESO'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            TIPO DE PROCESO
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                changeFunction(val);
                              }}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un Flujo" />
                              </SelectTrigger>
                              <SelectContent>
                                {flujo?.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={String(item.value)}
                                  >
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
                    <FormField
                      control={form.control}
                      name={'ESTATUS ACTUAL'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            ESTATUS ACTUAL
                          </FormLabel>
                          <FormControl>
                            <Input readOnly={true} placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={'SUB-ETAPA ACTUAL'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            SUB-ETAPA ACTUAL
                          </FormLabel>
                          <FormControl>
                            <Input readOnly={true} placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={'ASESOR ASIGNADO'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            ASESOR ASIGNADO
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                              }}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un Asesor" />
                              </SelectTrigger>
                              <SelectContent>
                                {asesor?.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={String(item.value)}
                                  >
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
                  </div>
                  <div className="basis-1/2 mx-5 space-y-5">
                    {filteredSchemaCfg?.fields.map((f) => (
                      <>
                        {f.tipo == 'Fecha' ? (
                          <DatePickerMarn
                            form={form}
                            name={f.nombre}
                            label={f.nombre}
                          />
                        ) : (
                          <FormField
                            key={f.nombre}
                            control={form.control}
                            name={f.nombre}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="color-dark-blue-marn font-bold">
                                  {f.nombre}
                                </FormLabel>
                                <FormControl>
                                  <>
                                    {f.tipo == 'Texto' ? (
                                      <Input placeholder="" {...field} />
                                    ) : null}
                                  </>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    ))}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        style={{ backgroundColor: '#2DA6DC' }}
                      >
                        <Text className="text-white font-bold text-md">
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                              Cargando...
                            </span>
                          ) : (
                            'GUARDAR EXPEDIENTE'
                          )}
                        </Text>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBody>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
