import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { AddNote, GetListNotes } from '@/models/Expediente';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useFlash } from '@/lib/alerts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { getNewNoteSchema, newSchemaType } from './NewNoteSchemaType';

interface iEditExpedienteDetail {
  expediente: any;
}
const EditExpedienteNotes = ({ expediente }: iEditExpedienteDetail) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewNoteSchema()),
    defaultValues: {
      nota: '',
    },
  });
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const resetForm = () => {
    form.reset({
      nota: '',
    });
    form.clearErrors();
  };
  async function onSubmit(values: newSchemaType) {
    setLoading(true);
    try {
      let response: any = null;
      const newRemitente = {
        nota: values.nota,
        expedienteId: expediente.id,
      };
      response = await AddNote(user?.jwt ?? '', newRemitente);
      if (response.code == '000') {
        setAlert({
          type: 'success',
          message: 'Nota creada correctamente.',
        });
        fetch();
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
  const fetch = async () => {
    try {
      setLoading(true);
      const dataDetail: any = await GetListNotes(
        user?.jwt ?? '',
        Number.parseInt(expediente.id),
      );
      if (dataDetail.code === '000') {
        const mapped: any = dataDetail.data.map((f: any) => ({
          fechaIngreso: f.fechaIngreso,
          asesor: f.asesor,
          nota: f.nota,
        }));
        setDetails(mapped);
      } else {
        setAlert({ type: 'error', message: dataDetail.message });
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
  useEffect(() => {
    fetch();
  }, [0]);
  return (
    <>
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
          <div className="basis-1/3 space-y-5  mx-2">
            <Badge style={{ backgroundColor: '#D9EC6C' }} className="text-bold">
              {expediente.codigo}
            </Badge>
            <div className="flex flex-col gap-5">
              <div className="space-y-5">
                <Label
                  className="color-dark-blue-marn flex"
                  style={{ fontSize: 18, fontWeight: 'bolder' }}
                >
                  {expediente.nombre}
                </Label>
              </div>
              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="block  w-full"
                  >
                    <FormField
                      control={form.control}
                      name="nota"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ingrese la nota"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-10">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                          Cargando...
                        </span>
                      ) : (
                        'Guardar'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          <div className="basis-2/3 space-y-5  mx-2">
            <Table>
              <TableHeader style={{ backgroundColor: '#2AA7DC' }}>
                <TableRow>
                  <TableHead
                    className="text-white font-bold text-center"
                    align="center"
                  >
                    FECHA
                  </TableHead>
                  <TableHead
                    className="text-white font-bold text-center"
                    align="center"
                  >
                    USUARIO
                  </TableHead>
                  <TableHead className="text-white font-bold text-center">
                    NOTA
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details?.map((detail: any, i) => (
                  <TableRow key={`detail_${i}`}>
                    <TableCell align="center">
                      {new Date(detail.fechaIngreso).toLocaleDateString(
                        'es-ES',
                      )}
                    </TableCell>
                    <TableCell>{detail.asesor}</TableCell>
                    <TableCell>{detail.nota}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditExpedienteNotes;
