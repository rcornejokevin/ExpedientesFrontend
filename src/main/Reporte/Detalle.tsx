import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetItemExpediente } from '@/models/Expediente';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent } from '@/components/ui/dialog';
import EditExpediente from '../Expediente/EditExpediente';

interface iDetalle {
  open: boolean;
  setOpen: any;
  idExpediente: string;
}
export default function Detalle({ open, setOpen, idExpediente }: iDetalle) {
  const [expediente, setExpediente] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [openEdited, setOpenEdited] = useState<boolean>(false);
  useEffect(() => {
    const load = async () => {
      if (!open) return;
      try {
        setLoading(true);
        const exp = await GetItemExpediente(
          user?.jwt ?? '',
          Number.parseInt(idExpediente),
        );
        setExpediente(exp);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idExpediente]);
  return (
    <>
      <EditExpediente
        open={openEdited}
        setOpen={setOpenEdited}
        idExpediente={idExpediente}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex w-full max-w-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <DialogBody>
            {loading || expediente === undefined ? (
              'Cargando…'
            ) : (
              <div className="flex gap-8 w-full">
                <div className="w-40 flex-shrink-0">
                  <div className="w-40 h-56 bg-white border rounded shadow-sm flex items-center justify-center overflow-hidden">
                    {expediente?.miniatura ? (
                      <img
                        src={`data:image/png;base64,${expediente.miniatura}`}
                        alt="Vista previa expediente"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        SIN DOCUMENTO
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#2F68FF] text-center mt-3">
                    {expediente?.cantidadDocumentos ?? 0} documentos cargados a
                    expediente
                  </div>
                </div>

                <div className="flex-1 relative">
                  <button
                    className="absolute right-0 top-0 flex items-center gap-2 text-[#2DA6DC] font-extrabold text-[12px] uppercase"
                    type="button"
                  >
                    EXPORTAR A PDF
                    <Download className="h-4 w-4" />
                  </button>

                  <div className="inline-block bg-[#CDEB73] text-[#1E2851] font-bold text-[12px] rounded-full px-3 py-1 mt-2">
                    #{expediente?.codigo ?? ''}
                  </div>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#1E2851] leading-tight break-words max-w-2xl">
                    {expediente?.nombre ?? ''}
                  </h2>

                  <div className="mt-4 space-y-1">
                    <div className="text-[14px]">
                      <span className="font-extrabold text-[#2F68FF]">
                        FECHA DE INGRESO:
                      </span>{' '}
                      <span className="text-[#1E2851]">
                        {expediente?.fechaIngreso ?? '-'}
                      </span>
                    </div>
                    <div className="text-[14px]">
                      <span className="font-extrabold text-[#2F68FF]">
                        TIPO DE PROCESO:
                      </span>{' '}
                      <span className="text-[#1E2851]">
                        {expediente?.flujo ?? '-'}
                      </span>
                    </div>
                    <div className="text-[14px]">
                      <span className="font-extrabold text-[#2F68FF]">
                        ESTATUS ACTUAL:
                      </span>{' '}
                      <span className="text-[#1E2851]">
                        {expediente?.estatus ?? '-'}
                      </span>
                    </div>
                    <div className="text-[14px]">
                      <span className="font-extrabold text-[#2F68FF]">
                        ASESOR ASIGNADO:
                      </span>{' '}
                      <span className="text-[#1E2851]">
                        {expediente?.asesor ?? '-'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      className="rounded-4xl bg-[#2DA6DC] hover:opacity-80 text-white font-extrabold px-6"
                      type="button"
                      onClick={() => setOpenEdited(true)}
                    >
                      EDITAR EXPEDIENTE
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
