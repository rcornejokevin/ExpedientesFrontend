import { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Edit, GetFile } from '@/models/Expediente';
import CaratulaPDF from '@/pdf/CaratulaPDF';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileImage, LoaderCircleIcon, Network, Printer } from 'lucide-react';
import { Text } from 'react-aria-components';
import { useForm } from 'react-hook-form';
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
import DatePickerMarn from '@/components/datePicker';
import PdfUpload from '@/components/pdf-upload';
import { printReactPdf } from '@/components/printPdf';
import { editSchemaType, getEditSchema } from './EditSchemaType';

interface iEditExpedienteForm {
  etapa: any[] | undefined;
  subEtapa: any[] | undefined;
  asesor: any[] | undefined;
  expediente: any;
  setAlert: any;
  setOpen: any;
  extraFields: any[];
}
const EditExpedienteForm = ({
  etapa,
  subEtapa,
  asesor,
  expediente,
  setAlert,
  setOpen,
  extraFields,
}: iEditExpedienteForm) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<editSchemaType>({
    resolver: zodResolver(getEditSchema()),
    defaultValues: {
      etapa: expediente.etapaId != null ? String(expediente.etapaId) : '',
      subEtapa:
        expediente.etapaDetalleId != null
          ? String(expediente.etapaDetalleId)
          : '',
      asesor: expediente.asesorId != null ? String(expediente.asesorId) : '',
    },
  });
  const formatStr = "d 'de' MMMM 'de' yyyy";
  const locale = es;
  async function onSubmit(values: editSchemaType) {
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
    if (
      values.etapa == expediente.etapaId &&
      values.subEtapa ==
        (expediente.etapaDetalleId == null ? '' : expediente.etapaDetalleId)
    ) {
      setAlert({
        type: 'error',
        message: 'Sin cambios detectados',
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
    const obj = {
      id: expediente.id,
      etapaId: values.etapa,
      subEtapaId: values.subEtapa,
      adjuntarArchivo: values.aniadirArchivo,
      archivo: values.PDF_EXPEDIENTE,
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
  const subEtapaFiltered = subEtapa?.filter(
    (item) => item.padre == form.watch('etapa'),
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
      setAlert({ type: 'error', message: error });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {' '}
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
              <FormItem>
                <FormLabel className="color-dark-blue-marn font-bold">
                  NOMBRE DE EXPEDIENTE
                </FormLabel>
                <FormControl>
                  <Input
                    value={expediente.nombre}
                    className="rounded-3xl"
                    placeholder="Nombre del expediente..."
                    readOnly={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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

              {extraFields?.map((f: any) => (
                <FormItem key={f.label}>
                  <FormLabel className="color-dark-blue-marn font-bold">
                    {f.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-3xl"
                      value={f.valor}
                      placeholder=""
                      readOnly={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ))}
            </div>
            <div className="basis-1/2 mx-5 space-y-5">
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
                  <PdfUpload
                    form={form}
                    name={'PDF_EXPEDIENTE'}
                    label={''}
                    height={200}
                  />
                </div>
              </div>
              {form.watch('PDF_EXPEDIENTE') != null && (
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
                      {(subEtapaFiltered?.length ?? 0 > 0) ? (
                        <Select
                          name={'asesor'}
                          onValueChange={(val) => {
                            field.onChange(val);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="rounded-3xl">
                            <SelectValue placeholder="Seleccione un asesor" />
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
              <DatePickerMarn
                form={form}
                name={'FECHA DE ÚLTIMA ETAPA'}
                label={'FECHA DE ÚLTIMA ETAPA'}
                readOnly={true}
                defaultValue={new Date().toISOString()}
                formatStr="d 'de' MMMM 'de' yyyy"
              />
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
        </div>
      </form>
    </Form>
  );
};
export default EditExpedienteForm;
