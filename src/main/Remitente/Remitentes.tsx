import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Delete as DeleteRemitente,
  GetList as GetListRemitente,
  Remitente,
} from '@/models/Remitentes';
import { Pencil, Plus, Trash2, User } from 'lucide-react';
import Alerts, { useFlash } from '@/lib/alerts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ConfirmationDialog from '@/components/confirmationDialog';
import AddEditRemitente from './AddEditRemitente';

export default function Remitentes() {
  //Vars
  const { user } = useAuth();
  const { alert, setAlert } = useFlash();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [remitentes, setRemitentes] = useState<Remitente[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [remitente, setRemitente] = useState<Remitente>();

  //Functions
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetListRemitente(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: Remitente[] = data
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((f: any) => ({
            id: String(f.id),
            descripcion: f.descripcion,
          }));
        setRemitentes(mapped);
      }
    };
    fetchData();
  }, [alert]);
  const deleteItem = (item: Remitente) => {
    const fetchData = async () => {
      const responseFlujos = await DeleteRemitente(
        user?.jwt ?? '',
        item.id ?? 0,
      );
      if (responseFlujos.code == '000') {
        setAlert({
          type: 'success',
          message: 'Remitente eliminado correctamente.',
        });
      }
    };
    fetchData();
  };
  return (
    <>
      <div className="mx-5 my-5">
        <Alerts />
        <ConfirmationDialog
          show={openDialog}
          onOpenChange={setOpenDialog}
          action={() => {
            if (remitente !== undefined) {
              deleteItem(remitente);
            }
          }}
        />
        <AddEditRemitente
          open={open}
          setOpen={setOpen}
          edit={edit}
          remitente={remitente}
        />
        <div className="flex justify-between items-center my-5">
          <div className="flex items-center">
            <User color="#18CED7" className="size-20" />
            <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
              Remitentes
            </Label>
          </div>
          <div className="flex justify-end items-center">
            <button
              className="text-white px-4 py-2 rounded-4xl hover:opacity-60"
              style={{ backgroundColor: '#2DA6DC' }}
              onClick={() => {
                setEdit(false);
                setRemitente(undefined);
                setOpen(true);
              }}
            >
              <Plus className="inline mr-2" />
              Crear nuevo remitente
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-[#E2E8F0]">
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader className="" style={{ backgroundColor: '#2AA7DC' }}>
                <TableRow>
                  <TableHead className="text-white font-bold">#</TableHead>
                  <TableHead className="text-white font-bold">ID</TableHead>
                  <TableHead className="text-white font-bold">
                    DESCRIPCIÓN
                  </TableHead>
                  <TableHead className="text-white font-bold">ACCIÓN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remitentes?.map((remitente, i) => (
                  <TableRow
                    key={remitente.id}
                    style={{ backgroundColor: '#F6F9FB' }}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{remitente.id}</TableCell>
                    <TableCell>{remitente.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Button
                          aria-label="Editar"
                          className="rounded-md p-1.5 hover:bg-gray-100"
                          onClick={() => {
                            setEdit(true);
                            setRemitente(remitente);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          aria-label="Eliminar"
                          variant={'destructive'}
                          className="rounded-md p-1.5 hover:bg-gray-100"
                          onClick={() => {
                            setRemitente(remitente);
                            setOpenDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
