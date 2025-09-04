import { format, Locale } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface iDatePicker {
  form: any;
  name: string;
  label: string;
  readOnly?: boolean;
  defaultValue?: string;
  formatStr?: string;
  locale?: Locale;
}
const DatePickerMarn = ({
  form,
  name,
  label,
  readOnly = false,
  defaultValue,
  formatStr = "d 'de' MMMM 'de' yyyy",
  locale = es,
}: iDatePicker) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        if (!field.value && defaultValue) {
          form.setValue(name, defaultValue, { shouldValidate: true });
        }
        return (
          <FormItem>
            <FormLabel className="color-dark-blue-marn font-bold">
              {label}
            </FormLabel>
            <FormControl>
              {readOnly ? (
                <Button
                  type="button"
                  variant="outline"
                  mode="input"
                  disabled
                  className="w-full rounded-3xl"
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(new Date(field.value), formatStr, { locale })
                  ) : (
                    <span>Sin fecha</span>
                  )}
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        mode="input"
                        placeholder={!field.value}
                        className="w-full rounded-3xl"
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(new Date(field.value), formatStr, { locale })
                        ) : (
                          <span>Seleccione una Fecha</span>
                        )}
                      </Button>
                      {field.value && (
                        <Button
                          type="button"
                          variant="dim"
                          size="sm"
                          className="absolute top-1/2 -end-0 -translate-y-1/2"
                          onClick={(e) => {
                            e.preventDefault();
                            form.setValue(name, '', {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        form.setValue(name, date?.toISOString() || '', {
                          shouldValidate: true,
                        })
                      }
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
export default DatePickerMarn;
