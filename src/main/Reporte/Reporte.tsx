import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList } from '@/models/Expediente';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Download, FileChartColumn, Filter, Search } from 'lucide-react';
import Alerts, { useFlash } from '@/lib/alerts';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Detalle from './Detalle';

interface IData {
  id: string;
  numero: string;
  titulo: string;
  ingreso: string;
  proceso: string;
  estatus: string;
  ultimaEtapa: string;
  modificacion: string;
  identifier: string;
  etapa: string;
}
const Reporte = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [expedienteSelected, setExpedienteSelected] = useState<any>();
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'numero', desc: true },
  ]);
  const data: IData[] = useMemo(() => {
    return (expedientes || []).map((item, i) => {
      return {
        id: item.id,
        identifier: item.id,
        numero: item.codigo ?? '',
        titulo: item.nombre ?? '',
        ingreso: item.fechaIngreso ?? '',
        estatus: item.estatus ?? '',
        etapa: item.etapa ?? '',
        modificacion: item.fechaActualizacion ? item.fechaActualizacion : '-',
        proceso: item.flujo ?? '',
      } as IData;
    });
  }, [expedientes]);
  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: 'numero',
        id: 'numero',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title="NÚMERO"
            column={column}
          />
        ),
        cell: (info) => (
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70 bg-gray-100 rounded-3xl px-2 py-1">
            {info.getValue() as string}
          </span>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'titulo',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title="TÍTULO DEL EXPEDIENTE"
            column={column}
          />
        ),
        cell: (info) => (
          <span className="font-bold color-dark-blue-marn">
            {info.getValue() as string}
          </span>
        ),
        size: 250,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'ingreso',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title="INGRESO"
            column={column}
          />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'proceso',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title="PROCESO"
            column={column}
          />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'estatus',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title="ESTATUS"
            column={column}
          />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'etapa',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title="ÚLTIMA ETAPA"
            column={column}
          />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'modificacion',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title="MODIFICACIÓN"
            column={column}
          />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 200,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'identifier',
        header: ({ column }) => (
          <DataGridColumnHeader
            className="text-white font-bold"
            title=""
            column={column}
          />
        ),
        cell: (info) => (
          <button
            className="text-white px-4 py-2 rounded-4xl hover:opacity-60"
            style={{ backgroundColor: '#2DA6DC' }}
            onClick={() => {
              setEditedExpediente(info.getValue() as string);
            }}
          >
            ABRIR
          </button>
        ),
        size: 100,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );
  const table = useReactTable({
    columns,
    data,
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetList(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data.map((item: any) => ({
          nombre: item.nombre,
          codigo: item.codigo,
          tipo: item.etapaId,
          estatus: item.estatus,
          fechaActualizacion: new Date(
            item.fechaActualizacion,
          ).toLocaleDateString('es-ES'),
          fechaIngreso: new Date(item.fechaIngreso).toLocaleDateString('es-ES'),
          id: item.id,
          flujoId: item.flujoId,
          flujo: item.flujo,
          etapa: item.etapa,
        }));
        setExpedientes(data);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchData();
  }, [0]);

  const setEditedExpediente = (editedElement: string) => {
    setExpedienteSelected(editedElement);
    setOpen(true);
  };
  return (
    <>
      <div className="mx-5 mt-5 min-h-screen flex flex-col">
        {expedienteSelected && (
          <Detalle
            key={expedienteSelected}
            open={open}
            setOpen={setOpen}
            idExpediente={expedienteSelected}
          />
        )}
        <Alerts />
        <div className="flex-1 min-h-0 flex gap-4">
          <div className="basis-5/5">
            <div className="flex items-center">
              <div className="flex mr-10">
                <FileChartColumn
                  fill="#FBFBFD"
                  color="#18CED7"
                  className="size-20"
                />
                <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
                  Reportes
                </Label>
              </div>
              <div className="flex">
                <div className="hidden items-center gap-6 md:flex">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#D7ED1E]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                      Filtrar
                    </span>
                  </div>
                  <div className="relative w-60 md:w-72 mx-5">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D7ED1E]" />
                    <input
                      type="search"
                      onChange={(e) =>
                        table
                          .getColumn('titulo')
                          ?.setFilterValue(e.target.value)
                      }
                      placeholder="BUSCAR"
                      className="h-9 w-full rounded-full border border-gray-200 pl-9 pr-4 text-[12px] font-bold uppercase tracking-wide placeholder:text-[#1E2851]/50 focus:outline-none focus:ring-0"
                      aria-label="Buscar"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-[#D7ED1E]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                      Exportar a PDF
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-[#D7ED1E]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                      Exportar a Excel
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 px-4 flex-1 min-h-0 flex flex-col">
              <DataGrid
                table={table}
                recordCount={data?.length || 0}
                tableLayout={{ headerBackground: false, stripped: true }}
                tableClassNames={{ headerRow: 'bg-[#2DA6DC]' }}
              >
                <div className="w-full space-y-2.5">
                  <DataGridContainer className="bg-white">
                    <ScrollArea>
                      <DataGridTable />
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </DataGridContainer>
                  <DataGridPagination
                    info="{from} - {to} de {count}"
                    sizesLabel="Filas por página"
                  />
                </div>
              </DataGrid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Reporte;
