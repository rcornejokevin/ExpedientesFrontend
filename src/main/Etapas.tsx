import React from 'react';
import { AlignRight } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function Etapas() {
  return (
    <>
      <div className="mx-5 mt-5">
        <div className="flex items-center gap-2 mb-4 ">
          <AlignRight color="#18CED7" className="size-20" />
          <Label className="flex items-center gap-2 font-bold text-3xl color-dark-blue-marn">
            Editor de Etapas
          </Label>
          <hr className="border-t border-gray-300 my-4" />
          <br />
        </div>
        <Label className="text-lg color-dark-blue-marn font-bold">
          SELECCIONE UN FLUJO
        </Label>
      </div>
    </>
  );
}
