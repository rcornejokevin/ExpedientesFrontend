import { useState } from 'react';
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
import { Pencil, Trash2 } from 'lucide-react';

interface iCards {
  isOrdered: boolean;
  items: any;
  loadToEdit: any;
  loadToDelete: any;
  onReorder?: any;
}
const Cards = ({
  isOrdered,
  items,
  loadToEdit,
  loadToDelete,
  onReorder,
}: iCards) => {
  const [itemEditted, setItemEditted] = useState(items);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    if (!isOrdered) return;
    const oldIndex = items.findIndex((i: any) => i.id === String(active.id));
    const newIndex = items.findIndex((i: any) => i.id === String(over.id));
    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder?.(reordered);
  }
  function CardRow({ item }: { item: any }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id ?? '' });

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
          itemEditted?.id == item.id ? 'ring-2 ring-[#D7ED1E]/70' : '',
        ].join(' ')}
      >
        <div className="pr-3">
          <div className="text-[17px] font-extrabold text-[#1E2851]">
            {item.nombre}
          </div>
          {item.ayuda && (
            <div className="text-[12px] text-[#1E2851]/60">{item.ayuda}</div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Editar"
            className="rounded-md p-1.5 hover:bg-gray-100"
            onClick={() => {
              setItemEditted(item);
              loadToEdit(item);
            }}
          >
            <Pencil className="h-4 w-4 text-[#1E2851]" />
          </button>
          <button
            aria-label="Eliminar"
            className="rounded-md p-1.5 hover:bg-gray-100"
            onClick={() => {
              loadToDelete(item);
            }}
          >
            <Trash2 className="h-4 w-4 text-[#1E2851]" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i: any) => i.id ?? '')}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 w-full">
            {items.map((item: any) => (
              <CardRow key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};
export default Cards;
