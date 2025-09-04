import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Plus, X } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface PdfUploadProps {
  form: any;
  name: string;
  label?: string;
  height?: number;
  className?: string;
}

// A simple PDF upload with an inline preview (first page via browser PDF viewer)
// Shows a plus icon when empty, and a small embedded preview when a file is chosen.
export default function PdfUpload({
  form,
  name,
  label,
  height = 220,
  className = '',
}: PdfUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  const watched = useWatch({ control: form.control, name });
  const file: File | null = watched instanceof File ? watched : null;

  useEffect(() => {
    if (!file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setThumbUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const renderThumb = async () => {
      setIsRendering(true);
      try {
        const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
        const workerSrc = (
          await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
        ).default;
        if (GlobalWorkerOptions && workerSrc) {
          (GlobalWorkerOptions as any).workerSrc = workerSrc;
        }
        const data = await file.arrayBuffer();
        const pdf = await getDocument({ data }).promise;
        const page = await pdf.getPage(1);
        const initial = page.getViewport({ scale: 1 });
        const targetWidth = 350;
        const scale = targetWidth / initial.width;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        setThumbUrl(canvas.toDataURL('image/png'));
      } catch (e) {
      } finally {
        setIsRendering(false);
      }
    };
    renderThumb();
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      if (!f.name.toLowerCase().endsWith('.pdf')) return;
    }
    form.setValue(name, f, { shouldDirty: true, shouldValidate: false });
  };

  const clearFile = () => {
    form.setValue(name, null, { shouldDirty: true, shouldValidate: false });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="color-dark-blue-marn font-bold">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleChange}
              />

              {!previewUrl ? (
                <button
                  type="button"
                  onClick={handlePick}
                  className="flex w-full items-center justify-center rounded-2xl border border-dashed border-sky-300 bg-white/60 p-6 hover:bg-white"
                  style={{ height }}
                >
                  <div className="flex flex-col items-center gap-2 text-sky-400">
                    <Plus className="size-9" />
                    <span className="text-sm font-medium text-sky-500">
                      Cargar PDF
                    </span>
                  </div>
                </button>
              ) : (
                <div
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  style={{ height }}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt="Miniatura PDF"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <iframe
                      title="Vista previa PDF"
                      src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
                      className="h-full w-full"
                    />
                  )}
                  {isRendering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <LoaderCircle className="size-6 animate-spin text-sky-500" />
                    </div>
                  )}
                  <div className="absolute right-2 top-2 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="dim"
                      onClick={handlePick}
                      className="rounded-full"
                    >
                      Cambiar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="dim"
                      onClick={clearFile}
                      className="rounded-full"
                      aria-label="Quitar PDF"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
