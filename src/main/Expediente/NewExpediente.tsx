import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListCampo } from '@/models/Campos';
import { GetList as GetListEtapas } from '@/models/Etapas';
import { CampoConValor, ItemExpediente, New } from '@/models/Expediente';
import { GetList as GetListFlujos } from '@/models/Flujos';
import { GetList as GetListRemitente } from '@/models/Remitentes';
import { GetList as GetListSubEtapa } from '@/models/SubEtapas';
import { GetList as GetListUsuario } from '@/models/Usuarios';
import CaratulaPDF from '@/pdf/CaratulaPDF';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileImage,
  ListCheck,
  LoaderCircleIcon,
  Network,
  Printer,
  SquarePenIcon,
} from 'lucide-react';
import { Text } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import Alerts, { useFlash } from '@/lib/alerts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import DatePickerMarn from '@/components/datePicker';
import PdfUpload from '@/components/pdf-upload';
import { printReactPdf } from '@/components/printPdf';
import { Field } from './Field';
import { ApiSchemaConfig, getNewSchema } from './NewSchemaType';

interface iNewExpediente {
  open: boolean;
  setOpen: any;
  expedientes: any[];
}
interface ItemSelect {
  nombre: string;
  value: string;
  padre?: string;
  orden?: number;
  flujoRelacionado?: boolean;
}
export default function NewExpediente({
  open,
  setOpen,
  expedientes,
}: iNewExpediente) {
  const [loading, setLoading] = useState<boolean>(false);
  const [onPrint, setOnPrint] = useState<boolean>(false);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const [schemaCfg, setSchemaCfg] = useState<ApiSchemaConfig | null>();
  const [filteredSchemaCfg, setFilteredSchemaCfg] =
    useState<ApiSchemaConfig | null>(null);
  const [flujo, setFlujo] = useState<ItemSelect[]>();
  const [etapa, setEtapa] = useState<ItemSelect[]>();
  const [subEtapa, setSubEtapa] = useState<ItemSelect[]>();
  const [asesor, setAsesor] = useState<ItemSelect[]>();
  const [remitente, setRemitente] = useState<ItemSelect[]>();
  useEffect(() => {
    setOnPrint(false);
    form.reset({ 'TIPO DE PROCESO': '' });
    changeFunction('');
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
              opciones: f.opciones,
              label: f.label,
              placeholder: f.placeholder,
              id: f.id,
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
          flujoRelacionado: f.flujoAsociado,
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
        const mapped: any = data
          .map((f: any) => ({
            value: String(f.id),
            nombre: f.username,
            perfil: f.perfil,
          }))
          .filter((f: any) => f.perfil != 'IT')
          .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        setAsesor(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    const fetchDataRemitente = async () => {
      const response = await GetListRemitente(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: any = data
          .map((f: any) => ({
            value: String(f.id),
            nombre: f.descripcion,
          }))
          .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        setRemitente(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchData();
    fetchDataFlujo();
    fetchDataUsuario();
    fetchDataRemitente();
    fetchDataSubEtapa();
    fetchDataEtapa();
  }, [open]);

  const schema = getNewSchema(filteredSchemaCfg ?? { fields: [] });
  const schemaRef = useRef<any>(schema);
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
    for (const f of schemaCfg.fields) {
      def[f.nombre] = f.tipo == 'Cheque' ? false : '';
    }
    def['ASESOR ASIGNADO'] = '';
    def['FECHA DE INGRESO'] = '';
    def['NOMBRE DE EXPEDIENTE'] = '';
    def['TIPO DE PROCESO'] = '';
    def['ESTATUS ACTUAL'] = '';
    def['ASUNTO'] = '';
    def['REMITENTE'] = '';
    def['SUB-ETAPA ACTUAL'] = '';
    def['CODIGO'] = '[PENDIENTE]';
    def['FECHA DE ÚLTIMA ETAPA'] = new Date().toISOString();
    def['EXPEDIENTE RELACIONADO'] = '';
    def['PDF_EXPEDIENTE'] = undefined;
    return def;
  }, [schemaCfg]);
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
  async function onSubmit(values: Record<string, any>) {
    setLoading(true);
    let camposAdicionales: CampoConValor[] | undefined =
      filteredSchemaCfg?.fields.map((item) => ({
        label: item.label,
        tipoCampo: item.tipo,
        nombre: item.nombre,
        valor:
          item.tipo == 'Cheque'
            ? values[item.nombre] == true
              ? 'Si'
              : 'No'
            : values[item.nombre],
      }));
    try {
      let response: any = null;
      const newExpediente: ItemExpediente = {
        CODIGO: values['CODIGO'],
        'NOMBRE DE EXPEDIENTE': values['NOMBRE DE EXPEDIENTE'],
        'TIPO DE PROCESO': values['TIPO DE PROCESO'],
        'SUB-ETAPA ACTUAL': values['SUB-ETAPA ACTUAL'],
        'FECHA DE INGRESO': values['FECHA DE INGRESO'],
        'ASESOR ASIGNADO': values['ASESOR ASIGNADO'],
        REMITENTE: values['REMITENTE'],
        ASUNTO: values['ASUNTO'],
        'FECHA DE ÚLTIMA ETAPA': values['FECHA DE ÚLTIMA ETAPA'],
        PDF_EXPEDIENTE: values['PDF_EXPEDIENTE'],
        camposAdicionales: camposAdicionales,
        expedienteRelacionadoId: values['EXPEDIENTE RELACIONADO'],
      };
      response = await New(user?.jwt ?? '', newExpediente);
      if (response.code == '000') {
        setOnPrint(true);
        values['CODIGO'] = response.data.codigo;
        form.reset(values);
        setAlert({
          type: 'success',
          message: 'Expediente creado correctamente.',
        });
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
    const mapped = schemaCfg?.fields.filter(
      (item) => Number(item.flujoId) === Number(value),
    );
    const uniqueById = mapped
      ? Array.from(new Map(mapped.map((f) => [f.id, f])).values())
      : null;
    setFilteredSchemaCfg(uniqueById ? { fields: uniqueById } : null);

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
                className="mr-5 font-bold color-dark-blue-marn-bg"
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
                <div className="flex flex-col overflow-y-auto max-h-130">
                  <div className="flex">
                    <div className="basis-1/3 space-y-5  mx-5">
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
                                readOnly={onPrint}
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="color-dark-blue-marn font-bold">
                              ASUNTO DE EXPEDIENTE
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                readOnly={onPrint}
                                placeholder={'Asunto del expediente...'}
                                className="rounded-3xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                disabled={onPrint}
                                value={field.value}
                                defaultValue={field.value}
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
                      <DatePickerMarn
                        form={form}
                        name={'FECHA DE INGRESO'}
                        label={'FECHA DE INGRESO'}
                        readOnly={onPrint}
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
                                disabled={onPrint}
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
                                  {flujo
                                    ?.sort((a, b) =>
                                      a.nombre.localeCompare(b.nombre),
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
                      {flujo
                        ?.filter(
                          (item) => item.value == form.watch('TIPO DE PROCESO'),
                        )
                        .at(0)?.flujoRelacionado == true && (
                        <Field
                          disabled={onPrint}
                          form={form}
                          expedientes={expedientes}
                        />
                      )}

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
                                name={'ASESOR ASIGNADO'}
                                onValueChange={(val) => {
                                  field.onChange(val);
                                }}
                                value={field.value}
                                defaultValue={field.value}
                                disabled={onPrint}
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
                    <div className="basis-1/3 mx-5 space-y-5">
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
                        height={200}
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
                    </div>
                    <div className="basis-1/3 mx-5 space-y-5">
                      <div className="flex items-center gap-2 mb-4 ">
                        <ListCheck
                          fill="white"
                          color="#2DA6DC"
                          className="size-7"
                        />
                        <Label className="flex items-center gap-2 font-bold text-md color-dark-blue-marn">
                          Información del Expediente
                        </Label>
                      </div>

                      {filteredSchemaCfg?.fields.map((f) => (
                        <div key={f.id}>
                          {f.tipo == 'Fecha' ? (
                            <DatePickerMarn
                              form={form}
                              name={f.nombre}
                              label={f.label}
                              requerido={f.requerido}
                              readOnly={onPrint}
                            />
                          ) : (
                            <FormField
                              key={f.id}
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
                                      <Input
                                        className="rounded-3xl"
                                        placeholder={f.placeholder}
                                        {...field}
                                        readOnly={onPrint}
                                      />
                                    ) : f.tipo === 'Numero' ? (
                                      <Input
                                        placeholder={f.placeholder}
                                        type="number"
                                        readOnly={onPrint}
                                        {...field}
                                      />
                                    ) : f.tipo === 'Memo' ? (
                                      <Textarea
                                        placeholder={f.placeholder}
                                        readOnly={onPrint}
                                        {...field}
                                      />
                                    ) : f.tipo === 'Opciones' ? (
                                      <Select
                                        onValueChange={(val) => {
                                          field.onChange(val);
                                        }}
                                        disabled={onPrint}
                                        value={field.value}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="rounded-3xl">
                                          <SelectValue
                                            placeholder={f.placeholder}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {f.opciones
                                            ?.split(',')
                                            .map((op) => op.trim())
                                            .sort((a, b) => a.localeCompare(b))
                                            .map((op) => (
                                              <SelectItem key={op} value={op}>
                                                {op}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Checkbox
                                        checked={!!field.value}
                                        disabled={onPrint}
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
                    </div>
                  </div>
                </div>
                <div className="flex mt-10 w-full items-center justify-end">
                  {onPrint ? (
                    <Button
                      className="rounded-3xl mr-3"
                      type="button"
                      style={{ backgroundColor: 'white' }}
                      onClick={async () => {
                        const vals = form.getValues();
                        const remitenteNombre =
                          remitente?.find(
                            (item) => item.value === vals['REMITENTE'],
                          )?.nombre ?? '';
                        const asesorNombre =
                          asesor?.find(
                            (item) => item.value === vals['ASESOR ASIGNADO'],
                          )?.nombre ?? '';
                        const flujoNombre =
                          flujo
                            ?.filter(
                              (item) =>
                                item.value == vals['TIPO DE PROCESO'],
                            )
                            .map((item) => item.nombre)
                            .at(0) || '';
                        const doc = (
                          <CaratulaPDF
                            codigo={vals['CODIGO'] || ''}
                            identificadorExpediente={vals['CODIGO'] || ''}
                            numeroExpedienteUAI={vals['CODIGO'] || ''}
                            nombreExpediente={
                              vals['NOMBRE DE EXPEDIENTE'] || ''
                            }
                            fechaIngreso={vals['FECHA DE INGRESO'] || ''}
                            tipoProceso={flujoNombre}
                            asunto={vals['ASUNTO'] || ''}
                            remitente={remitenteNombre}
                            asesorAsignado={asesorNombre}
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
                  ) : (
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
                  )}
                </div>
              </div>
            </DialogBody>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
