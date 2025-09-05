import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList, ItemExpediente } from '@/models/Expediente';
import { GetItemFlujoList } from '@/models/Flujos';
import { Filter, FolderOpen, Plus, Search, TableIcon } from 'lucide-react';
import Alerts, { useFlash } from '@/lib/alerts';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import NuevoExpediente from './Expediente/NuevoExpediente';

const Dashboard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [flujo, setFlujo] = useState<any[]>([]);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetList(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data.map((item: any) => ({
          nombre: item.nombre,
          codigo: item.codigo,
          tipo: item.etapaId,
          estatus: item.estatus,
          fechaActualizacion: item.fechaActualizacion,
        }));
        setExpedientes(data);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    const flujo = async () => {
      const data = await GetItemFlujoList(user?.jwt ?? '');
      setFlujo(data);
    };
    fetchData();
    flujo();
  }, [open]);

  return (
    <>
      <NuevoExpediente open={open} setOpen={setOpen} edit={isEdit} />

      <div className="mx-5 mt-5">
        <Alerts />
        <div className="flex gap-4">
          <div className="basis-4/5">
            <div className="flex items-center justify-between">
              <div className="flex">
                <FolderOpen
                  fill="#18CED7"
                  color="#FBFBFD"
                  className="size-20"
                />
                <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
                  Gestión de Expedientes
                </Label>
              </div>
              <div className="flex">
                <div className="hidden items-center gap-6 md:flex">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-[#D7ED1E]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                      Tabla
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#D7ED1E]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                      Filtrar
                    </span>
                  </div>
                  <div className="relative w-60 md:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D7ED1E]" />
                    <input
                      type="search"
                      placeholder="BUSCAR"
                      className="h-9 w-full rounded-full border border-gray-200 pl-9 pr-4 text-[12px] font-bold uppercase tracking-wide placeholder:text-[#1E2851]/50 focus:outline-none focus:ring-0"
                      aria-label="Buscar"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex">
              <button
                className="mx-20 text-white px-4 py-2 rounded-4xl hover:opacity-60"
                style={{ backgroundColor: '#2DA6DC' }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Plus className="inline mr-2" />
                Crear nuevo expediente
              </button>
            </div>
            <div className="mt-6 px-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {expedientes.map((e, idx) => (
                  <div
                    key={`${e.codigo}-${idx}`}
                    className="rounded-xl bg-white shadow-sm border border-gray-200 p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70 bg-gray-100 rounded-3xl px-2 py-1">
                        {e.codigo}
                      </span>
                    </div>
                    <div className="mt-2 text-[#1E2851] font-extrabold leading-snug">
                      {e.nombre?.length > 56
                        ? e.nombre.slice(0, 56) + '…'
                        : e.nombre}
                    </div>

                    <div className="mt-3 space-y-1.5 text-[12px]">
                      <div>
                        <span className="text-[#2DA6DC] uppercase">
                          FECHA DE ÚLTIMA ETAPA:{' '}
                        </span>
                        <span className="text-[#1E2851]/80 font-semibold">
                          {e.fechaActualizacion
                            ? new Date(
                                e.fechaActualizacion,
                              ).toLocaleDateString()
                            : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#2DA6DC] uppercase">
                          TIPO DE PROCESO:{' '}
                        </span>
                        <span className="text-[#1E2851]/80 font-semibold">
                          {String(
                            flujo
                              .filter((item) => item.id == e.tipo)
                              .map((item) => item.nombre)
                              .at(0),
                          ) ?? '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#2DA6DC] uppercase">
                          ESTATUS:{' '}
                        </span>
                        <span className="text-[#1E2851]/80 font-semibold">
                          {e.estatus ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        type="button"
                        className="text-[#2DA6DC] font-extrabold text-[12px] uppercase hover:underline"
                      >
                        ABRIR EXPEDIENTE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="basis-1/5">
            <Card className="mt-10 p-3 rounded shadow-md">
              <Label
                className="text-lg font-bold "
                style={{ color: '#4A93CC' }}
              >
                Indicadores
              </Label>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
