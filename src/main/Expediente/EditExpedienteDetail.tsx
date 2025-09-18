import { useEffect, useState } from 'react';
import { GetFile, GetListDetails } from '@/models/Expediente';
import { Check, X } from 'lucide-react';
import { useLoading } from '@/providers/loading-provider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface iEditExpedienteDetail {
  expediente: any;
  user: any;
  setAlert: any;
}
const EditExpedienteDetail = ({
  expediente,
  user,
  setAlert,
}: iEditExpedienteDetail) => {
  const [details, setDetails] = useState([]);
  const { setLoading } = useLoading();
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
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const dataDetail: any = await GetListDetails(
          user?.jwt ?? '',
          Number.parseInt(expediente.id),
        );
        if (dataDetail.code === '000') {
          const mapped: any = dataDetail.data.map((f: any) => ({
            etapa: f.etapa,
            subEtapa: f.subEtapa,
            fechaEtapa: f.fecha,
            cargaImagen:
              f.nombreArchivo != '' && f.nombreArchivo != null ? true : false,
            estatus: f.estatus,
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
            <div className="flex">
              <div className="flex-col space-y-5">
                <Label
                  className="color-dark-blue-marn flex"
                  style={{ fontSize: 18, fontWeight: 'bolder' }}
                >
                  {expediente.nombre}
                </Label>
                <div className="flex space-x-2">
                  <Label style={{ color: '#539ACF' }}>FECHA DE INGRESO: </Label>
                  <Label>
                    {new Date(expediente.fechaIngreso).toLocaleDateString(
                      'es-ES',
                    )}
                  </Label>
                </div>
                <div className="flex space-x-2">
                  <Label style={{ color: '#539ACF' }}>TIPO DE PROCESO: </Label>
                  <Label>{expediente.flujo}</Label>
                </div>
                <div className="flex space-x-2">
                  <Label style={{ color: '#539ACF' }}>ESTATUS ACTUAL: </Label>
                  <Label>{expediente.estatus}</Label>
                </div>
                <div className="flex space-x-2">
                  <Label style={{ color: '#539ACF' }}>ASESOR ASIGNADO: </Label>
                  <Label>{expediente.asesor}</Label>
                </div>
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
                    ETAPAS
                  </TableHead>
                  <TableHead
                    className="text-white font-bold text-center"
                    align="center"
                  >
                    SUB ETAPAS
                  </TableHead>
                  <TableHead className="text-white font-bold text-center">
                    FECHA DE ETAPA
                  </TableHead>
                  <TableHead className="text-white font-bold text-center">
                    CARGA DE IMAGEN
                  </TableHead>
                  <TableHead className="text-white font-bold text-center">
                    ESTATUS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details?.map((detail: any, i) => (
                  <TableRow key={`detail_${i}`}>
                    <TableCell>{detail.etapa}</TableCell>
                    <TableCell>
                      {detail.subEtapa != ''
                        ? detail.subEtapa
                        : '[SIN SUB-ETAPA]'}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(detail.fechaEtapa).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell align="center">
                      {detail.cargaImagen ? (
                        <Badge
                          style={{ backgroundColor: '#C8E42B' }}
                          className="rounded-3xl"
                        >
                          <Check color="white" />
                        </Badge>
                      ) : (
                        <></>
                      )}
                    </TableCell>
                    <TableCell>{detail.estatus}</TableCell>
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
export default EditExpedienteDetail;
