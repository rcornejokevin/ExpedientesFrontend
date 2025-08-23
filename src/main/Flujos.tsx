import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { GetList as GetListFlujos } from '@/models/Flujos';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Network, Pencil, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

type Item = { id: string; title: string; helper?: string };

export default function Flujos({
  onReorder,
}: {
  onReorder?: (items: Item[]) => void;
}) {
  const { user } = useAuth();
  const initialItems: Item[] = [];
  useEffect(() => {
    const fetchData = async () => {
      const responseFlujos = await GetListFlujos(user?.jwt ?? '');
      if (responseFlujos.code !== '000') {
      }
      const data = responseFlujos.data;
      const mapped: Item[] = data.map((f: any) => ({
        id: String(f.id),
        title: f.nombre,
        helper: f.detalle ?? '',
      }));

      setItems(mapped);
    };
    fetchData();
  }, [0]);
  const [items, setItems] = useState<Item[]>(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === String(active.id));
    const newIndex = items.findIndex((i) => i.id === String(over.id));
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    onReorder?.(reordered); // persiste si quieres
  }
  return (
    <>
      <div className="mx-5 mt-5">
        <div className="flex items-center gap-2 mb-4 ">
          <Network color="#18CED7" className="size-20" />
          <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
            Editor de Flujos
          </Label>
          <hr className="border-t border-gray-300 my-4" />
          <br />
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4 w-full">
                      {items.map((item) => (
                        <CardRow key={item.id} item={item} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
          <div className="border-e border-border h-15 mx-1.5 lg:mx-5"></div>
          <div className="basis-1/2">
            <div className="flex">
              <Label className="text-lg color-dark-blue-marn font-bold flex items-center gap-1">
                <Plus className="size-4" />
                CREAR UN NUEVO FLUJO
              </Label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function CardRow({ item }: { item: Item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        'rounded-xl bg-white p-4 shadow-sm',
        'border border-gray-200',
        'flex items-start justify-between',
        isDragging ? 'ring-2 ring-[#D7ED1E]/70' : '',
      ].join(' ')}
    >
      {/* Izquierda: título y helper */}
      <div className="pr-3">
        <div className="text-[17px] font-extrabold text-[#1E2851]">
          {item.title}
        </div>
        {item.helper && (
          <div className="text-[12px] text-[#1E2851]/60">{item.helper}</div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Editar"
          className="rounded-md p-1.5 hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4 text-[#1E2851]" />
        </button>
        <button
          aria-label="Eliminar"
          className="rounded-md p-1.5 hover:bg-gray-100"
        >
          <Trash2 className="h-4 w-4 text-[#1E2851]" />
        </button>
      </div>
    </div>
  );
}
