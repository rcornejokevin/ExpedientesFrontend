import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListCampo } from '@/models/Campos';
import { ChangeStatus, Edit, GetFile } from '@/models/Expediente';
import { GetList as GetListRemitente } from '@/models/Remitentes';
import CaratulaPDF from '@/pdf/CaratulaPDF';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  FileImage,
  ListCheck,
  LoaderCircleIcon,
  Network,
  Printer,
} from 'lucide-react';
import { Text } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { useLoading } from '@/providers/loading-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import DatePickerMarn from '@/components/datePicker';
import PdfUpload from '@/components/pdf-upload';
import { printReactPdf } from '@/components/printPdf';
import { getEditSchema } from './EditSchemaType';
import { Field } from './Field';
import { ApiSchemaConfig } from './NewSchemaType';

interface iEditExpedienteForm {
  etapa: any[] | undefined;
  subEtapa: any[] | undefined;
  asesor: any[] | undefined;
  expediente: any;
  setAlert: any;
  setOpen: any;
  extraFields: any[];
  expedientes: any[];
}
interface ItemSelect {
  nombre: string;
  value: string;
  padre?: string;
  orden?: number;
  flujoRelacionado?: boolean;
}
const EditExpedienteForm = ({
  etapa,
  subEtapa,
  asesor,
  expediente,
  setAlert,
  setOpen,
  extraFields,
  expedientes,
}: iEditExpedienteForm) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { setLoading: setLoadingComplete } = useLoading();

  const [schemaCfg, setSchemaCfg] = useState<ApiSchemaConfig | null>();
  const schema = getEditSchema(schemaCfg ?? { fields: [] });
  const schemaRef = useRef<any>(schema);
  const [remitente, setRemitente] = useState<ItemSelect[]>();
  useEffect(() => {
    schemaRef.current = schema;
  }, [schema]);
  const resolver = useCallback(async (values: any, ctx: any, opts: any) => {
    if (!schemaRef.current) return { values, errors: {} };
    const fn = zodResolver(schemaRef.current);
    return fn(values, ctx, opts);
  }, []);
  const defaultValues = useMemo(() => {
    if (!schemaCfg) return {};
    const def: Record<string, any> = {};
    let jsonDatos: any[] = [];
    try {
      jsonDatos = JSON.parse(expediente.campoValorJson);
    } catch (e) {
      if (e instanceof Error) {
        setAlert('error', e.message);
      } else {
        setAlert('error', e);
      }
    }
    for (const f of schemaCfg.fields) {
      def[f.nombre] = f.tipo === 'Cheque' ? false : '';
      for (const field of jsonDatos) {
        if (field.label === f.label && f.editable) {
          switch (f.tipo) {
            case 'Fecha': {
              const rawValue = field.valor as string | undefined;
              if (rawValue) {
                const parsedDate = new Date(rawValue);
                def[f.nombre] = Number.isNaN(parsedDate.getTime())
                  ? ''
                  : rawValue;
              } else {
                def[f.nombre] = '';
              }
              break;
            }
            case 'Cheque':
              def[f.nombre] = field.valor == 'Si' ? true : false;
              break;
            default:
              def[f.nombre] = field.valor;
          }
        }
      }
    }
    def['asesor'] =
      expediente.asesorId != null ? String(expediente.asesorId) : '';
    def['subEtapa'] =
      expediente.etapaDetalleId != null
        ? String(expediente.etapaDetalleId)
        : '';
    def['etapa'] = expediente.etapaId != null ? String(expediente.etapaId) : '';
    def['aniadirArchivo'] = false;
    def['PDF_EXPEDIENTE'] = null;
    def['ASUNTO'] = expediente.asunto;
    def['REMITENTE'] =
      expediente.remitenteId != null ? String(expediente.remitenteId) : '';
    def['FECHA DE INGRESO'] = expediente.fechaIngreso;
    def['EXPEDIENTE RELACIONADO'] = expediente.expedienteRelacionadoId;
    def['NOMBRE DE EXPEDIENTE'] = expediente.nombre;
    return def;
  }, [schemaCfg, expediente]);
  const form = useForm<Record<string, any>>({
    resolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      form.reset(defaultValues);
    }
  }, [JSON.stringify(defaultValues)]);
  const formatStr = "d 'de' MMMM 'de' yyyy";
  const locale = es;
  async function onSubmit(values: Record<string, any>) {
    const oldEtapa = etapa
      ?.filter((item) => item.value == expediente.etapaId)
      .at(0);
    const newEtapa = etapa?.filter((item) => item.value == values.etapa).at(0);
    const oldEtapaDetalle = subEtapa
      ?.filter((item) => item.value == expediente.etapaDetalleId)
      .at(0);
    const newEtapaDetalle = subEtapa
      ?.filter((item) => item.value == values.subEtapa)
      .at(0);
    if (newEtapa == undefined || oldEtapa == undefined) {
      setAlert({
        type: 'error',
        message: 'Error en definición de etapas',
      });
      return;
    }
    if ((newEtapa.orden ?? 0) < (oldEtapa.orden ?? 0)) {
      setAlert({
        type: 'error',
        message: 'La nueva etapa debe ser mayor en orden que la anterior.',
      });
      return;
    }
    if (oldEtapaDetalle !== undefined && newEtapaDetalle !== undefined) {
      if ((newEtapaDetalle.orden ?? 0) < (oldEtapaDetalle.orden ?? 0)) {
        setAlert({
          type: 'error',
          message: 'La nueva etapa debe ser mayor en orden que la anterior.',
        });
        return;
      }
    }
    let jsonDatos = [];
    try {
      jsonDatos = JSON.parse(expediente.campoValorJson);
    } catch (e) {
      if (e instanceof Error) {
        setAlert('error', e.message);
      } else {
        setAlert('error', e);
      }
    }
    const camposAdicionales = jsonDatos.map((item: any) => {
      const getValor = function () {
        if (values[item.nombre] != undefined) {
          return item.tipoCampo == 'Cheque'
            ? values[item.nombre] == true
              ? 'Si'
              : 'No'
            : values[item.nombre];
        }
        return item.valor;
      };
      return {
        label: item.label,
        tipoCampo: item.tipoCampo,
        valor: getValor(),
        nombre: item.nombre,
      };
    });
    const obj = {
      id: expediente.id,
      etapaId: Number.parseInt(values.etapa),
      subEtapaId: Number.parseInt(values.subEtapa),
      adjuntarArchivo: values.aniadirArchivo,
      archivo: values.PDF_EXPEDIENTE,
      asesor: values.asesor,
      campos: JSON.stringify(camposAdicionales),
      asunto:
        user?.perfil == 'ADMINISTRADOR' ? values.ASUNTO : expediente.asunto,
      nombre:
        user?.perfil == 'ADMINISTRADOR'
          ? values['NOMBRE DE EXPEDIENTE']
          : expediente.nombre,
      remitenteId:
        user?.perfil == 'ADMINISTRADOR'
          ? Number.parseInt(values['REMITENTE'])
          : Number.parseInt(expediente.remitenteId),
      fechaIngreso:
        user?.perfil == 'ADMINISTRADOR'
          ? values['FECHA DE INGRESO']
          : expediente.fechaIngreso,
      expedienteRelacionadoId:
        user?.perfil == 'ADMINISTRADOR'
          ? Number.parseInt(values['EXPEDIENTE RELACIONADO'])
          : Number.parseInt(expediente.expedienteRelacionadoId),
    };
    setLoading(true);

    try {
      let response: any = null;
      response = await Edit(user?.jwt ?? '', obj);
      if (response.code == '000') {
        setAlert({
          type: 'success',
          message: 'Expediente editado correctamente.',
        });
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
  const etapaWatch = form.watch('etapa');
  const subEtapaFiltered = subEtapa?.filter(
    (item) =>
      item.padre ==
      (etapaWatch ||
        (expediente?.etapaId != null ? String(expediente.etapaId) : '')),
  );
  const downloadFile = async (id: number) => {
    setLoading(true);
    try {
      const response = await GetFile(user?.jwt ?? '', id);
      if (response.code == '000') {
        const data = response.data;
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.archivo}`;
        link.download = data.nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };
  const estatusExpediente = async (estatus: string) => {
    const response = await ChangeStatus(
      user?.jwt ?? '',
      expediente.id,
      estatus,
    );
    if (response.code === '000') {
      setAlert({
        type: 'success',
        message: `Expediente ${estatus} correctamente.`,
      });
      setOpen(false);
    } else {
      setAlert({ type: 'error', message: response.message });
    }
  };
  useEffect(() => {
    const fetchDataRemitente = async () => {
      const response = await GetListRemitente(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data.map((f: any) => ({
          value: String(f.id),
          nombre: f.descripcion,
        }));
        setRemitente(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    const fetchData = async () => {
      const response = await GetListCampo(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        let cfg: ApiSchemaConfig = { fields: [] };
        cfg.fields = [
          ...(await data
            .sort((a: any, b: any) => (a.orden ?? 0) - (b.orden ?? 0))
            .filter(
              (item: any) =>
                item.editable && item.flujoId == expediente.flujoId,
            )
            .map((f: any) => ({
              nombre: f.nombre,
              tipo: f.tipo,
              requerido: f.requerido,
              etapaId: f.etapaId,
              flujoId: f.flujoId,
              opciones: f.opciones,
              label: f.label,
              placeholder: f.placeholder,
              id: f.id,
              editable: f.editable,
            }))),
        ];
        setSchemaCfg(cfg);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    setLoading(true);
    setLoadingComplete(true);
    form.reset({
      etapa: expediente.etapaId != null ? String(expediente.etapaId) : '',
      subEtapa:
        expediente.etapaDetalleId != null
          ? String(expediente.etapaDetalleId)
          : '',
      asesor: expediente.asesorId != null ? String(expediente.asesorId) : '',
    });
    setLoadingComplete(false);
    setLoading(false);
    fetchData();
    fetchDataRemitente();
  }, [expediente]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          style={{
            backgroundColor: 'white',
            marginLeft: '-25px',
            marginRight: '-25px',
            padding: '30px',
            marginBottom: '-25px',
          }}
        >
          <div className="flex flex-col overflow-y-auto max-h-130">
            <div className="flex">
              <div className="basis-1/3 space-y-5  mx-5">
                <Input
                  className="rounded-3xl"
                  value={expediente.codigo}
                  style={{
                    backgroundColor: '#D9EC6C',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                  readOnly={true}
                />
                <FormField
                  control={form.control}
                  name={'NOMBRE DE EXPEDIENTE'}
                  disabled={user?.perfil !== 'ADMINISTRADOR'}
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
                <FormField
                  control={form.control}
                  name={'ASUNTO'}
                  disabled={user?.perfil !== 'ADMINISTRADOR'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="color-dark-blue-marn font-bold">
                        ASUNTO DE EXPEDIENTE
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-3xl"
                          placeholder="Asunto del expediente..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.perfil != 'ADMINISTRADOR' ? (
                  <FormItem>
                    <FormLabel className="color-dark-blue-marn font-bold">
                      REMITENTE
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={expediente.remitente}
                        className="rounded-3xl"
                        placeholder="Nombre del expediente..."
                        readOnly={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) : (
                  <FormField
                    control={form.control}
                    name={'REMITENTE'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="color-dark-blue-marn font-bold">
                          REMITENTE
                        </FormLabel>
                        <FormControl>
                          <Select
                            name={'REMITENTE'}
                            onValueChange={(val) => {
                              field.onChange(val);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="rounded-3xl">
                              <SelectValue placeholder="Seleccione un Remitente" />
                            </SelectTrigger>
                            <SelectContent>
                              {remitente?.map((item) => (
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
                )}
                {user?.perfil == 'ADMINISTRADOR' ? (
                  <DatePickerMarn
                    form={form}
                    name={'FECHA DE INGRESO'}
                    label={'FECHA DE INGRESO'}
                  />
                ) : (
                  <FormItem>
                    <FormLabel className="color-dark-blue-marn font-bold">
                      FECHA DE INGRESO
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={format(
                          new Date(expediente.fechaIngreso),
                          formatStr,
                          {
                            locale,
                          },
                        )}
                        className="rounded-3xl"
                        placeholder="Fecha de ingreso"
                        readOnly={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}

                <FormItem>
                  <FormLabel className="color-dark-blue-marn font-bold">
                    TIPO DE PROCESO
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={expediente.flujo}
                      className="rounded-3xl"
                      placeholder="Tipo de proceso"
                      readOnly={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel className="color-dark-blue-marn font-bold">
                    ESTATUS ACTUAL
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-3xl"
                      placeholder="Estatus Actual"
                      readOnly={true}
                      value={expediente.etapa}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {expediente.puedeRelacionarse != '' && (
                  <>
                    {user?.perfil == 'ADMINISTRADOR' ? (
                      <Field
                        expedientes={expedientes}
                        expediente={expediente}
                        form={form}
                      />
                    ) : (
                      <FormItem>
                        <FormLabel className="color-dark-blue-marn font-bold">
                          EXPEDIENTE RELACIONADO
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-3xl"
                            readOnly={true}
                            value={expediente.expedienteRelacionado}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  </>
                )}

                <FormItem>
                  <FormLabel className="color-dark-blue-marn font-bold">
                    ASESOR ASIGNADO
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-3xl"
                      placeholder="Asesor asignado"
                      readOnly={true}
                      value={expediente.asesor}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <div className="basis-1/3 mx-5 space-y-5">
                <div className="flex items-center gap-2 mb-4 ">
                  <FileImage fill="#2DA6DC" color="white" className="size-7" />
                  <Label className="flex items-center gap-2 font-bold text-md color-dark-blue-marn">
                    Miniatura del Expediente
                  </Label>
                </div>
                <div className="flex">
                  {expediente.minatura != '' && expediente.miniatura != null ? (
                    <div className="basis-1/2 flex items-center justify-center">
                      <img
                        alt={expediente.nombreArchivo}
                        onClick={() => {
                          downloadFile(Number.parseInt(expediente.id));
                        }}
                        style={{ height: 200, cursor: 'pointer' }}
                        src={`data:image/png;base64,${expediente.miniatura}`}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div
                    className={
                      expediente.miniatura != '' && expediente.miniatura != null
                        ? 'basis-1/2 '
                        : ''
                    }
                  >
                    {expediente.estatus == 'Abierto' && (
                      <PdfUpload
                        form={form}
                        name={'PDF_EXPEDIENTE'}
                        label={''}
                        height={200}
                      />
                    )}
                  </div>
                </div>
                {form.watch('PDF_EXPEDIENTE') != null &&
                expediente.miniatura != null ? (
                  <FormField
                    control={form.control}
                    name="aniadirArchivo" // debe ser boolean en tu schema
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="color-dark-blue-marn font-bold">
                          AÑADIR ARCHIVO AL DOCUMENTO
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
                ) : (
                  <></>
                )}
                <div className="flex items-center gap-2 mb-4 ">
                  <Network color="#2DA6DC" className="size-7" />
                  <Label className="flex items-center gap-2 font-bold text-md color-dark-blue-marn">
                    Etapa del Expediente
                  </Label>
                </div>
                <FormField
                  control={form.control}
                  name={'etapa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="color-dark-blue-marn font-bold">
                        ETAPA ACTUAL
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={
                            expediente.estatus != 'Abierto' ||
                            user?.perfil == 'RECEPCIÓN'
                          }
                          name={'etapa'}
                          onValueChange={(val) => {
                            field.onChange(val);
                            if (
                              subEtapa?.filter((item) => item.padre == val)
                                .length === 0
                            ) {
                              form.setValue('subEtapa', '', {
                                shouldDirty: true,
                              });
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="rounded-3xl">
                            <SelectValue placeholder="Seleccione un Etapa" />
                          </SelectTrigger>
                          <SelectContent>
                            {etapa
                              ?.filter(
                                (item) => item.padre === expediente.flujoId,
                              )
                              .map((item) => (
                                <SelectItem
                                  key={item.value}
                                  value={String(item.value)}
                                  disabled={item.disabled}
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
                  name={'subEtapa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="color-dark-blue-marn font-bold">
                        SUB-ETAPA ACTUAL
                      </FormLabel>
                      <FormControl>
                        {(subEtapaFiltered?.length ?? 0 > 0) ? (
                          <Select
                            disabled={
                              expediente.estatus != 'Abierto' ||
                              user?.perfil == 'RECEPCIÓN'
                            }
                            name={'subEtapa'}
                            onValueChange={(val) => {
                              field.onChange(val);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="rounded-3xl">
                              <SelectValue placeholder="Seleccione un SubEtapa" />
                            </SelectTrigger>
                            <SelectContent>
                              {subEtapaFiltered?.map((item) => (
                                <SelectItem
                                  key={item.value}
                                  value={String(item.value)}
                                  disabled={item.disabled}
                                >
                                  {item.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            className="rounded-3xl"
                            placeholder="[SIN SUB-ETAPA]"
                            {...field}
                            readOnly={true}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'asesor'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="color-dark-blue-marn font-bold">
                        ASESOR ACTUAL
                      </FormLabel>
                      <FormControl>
                        <Select
                          name={'asesor'}
                          disabled={
                            expediente.estatus != 'Abierto' ||
                            user?.perfil == 'ASESOR'
                          }
                          onValueChange={(val) => {
                            field.onChange(val);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="rounded-3xl">
                            <SelectValue placeholder="Seleccione un asesor" />
                          </SelectTrigger>
                          <SelectContent>
                            {asesor
                              ?.sort((a: any, b: any) =>
                                a.value.localeCompare(b.value),
                              )
                              ?.map((item) => (
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
                <DatePickerMarn
                  form={form}
                  name={'FECHA DE ÚLTIMA ETAPA'}
                  label={'FECHA DE ÚLTIMA ETAPA'}
                  readOnly={true}
                  defaultValue={new Date().toISOString()}
                  formatStr="d 'de' MMMM 'de' yyyy"
                />
              </div>
              <div className="basis-1/3 space-y-5  mx-5">
                <div className="flex items-center gap-2 mb-4 ">
                  <ListCheck fill="white" color="#2DA6DC" className="size-7" />
                  <Label className="flex items-center gap-2 font-bold text-md color-dark-blue-marn">
                    Información del Expediente
                  </Label>
                </div>
                {schemaCfg?.fields.map((f) => (
                  <div key={f.nombre}>
                    {f.tipo == 'Fecha' ? (
                      <DatePickerMarn
                        form={form}
                        name={f.nombre}
                        label={f.label}
                        defaultValue={defaultValues[f.nombre]}
                        requerido={f.requerido}
                      />
                    ) : (
                      <FormField
                        key={f.nombre}
                        control={form.control}
                        name={f.nombre}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="color-dark-blue-marn font-bold">
                              {f.label}
                              <Label style={{ color: 'red' }}>
                                {f.requerido ? '*' : ''}
                              </Label>
                            </FormLabel>
                            <FormControl>
                              {f.tipo === 'Texto' ? (
                                <Input placeholder={f.placeholder} {...field} />
                              ) : f.tipo === 'Numero' ? (
                                <Input
                                  placeholder={f.placeholder}
                                  type="number"
                                  {...field}
                                />
                              ) : f.tipo === 'Memo' ? (
                                <Textarea
                                  placeholder={f.placeholder}
                                  {...field}
                                />
                              ) : f.tipo === 'Opciones' ? (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  name={f.nombre}
                                  defaultValue={defaultValues[f.nombre]}
                                >
                                  <SelectTrigger className="rounded-3xl">
                                    <SelectValue placeholder={f.placeholder} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {f.opciones
                                      ?.split(',')
                                      .map((op) => op.trim())
                                      .sort((a, b) => a.localeCompare(b))
                                      .map((op) => (
                                        <SelectItem key={op} value={String(op)}>
                                          {op}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked === true);
                                  }}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                ))}
                {extraFields
                  ?.filter((item) => {
                    const jsonDatos = JSON.parse(expediente.campoValorJson);
                    const itemCampo = schemaCfg?.fields
                      .filter((i) => i.label == item.label)
                      .at(0);
                    const editable = itemCampo?.editable;
                    const jsonDatosFiltered = jsonDatos.filter(
                      (d: any) => d.label == item.label && editable,
                    );

                    return jsonDatosFiltered.length > 0 && itemCampo?.editable
                      ? false
                      : true;
                  })
                  .map((f: any) => (
                    <FormItem key={f.label}>
                      <FormLabel className="color-dark-blue-marn font-bold">
                        {f.label}
                      </FormLabel>
                      <FormControl>
                        {f.tipoCampo == 'Memo' ? (
                          <Textarea
                            className="rounded-3xl"
                            value={f.valor}
                            placeholder=""
                            readOnly={true}
                          />
                        ) : f.tipoCampo == 'Fecha' ? (
                          <Input
                            className="rounded-3xl"
                            value={new Date(
                              f.valor as string,
                            ).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                            placeholder=""
                            readOnly={true}
                          />
                        ) : (
                          <Input
                            className="rounded-3xl"
                            value={f.valor}
                            placeholder=""
                            readOnly={true}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex mt-10 w-full items-center justify-between">
            <div className="flex justify-start gap-2">
              {expediente.puedeCerrarse &&
              expediente.estatus == 'Abierto' &&
              user?.perfil != 'RECEPCIÓN' ? (
                <Button
                  className="rounded-3xl mr-3"
                  type="button"
                  style={{ backgroundColor: '#D9EC6C' }}
                  onClick={() => {
                    estatusExpediente('Cerrado');
                  }}
                >
                  <Text className="text-[#192854] font-bold text-md">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                        Cargando...
                      </span>
                    ) : (
                      'CERRAR EXPEDIENTE'
                    )}
                  </Text>
                </Button>
              ) : (
                <></>
              )}
              {expediente.estatus == 'Cerrado' &&
                expediente.puedeArchivarse &&
                user?.perfil != 'ASESOR' && (
                  <Button
                    className="rounded-3xl"
                    type="button"
                    style={{ backgroundColor: '#D9EC6C' }}
                    onClick={() => {
                      estatusExpediente('Archivado');
                    }}
                  >
                    <Text className="text-[#192854] font-bold text-md">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                          Cargando...
                        </span>
                      ) : (
                        'ARCHIVAR EXPEDIENTE'
                      )}
                    </Text>
                  </Button>
                )}
              {expediente.estatus == 'Cerrado' &&
                expediente.puedeDevolverseAlRemitente &&
                user?.perfil != 'ASESOR' && (
                  <Button
                    className="rounded-3xl"
                    type="button"
                    style={{ backgroundColor: '#D9EC6C' }}
                    onClick={() => {
                      estatusExpediente('Devuelto al Remitente');
                    }}
                  >
                    <Text className="text-[#192854] font-bold text-md">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                          Cargando...
                        </span>
                      ) : (
                        'DEVOLVER AL REMITENTE'
                      )}
                    </Text>
                  </Button>
                )}
              {expediente.estatus == 'Cerrado' &&
                expediente.puedeEnviarAJudicial &&
                user?.perfil != 'ASESOR' && (
                  <Button
                    className="rounded-3xl"
                    type="button"
                    style={{ backgroundColor: '#D9EC6C' }}
                    onClick={() => {
                      estatusExpediente('Enviado al Organismo Judicial');
                    }}
                  >
                    <Text className="text-[#192854] font-bold text-md">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                          Cargando...
                        </span>
                      ) : (
                        'ENVIAR AL ORGANISMO JUDICIAL'
                      )}
                    </Text>
                  </Button>
                )}
            </div>
            <div className="flex justify-end">
              <Button
                className="rounded-3xl mr-3"
                type="button"
                style={{ backgroundColor: 'white' }}
                onClick={async () => {
                  const doc = (
                    <CaratulaPDF
                      codigo={expediente.codigo}
                      nombreExpediente={expediente.nombre}
                      fechaIngreso={expediente.fechaIngreso}
                      tipoProceso={expediente.flujo}
                      logoSrc={'/logos/marn_azul.png'}
                    />
                  );
                  await printReactPdf(doc);
                }}
              >
                <Text className="text-[#192854] font-bold text-md">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                      Cargando...
                    </span>
                  ) : (
                    'IMPRIMIR CARÁTULA'
                  )}
                </Text>
                <Printer color="#D9EC6C" />
              </Button>
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
      </form>
    </Form>
  );
};
export default EditExpedienteForm;
