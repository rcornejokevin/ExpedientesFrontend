import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListEtapa } from '@/models/Etapas';
import { GetList } from '@/models/Expediente';
import { GetList as GetListFlujo } from '@/models/Flujos';
import { GetList as GetListRemitente } from '@/models/Remitentes';
import { GetList as GetListSubEtapa } from '@/models/SubEtapas';
import { GetList as GetListUsuario } from '@/models/Usuarios';
import ReporteListadoPDF from '@/pdf/ReporteListadoPDF';
import { pdf } from '@react-pdf/renderer';
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
import { useLoading } from '@/providers/loading-provider';
import { Button } from '@/components/ui/button';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Detalle from './Detalle';
import Filtro from './Filtro';
import { newSchemaType } from './NewSchemaType';

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
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [asesoresOpts, setAsesoresOpts] = useState<
    { value: string; nombre: string }[]
  >([]);
  const [flujosOpts, setFlujosOpts] = useState<
    { value: string; nombre: string }[]
  >([]);
  const [etapasOpts, setEtapasOpts] = useState<
    {
      value: string;
      nombre: string;
      padre?: string;
    }[]
  >([]);
  const [subEtapasOpts, setSubEtapasOpts] = useState<
    {
      value: string;
      nombre: string;
      padre?: string;
    }[]
  >([]);
  const [remitentesOpts, setRemitentesOpts] = useState<
    { value: string; nombre: string }[]
  >([]);
  const getDateYmdHi = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hour}${minute}`;
  };

  const [filtro, setFiltro] = useState<newSchemaType>({
    limit: 100,
    fechaInicioIngreso: '',
    fechaFinIngreso: '',
    fechaInicioActualizacion: '',
    fechaFinActualizacion: '',
    asesorId: 0,
    flujoId: 0,
    etapaId: 0,
    subEtapaId: 0,
    estatus: '',
    asunto: '',
    remitenteId: 0,
  });
  const { user } = useAuth();
  const { setAlert } = useFlash();
  const { setLoading: setGlobalLoading } = useLoading();
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

  const handleExportPdf = async () => {
    setGlobalLoading(true);
    try {
      const rows = data.map((r) => ({
        numero: r.numero,
        titulo: r.titulo,
        ingreso: r.ingreso,
        proceso: r.proceso,
        estatus: r.estatus,
        etapa: r.etapa,
        modificacion: r.modificacion,
      }));
      const doc = (
        <ReporteListadoPDF
          titulo="Listado de Expedientes"
          rows={rows}
          count={rows.length}
          logoSrc={'/logos/marn_azul.png'}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${getDateYmdHi()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleExportXlsx = async () => {
    try {
      setGlobalLoading(true);
      const ExcelJSLib = (await import('exceljs')).default;
      const wb = new ExcelJSLib.Workbook();
      const ws = wb.addWorksheet('Reporte', {
        properties: { defaultRowHeight: 18 },
        pageSetup: { fitToPage: true },
      });

      // Encabezado con título y total
      ws.mergeCells('A1', 'G1');
      ws.getCell('A1').value = 'Listado de Expedientes';
      ws.getCell('A1').font = {
        bold: true,
        size: 16,
        color: { argb: 'FF192854' },
      };

      ws.mergeCells('A2', 'F2');
      ws.getCell('A2').value = `Total de registros: ${data.length}`;
      ws.getCell('A2').font = { color: { argb: 'FF192854' } };
      const resp = await fetch('/logos/marn_azul.png');
      const blob = await resp.blob();
      const b64 = await new Promise<string>((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result).split(',')[1] || '');
        fr.readAsDataURL(blob);
      });
      const imgId = wb.addImage({
        base64: 'data:image/png;base64,' + b64,
        extension: 'png',
      });
      ws.addImage(imgId, 'G1:G3');

      // Espacio
      ws.addRow([]);

      // Cabecera de tabla con color 2DA6DC
      const header = [
        'NÚMERO',
        'TÍTULO',
        'INGRESO',
        'PROCESO',
        'ESTATUS',
        'ETAPA',
        'MODIFICACIÓN',
      ];
      const headerRow = ws.addRow(header);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF2DA6DC' },
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF7E8A9A' } },
          left: { style: 'thin', color: { argb: 'FF7E8A9A' } },
          bottom: { style: 'thin', color: { argb: 'FF7E8A9A' } },
          right: { style: 'thin', color: { argb: 'FF7E8A9A' } },
        };
      });

      // Datos
      for (const r of data) {
        ws.addRow([
          r.numero,
          r.titulo,
          r.ingreso,
          r.proceso,
          r.estatus,
          r.etapa,
          r.modificacion,
        ]);
      }

      const widths = [14, 40, 14, 18, 14, 18, 18];
      ws.columns.forEach(
        (col: any, i: number) => (col.width = widths[i] || 16),
      );
      ws.views = [{ state: 'frozen', ySplit: headerRow.number }];

      const buffer = await wb.xlsx.writeBuffer();
      const blobBuf = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blobBuf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${getDateYmdHi()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
    } finally {
      setGlobalLoading(false);
    }
  };
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
      const response = await GetList(user?.jwt ?? '', filtro);
      if (response.code === '000') {
        const mapped = response.data.map((item: any) => ({
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
        setExpedientes(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchData();
  }, [0]);

  // Cargar catálogos para selects de filtros
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [usuariosRes, flujosRes, etapasRes, subRes, remitentesRes] =
          await Promise.all([
            GetListUsuario(user?.jwt ?? ''),
            GetListFlujo(user?.jwt ?? ''),
            GetListEtapa(user?.jwt ?? ''),
            GetListSubEtapa(user?.jwt ?? ''),
            GetListRemitente(user?.jwt ?? ''),
          ]);
        if (usuariosRes.code === '000') {
          setAsesoresOpts(
            (usuariosRes.data || []).map((u: any) => ({
              value: String(u.id),
              nombre: u.username,
            })),
          );
        }
        if (flujosRes.code === '000') {
          setFlujosOpts(
            (flujosRes.data || []).map((f: any) => ({
              value: String(f.id),
              nombre: f.nombre,
            })),
          );
        }
        if (etapasRes.code === '000') {
          setEtapasOpts(
            (etapasRes.data || []).map((e: any) => ({
              value: String(e.id),
              nombre: e.nombre,
              padre: String(e.flujoId ?? ''),
            })),
          );
        }
        if (subRes.code === '000') {
          setSubEtapasOpts(
            (subRes.data || []).map((s: any) => ({
              value: String(s.id),
              nombre: s.nombre,
              padre: String(s.etapaId ?? ''),
            })),
          );
        }
        if (remitentesRes.code === '000') {
          setRemitentesOpts(
            (remitentesRes.data || []).map((r: any) => ({
              value: String(r.id),
              nombre: r.descripcion,
            })),
          );
        }
      } catch (e) {
        // no-op
      }
    };
    loadCatalogs();
  }, [user?.jwt]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetList(user?.jwt ?? '', filtro);
      if (response.code === '000') {
        const mapped = response.data.map((item: any) => ({
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
        setExpedientes(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchData();
  }, [filtro]);

  const setEditedExpediente = (editedElement: string) => {
    setGlobalLoading(true, 'Abriendo expediente...');
    setExpedienteSelected(editedElement);
    setOpen(true);
  };
  return (
    <>
      <Filtro
        setOpen={setOpenFilter}
        open={openFilter}
        setFiltro={setFiltro}
        filtro={filtro}
        asesores={asesoresOpts}
        flujos={flujosOpts}
        etapas={etapasOpts}
        subEtapas={subEtapasOpts}
        remitentes={remitentesOpts}
      />
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
                    <Button
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => {
                        setOpenFilter(!openFilter);
                      }}
                    >
                      <Filter className="h-4 w-4 text-[#D7ED1E]" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                        Filtrar
                      </span>
                    </Button>
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
                  <Button
                    style={{ backgroundColor: 'transparent' }}
                    onClick={() => {
                      handleExportPdf();
                    }}
                  >
                    <Download className="h-4 w-4 text-[#D7ED1E]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                      Exportar a PDF
                    </span>
                  </Button>
                  <Button
                    style={{ backgroundColor: 'transparent' }}
                    onClick={() => {
                      handleExportXlsx();
                    }}
                  >
                    <Download className="h-4 w-4 text-[#D7ED1E]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E2851]/70">
                      Exportar a Excel
                    </span>
                  </Button>
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
