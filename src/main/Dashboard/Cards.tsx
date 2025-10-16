interface iCards {
  expedientes: any[];
  setEditedExpediente: (editedElement: string) => void;
}

const Cards = ({ expedientes, setEditedExpediente }: iCards) => {
  return (
    <div
      className="h-full min-h-0 overflow-y-auto pr-4"
      style={{ maxHeight: 'calc(100vh - 260px)' }}
    >
      <div className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              {e.nombre?.length > 56 ? e.nombre.slice(0, 56) + '…' : e.nombre}
            </div>
            <div className="mt-3 space-y-1.5 text-[12px]">
              <div>
                <span className="text-[#2DA6DC] uppercase">
                  FECHA DE INGRESO:{' '}
                </span>
                <span className="text-[#1E2851]/80 font-semibold">
                  {e.fechaIngreso
                    ? new Date(e.fechaIngreso).toLocaleDateString()
                    : '-'}
                </span>
              </div>
              <div>
                <span className="text-[#2DA6DC] uppercase">
                  TIPO DE PROCESO:{' '}
                </span>
                <span className="text-[#1E2851]/80 font-semibold">
                  {String(e.flujo) ?? '-'}
                </span>
              </div>
              <div>
                <span className="text-[#2DA6DC] uppercase">ESTATUS: </span>
                <span className="text-[#1E2851]/80 font-semibold">
                  {e.estatus ?? '-'}
                </span>
              </div>
              <div>
                <span className="text-[#2DA6DC] uppercase">
                  ÚLTIMA ETAPA:{' '}
                </span>
                <span className="text-[#1E2851]/80 font-semibold">
                  {e.etapa ?? '-'}
                </span>
              </div>
              <div>
                <span className="text-[#2DA6DC] uppercase">
                  FECHA DE ÚLTIMA ETAPA:{' '}
                </span>
                <span className="text-[#1E2851]/80 font-semibold">
                  {e.fechaActualizacion
                    ? new Date(e.fechaActualizacion).toLocaleDateString()
                    : '-'}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="text-[#2DA6DC] font-extrabold text-[12px] uppercase hover:underline"
                onClick={() => {
                  setEditedExpediente(e.id);
                }}
              >
                ABRIR EXPEDIENTE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
