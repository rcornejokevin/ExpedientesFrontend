import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  Delete as DeleteSubEtapa,
  Edit as EditSubEtapa,
  GetList as GetListSubEtapa,
  ItemSubEtapa,
  New as NewSubEtapa,
  Orden as OrdenSubEtapa,
} from '@/models/SubEtapas';
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
import { Field as FieldEtapa } from '../Etapas/Field';
import { Field as FieldFlujo } from '../Flujos/Field';
import { getNewSchema, newSchemaType } from './NewSchemaType';

export default function SubEtapas() {
  //Vars
  const { user } = useAuth();
  const initialItems: ItemSubEtapa[] = [];
  const form = useForm<newSchemaType>({
    resolver: zodResolver(getNewSchema()),
    defaultValues: {
      nombre: '',
      ayuda: '',
      flujo: '',
    },
  });
  const [items, setItems] = useState<ItemSubEtapa[]>(initialItems);
  const [itemToEdit, setItemToEdit] = useState<ItemSubEtapa>();
  const [itemToDelete, setItemToDelete] = useState<ItemSubEtapa>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setAlert, alert } = useFlash();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const selectedFlujo = form.watch('flujo');
  const selectedEtapa = form.watch('etapa');
  const filteredItems = items.filter(
    (i) => String(i.etapa ?? '') === String(selectedEtapa ?? ''),
  );
  //Functions
  useEffect(() => {
    const fetchDataSubEtapa = async () => {
      const response = await GetListSubEtapa(user?.jwt ?? '');
      if (response.code === '000') {
        const data = response.data;
        const mapped: ItemSubEtapa[] = data
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((f: any) => ({
            id: String(f.id),
            nombre: f.nombre,
            ayuda: f.detalle ?? '',
            etapa: String(f.etapaId ?? ''),
          }));
        setItems(mapped);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    };
    fetchDataSubEtapa();
  }, [alert, 0]);
  // Memoized selected flujo and filtered etapas

  const resetForm = () => {
    form.reset({ nombre: '', ayuda: '', flujo: '', etapa: '' });
    form.clearErrors();
  };
  const deleteItem = (item: ItemSubEtapa) => {
    const fetchData = async () => {
      const responseFlujos = await DeleteSubEtapa(
        user?.jwt ?? '',
        Number.parseInt(item.id ?? ''),
      );
      if (responseFlujos.code == '000') {
        setAlert({
          type: 'success',
          message: 'Etapa eliminado correctamente.',
        });
      }
    };
    fetchData();
  };
  const loadToEdit = (item: ItemSubEtapa) => {
    setItemToEdit(item);
    form.reset({
      nombre: item.nombre,
      ayuda: item.ayuda,
      flujo: selectedFlujo,
      etapa: selectedEtapa,
    });
    form.clearErrors();
  };
  async function onSubmit(values: newSchemaType) {
    setLoading(true);
    try {
      let response: any = null;
      if (itemToEdit == null) {
        const itemEtapaAdd: ItemSubEtapa = {
          nombre: values.nombre,
          ayuda: values.ayuda,
          etapa: values.etapa,
          orden: (filteredItems?.length ?? 0) + 1,
        };
        response = await NewSubEtapa(user?.jwt ?? '', itemEtapaAdd);
      } else {
        const itemEditted: ItemSubEtapa = itemToEdit;
        itemEditted.nombre = values.nombre;
        itemEditted.ayuda = values.ayuda;
        itemEditted.etapa = values.etapa;
        response = await EditSubEtapa(user?.jwt ?? '', itemEditted);
      }
      if (response.code == '000') {
        if (itemToEdit == null) {
          setAlert({
            type: 'success',
            message: 'Sub Etapa creada correctamente.',
          });
        }
        if (itemToEdit != null) {
          setAlert({
            type: 'success',
            message: 'Sub Etapa editada correctamente.',
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
  const loadToDelete = (item: ItemSubEtapa) => {
    setItemToDelete(item);
    setOpenDialog(true);
  };
  const onReorder = async (items: ItemSubEtapa[]) => {
    const selectedEtapa = form.watch('etapa');
    const filteredItems = items.filter(
      (i) => String(i.etapa ?? '') === String(selectedEtapa ?? ''),
    );
    const itemsOrdered: any = {
      items: filteredItems.map((item, i) => {
        return { orden: i + 1, id: item.id };
      }),
    };
    try {
      const response = await OrdenSubEtapa(user?.jwt ?? '', itemsOrdered);
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
            <div className="grid grid-rows-[auto,1fr] h-[70vh]">
              <div>
                <div className="flex items-center gap-2 mb-4 ">
                  <AlignRight color="#18CED7" className="size-20" />
                  <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
                    Editor de Sub-Etapa
                  </Label>
                </div>

                <div className="flex">
                  <div className="basis-2/5">
                    <div className="flex flex-col mr-5">
                      <FieldFlujo
                        form={form}
                        onChange={() => {
                          setItemToEdit(undefined);
                          setItemToDelete(undefined);
                        }}
                      />
                    </div>
                  </div>
                  <div className="basis-1/5">
                    <div className="flex justify-center items-center p-3">
                      <Plus size={50} />
                    </div>
                  </div>
                  <div className="basis-2/5">
                    <div className="flex flex-col mr-5">
                      <FieldEtapa
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
              </div>

              {(form.watch('flujo') ?? '') !== '' &&
              (form.watch('etapa') ?? '') !== '' ? (
                <div className="flex overflow-y-auto pr-2">
                  <div className="basis-1/2">
                    <div className="flex flex-col gap-4">
                      <div className="flex">
                        <Label className="text-lg color-dark-blue-marn font-bold">
                          EDITAR UNA ETAPA EXISTENTE
                        </Label>
                      </div>
                      <div className="flex">
                        <Cards
                          isOrdered={true}
                          items={filteredItems}
                          loadToEdit={loadToEdit}
                          loadToDelete={loadToDelete}
                          onReorder={onReorder}
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
                              CREAR UNA NUEVA SUB-ETAPA
                            </>
                          ) : (
                            <>
                              <Pencil className="size-4" />
                              EDITAR LA SUB-ETAPA
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
                                  NOMBRE DE LA SUB ETAPA
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ingrese el nombre de la sub-etapa"
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
                                    placeholder="Ingrese el texto de ayuda de la subetapa"
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
                                        EDITAR SUB ETAPA
                                      </>
                                    ) : (
                                      <>
                                        <PlusIcon />
                                        CREAR NUEVA SUB ETAPA
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
              ) : (
                <div />
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
