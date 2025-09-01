import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Delete as DeleteFlujo,
  Edit as EditFlujo,
  GetList as GetListFlujos,
  ItemFlujo,
  New as NewFlujo,
} from '@/models/Flujos';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoaderCircleIcon,
  Network,
  Pencil,
  Plus,
  PlusIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import Alerts, { useFlash } from '@/lib/alerts';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Cards from '@/components/Cards';
import ConfirmationDialog from '@/components/confirmationDialog';
import { getNewSchema, newSchemaType } from './NewSchemaType';

export default function Flujos() {
  //Vars
  const { user } = useAuth();
  const initialItems: ItemFlujo[] = [];
  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewSchema()),
    defaultValues: {
      nombre: '',
      ayuda: '',
    },
  });
  const [items, setItems] = useState<ItemFlujo[]>(initialItems);
  const [itemToEdit, setItemToEdit] = useState<ItemFlujo>();
  const [itemToDelete, setItemToDelete] = useState<ItemFlujo>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setAlert, alert } = useFlash();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  //Functions
  useEffect(() => {
    const fetchData = async () => {
      const responseFlujos = await GetListFlujos(user?.jwt ?? '');
      if (responseFlujos.code === '000') {
        const data = responseFlujos.data;
        const mapped: ItemFlujo[] = data.map((f: any) => ({
          id: String(f.id),
          nombre: f.nombre,
          ayuda: f.detalle ?? '',
        }));
        setItems(mapped);
      } else {
        setAlert({ type: 'error', message: responseFlujos.message });
      }
    };
    fetchData();
  }, [alert, 0]);
  const resetForm = () => {
    form.reset({ nombre: '', ayuda: '' });
    form.clearErrors();
  };
  const deleteItem = (item: ItemFlujo) => {
    const fetchData = async () => {
      const responseFlujos = await DeleteFlujo(
        user?.jwt ?? '',
        Number.parseInt(item.id ?? ''),
      );
      if (responseFlujos.code == '000') {
        setAlert({
          type: 'success',
          message: 'Flujo eliminado correctamente.',
        });
      }
    };
    fetchData();
  };
  const loadToEdit = (item: ItemFlujo) => {
    setItemToEdit(item);
    form.reset({ nombre: item.nombre, ayuda: item.ayuda ?? '' });
    form.clearErrors();
  };
  async function onSubmit(values: newSchemaType) {
    setLoading(true);
    try {
      let response: any = null;
      if (itemToEdit == null) {
        response = await NewFlujo(user?.jwt ?? '', values.nombre, values.ayuda);
      } else {
        const itemEditted: ItemFlujo = itemToEdit;
        itemEditted.nombre = values.nombre;
        itemEditted.ayuda = values.ayuda;
        response = await EditFlujo(user?.jwt ?? '', itemEditted);
      }
      if (response.code == '000') {
        if (itemToEdit == null) {
          setAlert({ type: 'success', message: 'Flujo creado correctamente.' });
        }
        if (itemToEdit != null) {
          setAlert({
            type: 'success',
            message: 'Flujo editado correctamente.',
          });
        }
        setItemToEdit(undefined);
        resetForm();
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: `${error}` });
    } finally {
      setLoading(false);
    }
  }
  const loadToDelete = (item: ItemFlujo) => {
    setItemToDelete(item);
    setOpenDialog(true);
  };
  return (
    <>
      <div className="mx-5 my-5">
        <Alerts />
        <ConfirmationDialog
          show={openDialog}
          onOpenChange={setOpenDialog}
          action={() => {
            if (itemToDelete !== undefined) {
              deleteItem(itemToDelete);
            }
          }}
        />
        <div className="flex items-center gap-2 mb-4 ">
          <Network color="#18CED7" className="size-20" />
          <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
            Editor de Flujos
          </Label>
          <hr className="border-t border-gray-300 my-4" />
        </div>
        <div className="flex">
          <div className="basis-1/2">
            <div className="flex flex-col gap-4">
              <div className="flex">
                <Label className="text-lg color-dark-blue-marn font-bold">
                  EDITAR UN FLUJO EXISTENTE
                </Label>
              </div>
              <div className="flex">
                <Cards
                  isOrdered={false}
                  items={items}
                  loadToEdit={loadToEdit}
                  loadToDelete={loadToDelete}
                />
              </div>
            </div>
          </div>
          <div className="border-e border-border mx-1.5 lg:mx-5"></div>
          <div className="basis-1/2">
            <div className="flex flex-col gap-5">
              <div className="flex items-center">
                <Label className="flex text-lg color-dark-blue-marn font-bold items-center gap-1">
                  {itemToEdit == null ? (
                    <>
                      <Plus className="size-4" />
                      CREAR UN NUEVO FLUJO
                    </>
                  ) : (
                    <>
                      <Pencil className="size-4" />
                      EDITAR EL FLUJO
                    </>
                  )}
                </Label>
              </div>
              <div className="flex items-center">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="block w-full space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            NOMBRE DEL FLUJO
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese el nombre del flujo"
                              className="rounded-3xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ayuda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="color-dark-blue-marn font-bold">
                            TEXTO DE AYUDA
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ingrese el texto de ayuda del flujo"
                              className="rounded-3xl"
                              rows={10}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn 
            btn-lg py-2 px-4
            rounded-xl px-10 bg-blue-400 
             text-white hover:bg-blue-600
             
             "
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                            Cargando...
                          </span>
                        ) : (
                          <>
                            <div className="flex">
                              {itemToEdit !== undefined ? (
                                <>
                                  <Pencil />
                                  EDITAR FLUJO
                                </>
                              ) : (
                                <>
                                  <PlusIcon />
                                  CREAR NUEVO FLUJO
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
