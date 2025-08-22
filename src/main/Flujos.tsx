import { Network, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function Flujos() {
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
            <div className="flex">
              <Label className="text-lg color-dark-blue-marn font-bold">
                EDITAR UN FLUJO EXISTENTE
              </Label>
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
