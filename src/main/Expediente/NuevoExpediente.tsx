import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListCampo } from '@/models/Campos';
import { GetList as GetListEtapas } from '@/models/Etapas';
import { GetList as GetListFlujos } from '@/models/Flujos';
import { GetList as GetListSubEtapa } from '@/models/SubEtapas';
import { GetList as GetListUsuario } from '@/models/Usuarios';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileImage,
  LoaderCircleIcon,
  Network,
  SquarePenIcon,
} from 'lucide-react';
import { Text } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import Alerts, { useFlash } from '@/lib/alerts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePickerMarn from '@/components/datePicker';
import PdfUpload from '@/components/pdf-upload';
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
  const [schemaCfg, setSchemaCfg] = useState<ApiSchemaConfig | null>();
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
              flujoId: f.flujoId,
            }))),
        ];
        console.log(cfg);
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
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const def: Record<string, any> = {};
    for (const f of schemaCfg.fields) {
      def[f.nombre] = '';
    }
    def['CODIGO'] =
      `#${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    return def;
  }, [schemaCfg]);
  const form = useForm<Record<string, any>>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  async function onSubmit(values: Record<string, any>) {}
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
    const mapped = schemaCfg?.fields.filter(
      (item) => Number(item.flujoId) === Number(value),
    );
    setFilteredSchemaCfg(mapped ? { fields: mapped } : null);

    form.setValue('ESTATUS ACTUAL', valueEtapa, { shouldValidate: true });
    form.setValue('SUB-ETAPA ACTUAL', valueSubEtapa, { shouldValidate: true });
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
                <div className="flex overflow-y-auto max-h-130">
                  <div className="basis-1/2 space-y-5  mx-5">
                    <FormField
                      control={form.control}
                      defaultValue={defaultValues['CODIGO']}
                      name={'CODIGO'}
                      render={({ field }) => (
                        <FormItem
                          className="w-[60%]"
                          style={{
                            alignItems: 'cent',
                          }}
                        >
                          <FormControl>
                            <Input
                              className="rounded-3xl"
                              style={{
                                backgroundColor: '#D9EC6C',
                                textAlign: 'center',
                                fontWeight: 'bold',
                              }}
                              readOnly={true}
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={'NOMBRE DE EXPEDIENTE'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            NOMBRE DE EXPEDIENTE
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-3xl"
                              placeholder="Nombre del expediente..."
                              {...field}
                            />
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
                              <SelectTrigger className="rounded-3xl">
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
                            <Input
                              className="rounded-3xl"
                              readOnly={true}
                              placeholder=""
                              {...field}
                            />
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
                            ESTATUS ACTUAL
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-3xl"
                              readOnly={true}
                              placeholder=""
                              {...field}
                            />
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
                              <SelectTrigger className="rounded-3xl">
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
                    <div className="flex items-center gap-2 mb-4 ">
                      <FileImage
                        fill="#2DA6DC"
                        color="white"
                        className="size-7"
                      />
                      <Label className="flex items-center gap-2 font-bold text-md color-dark-blue-marn">
                        Miniatura del Expediente
                      </Label>
                    </div>
                    <PdfUpload
                      form={form}
                      name={'PDF_EXPEDIENTE'}
                      label={''}
                      height={260}
                    />
                    <div className="flex items-center gap-2 mb-4 ">
                      <Network color="#2DA6DC" className="size-7" />
                      <Label className="flex items-center gap-2 font-bold text-md color-dark-blue-marn">
                        Etapa del Expediente
                      </Label>
                    </div>
                    <FormField
                      control={form.control}
                      name={'ESTATUS ACTUAL'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            ETAPA ACTUAL
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-3xl"
                              readOnly={true}
                              placeholder=""
                              {...field}
                            />
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
                            <Input
                              className="rounded-3xl"
                              readOnly={true}
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DatePickerMarn
                      form={form}
                      name={'FECHA DE ÚLTIMA ETAPA'}
                      label={'FECHA DE ÚLTIMA ETAPA'}
                      readOnly={true}
                      defaultValue={new Date().toISOString()}
                      formatStr="d 'de' MMMM 'de' yyyy"
                    />
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
                        className="rounded-3xl"
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
