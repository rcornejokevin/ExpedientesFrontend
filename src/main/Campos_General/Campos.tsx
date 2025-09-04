import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Delete as DeleteCampo,
  Edit as EditCampo,
  GetList as GetListCampo,
  ItemCampo,
  New as NewCampo,
  Orden as OrdenCampo,
} from '@/models/Campos';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlignRight,
  LoaderCircleIcon,
  Pencil,
  Plus,
  PlusIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import Alerts, { useFlash } from '@/lib/alerts';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Cards from '@/components/Cards';
import ConfirmationDialog from '@/components/confirmationDialog';
import { Field as FieldFlujo } from '../Flujos/Field';
import { getNewSchema, newSchemaType } from './NewSchemaType';

export default function CamposGeneral() {
  //Vars
  const { user } = useAuth();
  const initialItems: ItemCampo[] = [];
  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewSchema()),
    defaultValues: {
      nombre: '',
      tipo: '',
      flujo: '',
    },
  });
  const [items, setItems] = useState<ItemCampo[]>(initialItems);
  const [itemToEdit, setItemToEdit] = useState<ItemCampo>();
  const [itemToDelete, setItemToDelete] = useState<ItemCampo>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setAlert, alert } = useFlash();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const selectedFlujo = form.watch('flujo');
  const filteredItems = items.filter(
    (i) =>
      String(i.etapa ?? '') === '' && String(i.flujo ?? '') === selectedFlujo,
  );

  //Functions
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetListCampo(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: ItemCampo[] = data
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((f: any) => ({
            id: String(f.id),
            nombre: f.nombre,
            etapa: f.etapaId,
            flujo: f.flujoId,
            orden: f.orden,
            requerido: f.requerido,
            tipo: f.tipo,
          }));
        setItems(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchData();
  }, [alert]);
  const resetForm = () => {
    form.reset({
      nombre: '',
      flujo: '',
      tipo: '',
      requerido: false,
    });
    form.clearErrors();
  };
  const deleteItem = (item: ItemCampo) => {
    const fetchData = async () => {
      const responseFlujos = await DeleteCampo(
        user?.jwt ?? '',
        Number.parseInt(item.id ?? ''),
      );
      if (responseFlujos.code == '000') {
        setAlert({
          type: 'success',
          message: 'Campo eliminado correctamente.',
        });
      }
    };
    fetchData();
  };
  const loadToEdit = (item: ItemCampo) => {
    setItemToEdit(item);
    form.reset({
      nombre: item.nombre,
      flujo: selectedFlujo,
      requerido: item.requerido,
      tipo: item.tipo,
    });
    form.clearErrors();
  };
  async function onSubmit(values: newSchemaType) {
    setLoading(true);
    try {
      let response: any = null;
      if (itemToEdit == null) {
        const itemCampoAdd: ItemCampo = {
          nombre: values.nombre,
          tipo: values.tipo,
          orden: (filteredItems?.length ?? 0) + 1,
          requerido: values.requerido ?? false,
          flujo: values.flujo,
        };
        response = await NewCampo(user?.jwt ?? '', itemCampoAdd);
      } else {
        const itemEditted: ItemCampo = itemToEdit;
        itemEditted.nombre = values.nombre;
        itemEditted.tipo = values.tipo;
        itemEditted.flujo = values.flujo;
        itemEditted.requerido = values.requerido ?? false;
        response = await EditCampo(user?.jwt ?? '', itemEditted);
      }
      if (response.code == '000') {
        if (itemToEdit == null) {
          setAlert({
            type: 'success',
            message: 'Campo creado correctamente.',
          });
        }
        if (itemToEdit != null) {
          setAlert({
            type: 'success',
            message: 'Campo editado correctamente.',
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
  const loadToDelete = (item: any) => {
    setItemToDelete(item);
    setOpenDialog(true);
  };
  const onReorder = async (items: ItemCampo[]) => {
    const selectedFlujo = form.watch('flujo');
    const filteredItems = items.filter(
      (i) => String(i.flujo ?? '') === String(selectedFlujo ?? ''),
    );
    const itemsOrdered: any = {
      items: filteredItems.map((item, i) => {
        return { orden: i + 1, id: item.id };
      }),
    };
    try {
      const response = await OrdenCampo(user?.jwt ?? '', itemsOrdered);
      if (response.code == '000') {
        setAlert({
          type: 'success',
          message: 'Campos ordenados correctamente correctamente.',
        });
        setItemToEdit(undefined);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: `${error}` });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mx-5 my-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <AlignRight color="#18CED7" className="size-20" />
              <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
                Editor de Campos
              </Label>
            </div>

            <div className="w-[30%]">
              <FieldFlujo
                form={form}
                onChange={() => {
                  setItemToEdit(undefined);
                  setItemToDelete(undefined);
                }}
              />
            </div>
            <hr className="border-e border-border my-5" />
            {(form.watch('flujo') ?? '') !== '' ? (
              <>
                <div className="flex">
                  <div className="basis-1/2">
                    <div className="flex flex-col gap-4">
                      <div className="flex">
                        <Label className="text-lg color-dark-blue-marn font-bold">
                          EDITAR UN CAMPO EXISTENTE
                        </Label>
                      </div>
                      <div className="flex">
                        <Cards
                          items={filteredItems}
                          onReorder={onReorder}
                          loadToEdit={loadToEdit}
                          isOrdered={true}
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
                              CREAR UN NUEVO CAMPO
                            </>
                          ) : (
                            <>
                              <Pencil className="size-4" />
                              EDITAR CAMPO
                            </>
                          )}
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <div className="block w-full space-y-5">
                          <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="color-dark-blue-marn font-bold">
                                  NOMBRE DEL CAMPO
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ingrese el nombre del campo"
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
                            name="tipo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="color-dark-blue-marn font-bold">
                                  TIPO
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(val) => {
                                      field.onChange(val);
                                      setItemToEdit(undefined);
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="rounded-3xl">
                                      <SelectValue placeholder="Seleccione un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Texto">
                                        Texto
                                      </SelectItem>
                                      <SelectItem value="Numero">
                                        Número
                                      </SelectItem>
                                      <SelectItem value="Fecha">
                                        Fecha
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="requerido" // debe ser boolean en tu schema
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="color-dark-blue-marn font-bold">
                                  REQUERIDO
                                </FormLabel>
                                <FormControl>
                                  <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked === true); // fuerza boolean
                                      setItemToEdit(undefined);
                                    }}
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
                                        EDITAR CAMPO
                                      </>
                                    ) : (
                                      <>
                                        <PlusIcon />
                                        CREAR NUEVO CAMPO
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
