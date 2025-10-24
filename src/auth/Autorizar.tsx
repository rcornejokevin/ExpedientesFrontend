import { useEffect, useMemo, useState } from 'react';
import { approveTwoFactor } from '@/models/Auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFlash } from '@/lib/alerts';

export default function Autorizar() {
  const [searchParams] = useSearchParams();
  const { setAlert } = useFlash();
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const usuario = useMemo(
    () => searchParams.get('usuario') ?? '',
    [searchParams],
  );

  useEffect(() => {
    if (!token) return;

    const authorize = async () => {
      setStatus('loading');
      setMessage('Autorizando terminal...');
      try {
        const response = await approveTwoFactor(token);
        if (response?.code === '000') {
          setAlert({
            type: 'success',
            message: 'Terminal autorizada correctamente.',
          });
          navigate('/login', { replace: true });
        } else {
          const errorMessage =
            response?.message ?? 'No fue posible autorizar la terminal.';
          setStatus('error');
          setMessage(errorMessage);
          setAlert({ type: 'error', message: errorMessage });
        }
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : 'No fue posible autorizar la terminal.';
        setStatus('error');
        setMessage(msg);
        setAlert({ type: 'error', message: msg });
      }
    };

    authorize();
  }, [token, setAlert]);

  return (
    <div>
      <h2>Autorizar Terminal</h2>
      {token ? (
        <div>
          <p>
            Token recibido: <strong>{token}</strong>
          </p>
          <p>
            Estado:{' '}
            {status === 'loading'
              ? 'Procesando...'
              : message || 'En espera de procesamiento.'}
          </p>
        </div>
      ) : (
        <p>No se proporcionó un token.</p>
      )}
      {usuario ? (
        <p>
          Usuario: <strong>{usuario}</strong>
        </p>
      ) : null}
    </div>
  );
}
