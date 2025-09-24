import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListEtapas } from '@/models/Etapas';
import { GetItemExpediente } from '@/models/Expediente';
import { GetList as GetListSubEtapa } from '@/models/SubEtapas';
import { GetList as GetListUsuario } from '@/models/Usuarios';
import { SquarePenIcon } from 'lucide-react';
import { Text } from 'react-aria-components';
import Alerts, { useFlash } from '@/lib/alerts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditExpedienteDetail from './EditExpedienteDetail';
import EditExpedienteForm from './EditExpedienteForm';
import EditExpedienteNotes from './EditExpedienteNotes';

interface AddUsuarioI {
  open: boolean;
  setOpen: any;
  idExpediente: string;
  expedientes: any[];
}
interface ItemSelect {
  nombre: string;
  value: string;
  padre?: string;
  orden?: number;
  disabled?: boolean;
}
export default function EditExpediente({
  open,
  setOpen,
  idExpediente,
  expedientes,
}: AddUsuarioI) {
  const [expediente, setExpediente] = useState<any>();
  const [extraFields, setExtraFields] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const [etapa, setEtapa] = useState<ItemSelect[]>();
  const [subEtapa, setSubEtapa] = useState<ItemSelect[]>();
  const [asesor, setAsesor] = useState<ItemSelect[]>();
  const [estatus, setEstatus] = useState(1);
  useEffect(() => {
    setEstatus(1);
    const loadInformation = async () => {
      setLoading(true);
      setExpediente(undefined);
      try {
        const exp: any = await GetItemExpediente(
          user?.jwt ?? '',
          Number.parseInt(idExpediente),
        );
        setExtraFields([]);
        if (exp.campoValorJson != '')
          setExtraFields(JSON.parse(exp.campoValorJson));
        const [usuariosRes, subRes, etapasRes] = await Promise.all([
          GetListUsuario(user?.jwt ?? ''),
          GetListSubEtapa(user?.jwt ?? ''),
          GetListEtapas(user?.jwt ?? ''),
        ]);
        // Usuarios
        if (usuariosRes.code === '000') {
          const mapped: any = usuariosRes.data.map((f: any) => ({
            value: String(f.id),
            nombre: f.username,
          }));
          setAsesor(mapped);
        } else {
          setAlert({ type: 'error', message: usuariosRes.message });
        }

        if (subRes.code === '000') {
          const data = subRes.data;
          const subEtapaActual = data
            .filter((item: any) => item.id == exp.etapaDetalleId)
            .at(0);
          const mapped: any = data
            .sort((a: any, b: any) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((f: any) => ({
              value: String(f.id),
              nombre: f.nombre,
              padre: String(f.etapaId ?? ''),
              disabled:
                f.etapaId == exp.etapaId &&
                (subEtapaActual
                  ? (subEtapaActual.orden ?? 0) > (f.orden ?? 0)
                  : false),
            }));
          setSubEtapa(mapped);
        } else {
          setAlert({ type: 'error', message: subRes.message });
        }

        if (etapasRes.code === '000') {
          const data = etapasRes.data;
          const etapaActual = data
            .filter((item: any) => item.id == exp.etapaId)
            .at(0);
          const mapped: any = data
            .sort((a: any, b: any) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((f: any) => ({
              value: String(f.id),
              nombre: f.nombre,
              padre: f.flujoId,
              disabled: etapaActual
                ? (f.orden ?? 0) < (etapaActual.orden ?? 0)
                : false,
            }));
          setEtapa(mapped);
        } else {
          setAlert({ type: 'error', message: etapasRes.message });
        }
        setExpediente(exp);
      } catch (error) {
        setAlert({
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setLoading(false);
      }
    };
    loadInformation();
  }, [open, idExpediente]);

  if (expediente === undefined) return <></>;
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
                Edición de Expedientes
              </Text>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Alerts />
          <Button
            onClick={() => {
              setEstatus(1);
            }}
            type="button"
            className="w-30 shadow-none font-bold"
            variant="outline"
            size="lg"
            style={{
              marginLeft: '-25px',
              marginBottom: '-5px',
              borderColor: 'transparent',
              backgroundColor: estatus == 1 ? '' : '#E2E8EB',
            }}
          >
            GENERAL
          </Button>
          <Button
            onClick={() => {
              setEstatus(2);
            }}
            type="button"
            className="w-30 shadow-none font-bold"
            variant="outline"
            size="lg"
            style={{
              marginBottom: '-5px',
              borderColor: 'transparent',
              backgroundColor: estatus == 2 ? '' : '#E2E8EB',
            }}
          >
            HISTORIAL
          </Button>
          <Button
            onClick={() => {
              setEstatus(3);
            }}
            type="button"
            className="w-30 shadow-none font-bold"
            variant="outline"
            size="lg"
            style={{
              marginBottom: '-5px',
              borderColor: 'transparent',
              backgroundColor: estatus == 3 ? '' : '#E2E8EB',
            }}
          >
            NOTAS
          </Button>
          {estatus == 1 && (
            <EditExpedienteForm
              etapa={etapa}
              subEtapa={subEtapa}
              expediente={expediente}
              setAlert={setAlert}
              setOpen={setOpen}
              extraFields={extraFields}
              asesor={asesor}
              expedientes={expedientes}
            />
          )}
          {estatus == 2 && (
            <EditExpedienteDetail
              expediente={expediente}
              setAlert={setAlert}
              user={user}
            />
          )}
          {estatus == 3 && <EditExpedienteNotes expediente={expediente} />}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
