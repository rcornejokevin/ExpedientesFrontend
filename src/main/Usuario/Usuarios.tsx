import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Delete as DeleteUsuario,
  GetList as GetListUsuario,
  Usuario,
} from '@/models/Usuarios';
import { Pencil, Plus, Trash2, User } from 'lucide-react';
import Alerts, { useFlash } from '@/lib/alerts';
import { Badge } from '@/components/ui/badge';
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
import AddEditUsuario from './AddEditUsuario';

export default function Usuarios() {
  //Vars
  const { user } = useAuth();
  const { alert, setAlert } = useFlash();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [users, setUsers] = useState<Usuario[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<Usuario>();

  //Functions
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetListUsuario(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: Usuario[] = data
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((f: any) => ({
            id: String(f.id),
            username: f.username,
            perfil: f.perfil,
          }));
        setUsers(mapped);
      }
    };
    fetchData();
  }, [alert]);
  const deleteItem = (item: Usuario) => {
    const fetchData = async () => {
      const responseFlujos = await DeleteUsuario(
        user?.jwt ?? '',
        Number.parseInt(item.id ?? ''),
      );
      if (responseFlujos.code == '000') {
        setAlert({
          type: 'success',
          message: 'Usuario eliminado correctamente.',
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
            if (usuario !== undefined) {
              deleteItem(usuario);
            }
          }}
        />
        <AddEditUsuario
          open={open}
          setOpen={setOpen}
          edit={edit}
          usuario={usuario}
        />
        <div className="flex justify-between items-center my-5">
          <div className="flex items-center">
            <User color="#18CED7" className="size-20" />
            <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
              Usuarios
            </Label>
          </div>
          <div className="flex justify-end items-center">
            <button
              className="text-white px-4 py-2 rounded-4xl hover:opacity-60"
              style={{ backgroundColor: '#2DA6DC' }}
              onClick={() => {
                setEdit(false);
                setUsuario(undefined);
                setOpen(true);
              }}
            >
              <Plus className="inline mr-2" />
              Crear nuevo usuario
            </button>
          </div>
        </div>

        <Table>
          <TableHeader className="" style={{ backgroundColor: '#2AA7DC' }}>
            <TableRow>
              <TableHead className="text-white font-bold">#</TableHead>
              <TableHead className="text-white font-bold">ID</TableHead>
              <TableHead className="text-white font-bold">USERNAME</TableHead>
              <TableHead className="text-white font-bold">PERFIL</TableHead>
              <TableHead className="text-white font-bold">ACCIÓN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user, i) => (
              <TableRow key={user.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.perfil}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Button
                      aria-label="Editar"
                      className="rounded-md p-1.5 hover:bg-gray-100"
                      onClick={() => {
                        setEdit(true);
                        setUsuario(user);
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
                        setUsuario(user);
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
    </>
  );
}
