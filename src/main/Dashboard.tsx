import { useState } from 'react';
import { Filter, FolderOpen, Plus, Search, TableIcon } from 'lucide-react';
import Alerts, { useFlash } from '@/lib/alerts';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import NuevoExpediente from './Expediente/NuevoExpediente';

const Dashboard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
