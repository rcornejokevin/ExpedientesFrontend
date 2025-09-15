import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Delete as DeleteEtapa,
  Edit as EditEtapa,
  GetList as GetListEtapa,
  ItemEtapa,
  New as NewEtapa,
  Orden as OrdenEtapa,
} from '@/models/Etapas';
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
import { Textarea } from '@/components/ui/textarea';
import Cards from '@/components/Cards';
import ConfirmationDialog from '@/components/confirmationDialog';
import { Field as FieldFlujo } from '../Flujos/Field';
import { getNewSchema, newSchemaType } from './NewSchemaType';

export default function Etapas() {
  //Vars
  const { user } = useAuth();
  const initialItems: ItemEtapa[] = [];
  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewSchema()),
    defaultValues: {
      nombre: '',
      ayuda: '',
      flujo: '',
      finDeFlujo: false,
    },
  });
  const [items, setItems] = useState<ItemEtapa[]>(initialItems);
  const [itemToEdit, setItemToEdit] = useState<ItemEtapa>();
  const [itemToDelete, setItemToDelete] = useState<ItemEtapa>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setAlert, alert } = useFlash();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const loadToDelete = (item: ItemEtapa) => {
    setItemToDelete(item);
    setOpenDialog(true);
  };
  //Functions
  useEffect(() => {
    const fetchDataEtapa = async () => {
      const response = await GetListEtapa(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: ItemEtapa[] = data
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((f: any) => ({
            id: String(f.id),
            nombre: f.nombre,
            ayuda: f.detalle ?? '',
            flujo: String(f.flujoId ?? f.flujo_id ?? f.flujo ?? ''),
            finDeFlujo: f.finDeFlujo,
          }));
        setItems(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchDataEtapa();
  }, [alert, 0]);
  // Memoized selected flujo and filtered etapas
  const selectedFlujo = form.watch('flujo');
  const filteredItems = items.filter(
    (i) => String(i.flujo ?? '') === String(selectedFlujo ?? ''),
  );
  const resetForm = () => {
    form.reset({ nombre: '', ayuda: '', finDeFlujo: false });
    form.clearErrors();
  };
  const deleteItem = (item: ItemEtapa) => {
    const fetchData = async () => {
      const responseEtapa = await DeleteEtapa(
        user?.jwt ?? '',
        Number.parseInt(item.id ?? ''),
      );
      if (responseEtapa.code == '000') {
        setAlert({
          type: 'success',
          message: 'Etapa eliminado correctamente.',
        });
      }
    };
    fetchData();
  };
  const loadToEdit = (item: ItemEtapa) => {
    setItemToEdit(item);
    form.reset({
      nombre: item.nombre,
      ayuda: item.ayuda,
      flujo: item.flujo ?? '',
      finDeFlujo: item.finDeFlujo,
    });
    form.clearErrors();
  };
  async function onSubmit(values: newSchemaType) {
    setLoading(true);
    try {
      let response: any = null;
      if (itemToEdit == null) {
        const itemEtapaAdd: ItemEtapa = {
          nombre: values.nombre,
          ayuda: values.ayuda,
          flujo: values.flujo,
          orden: (filteredItems?.length ?? 0) + 1,
          finDeFlujo: values.finDeFlujo,
        };

        response = await NewEtapa(user?.jwt ?? '', itemEtapaAdd);
      } else {
        const itemEditted: ItemEtapa = itemToEdit;
        itemEditted.nombre = values.nombre;
        itemEditted.ayuda = values.ayuda;
        itemEditted.flujo = values.flujo;
        itemEditted.finDeFlujo = values.finDeFlujo;
        response = await EditEtapa(user?.jwt ?? '', itemEditted);
      }
      if (response.code == '000') {
        if (itemToEdit == null) {
          setAlert({ type: 'success', message: 'Etapa creada correctamente.' });
        }
        if (itemToEdit != null) {
          setAlert({
            type: 'success',
            message: 'Etapa editada correctamente.',
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
  const onReorder = async (items: ItemEtapa[]) => {
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
      const response = await OrdenEtapa(user?.jwt ?? '', itemsOrdered);
      if (response.code == '000') {
        setAlert({
          type: 'success',
          message: 'Etapa ordenada correctamente correctamente.',
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
                Editor de Etapa
              </Label>
            </div>
            <div className="flex">
              <div className="basis-1/2">
                <div className="flex flex-col mr-50">
                  <FieldFlujo
                    form={form}
                    onChange={() => {
                      setItemToEdit(undefined);
                      setItemToDelete(undefined);
                    }}
                  />
                </div>
              </div>
            </div>
            <hr className="border-e border-border my-5" />
            {(form.watch('flujo') ?? '') !== '' ? (
              <>
                <div className="flex max-h-[48vh] overflow-y-auto pr-2">
                  <div className="basis-1/2">
                    <div className="flex flex-col gap-4">
                      <div className="flex">
                        <Label className="text-lg color-dark-blue-marn font-bold">
                          EDITAR UNA ETAPA EXISTENTE
                        </Label>
                      </div>
                      <div className="flex">
                        <Cards
                          onReorder={onReorder}
                          isOrdered={true}
                          items={filteredItems}
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
                              CREAR UNA NUEVA ETAPA
                            </>
                          ) : (
                            <>
                              <Pencil className="size-4" />
                              EDITAR LA ETAPA
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
                                  NOMBRE DE LA ETAPA
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ingrese el nombre de la etapa"
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
                                    placeholder="Ingrese el texto de ayuda de la etapa"
                                    className="rounded-3xl"
                                    rows={10}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="finDeFlujo" // debe ser boolean en tu schema
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="color-dark-blue-marn font-bold">
                                  ETAPA FINAL DE FLUJO
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
                                        EDITAR ETAPA
                                      </>
                                    ) : (
                                      <>
                                        <PlusIcon />
                                        CREAR NUEVA ETAPA
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
