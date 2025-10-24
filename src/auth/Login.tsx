import { useState } from 'react';
import User from '@/interfaces/User';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircleIcon,
  LogIn,
  User as LucideUser,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Alerts, { useFlash } from '@/lib/alerts';
import { sendPost } from '@/lib/apiRequest';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { useAuth } from './AuthContext';
import { getSigninSchema, SigninSchemaType } from './SigninSchemaType';

function getBrowserFingerprint() {
  const data = [
    navigator.userAgent || '',
    navigator.language || '',
    screen.colorDepth || '',
    `${screen.width}x${screen.height}`,
    new Date().getTimezoneOffset(),
    navigator.platform || '',
    navigator.hardwareConcurrency || '',
    window.devicePixelRatio || '',
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  ];

  const raw = data.join('###');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const chr = raw.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}
const Login = () => {
  const { login } = useAuth();
  const { setAlert } = useFlash();
  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      usuario: '',
      password: '',
    },
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function onSubmit(values: SigninSchemaType) {
    setLoading(true);
    setAlert({ type: 'success', message: 'Iniciando sesión...' });
    try {
      const body = {
        username: values.usuario,
        password: values.password,
        device: getBrowserFingerprint(),
      };
      const bodyResponse: any = await sendPost(
        body,
        'seguridad/login',
        false,
        '',
      );
      if (bodyResponse.code !== '000') {
        setAlert({ type: 'error', message: bodyResponse.message });
        setLoading(false);
        return;
      }
      const user: User = {
        email: values.usuario,
        role: bodyResponse.data.role,
        jwt: bodyResponse.data.token,
        perfil: bodyResponse.data.perfil,
      };
      setAlert(null);
      login({ user });
      if (user.perfil == 'IT') {
        navigate('/flujos', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error de autenticación ' + error });
    }
    setLoading(false);
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-5"
        >
          <FormLabel className="flex items-center gap-2 font-bold">
            <LogIn color="#18CED7" size={30} strokeWidth={3} />
            <FormLabel className="text-blue-900 font-bold text-lg">
              Ingresar
            </FormLabel>
          </FormLabel>
          <Alerts />
          <FormField
            control={form.control}
            name="usuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sky-600 font-bold">
                  Usuario
                </FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputAddon mode="icon">
                      <LucideUser />
                    </InputAddon>
                    <Input placeholder="Ingrese su usuario" {...field} />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sky-600 font-bold">
                  Contraseña
                </FormLabel>
                <div className="relative">
                  <InputGroup>
                    <InputAddon mode="icon">
                      <KeyRound />
                    </InputAddon>
                    <Input
                      placeholder="Ingrese su contraseña"
                      type={passwordVisible ? 'text' : 'password'} // Toggle input type
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      mode="icon"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    >
                      {passwordVisible ? (
                        <EyeOff className="text-muted-foreground" />
                      ) : (
                        <Eye className="text-muted-foreground" />
                      )}
                    </Button>
                  </InputGroup>
                </div>
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
                'INGRESAR'
              )}
            </button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default Login;
