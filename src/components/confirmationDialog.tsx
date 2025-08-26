import { useDirection } from '@radix-ui/react-direction';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ConfirmationDialogProps = {
  show: boolean; // controla si se muestra
  action: () => void | Promise<void>; // se ejecuta al confirmar
  onOpenChange?: (open: boolean) => void; // para cerrar/abrir desde el padre
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  disableAutoCloseOnConfirm?: boolean; // opcional: evitar cierre automático
};

export default function ConfirmationDialog({
  show = true,
  action,
  onOpenChange,
  title = 'Confirmación',
  description = '¿Desea eliminar dicho elemento?',
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  disableAutoCloseOnConfirm = false,
}: ConfirmationDialogProps) {
  const direction = useDirection();

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Si quieres evitar que el AlertDialog se cierre automáticamente al confirmar:
    if (disableAutoCloseOnConfirm) {
      e.preventDefault(); // evita el cierre automático de AlertDialogAction
    }
    await action();
    if (disableAutoCloseOnConfirm) {
      onOpenChange?.(false); // cerrar manualmente después de la acción
    }
  };

  return (
    // Componente controlado: open/onOpenChange
    <AlertDialog open={show} onOpenChange={onOpenChange}>
      {/* No usamos Trigger porque el control es externo */}
      <AlertDialogContent dir={direction}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange?.(false)}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
