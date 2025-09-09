import { useMemo, useState } from 'react';
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
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface iTable {
  expedientes: any[];
  setEditedExpediente: (editedElement: string) => void;
}
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
}

const Table = ({ expedientes, setEditedExpediente }: iTable) => {
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
        ultimaEtapa: '',
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
        accessorKey: 'ultimaEtapa',
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
  return (
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
  );
};
export default Table;
