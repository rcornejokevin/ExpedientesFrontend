import { createContext, FC, useContext, useState } from 'react';
import { AlertCircle, CheckCheck } from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';

interface AlertInterface {
  type: string;
  message: string;
}
interface AlertInterfaceContext {
  alert: AlertInterface;
  setAlert: Function;
}
const initsFlash = {
  alert: { type: '', message: '' },
  setAlert: () => {},
};
const FlashMessageAlert = createContext<AlertInterfaceContext>(initsFlash);
const useFlash = () => {
  return useContext(FlashMessageAlert);
};
const Alerts: FC = () => {
  const { alert, setAlert } = useFlash();
  const alertObj = alert;
  if (alertObj === null) {
    return <></>;
  }
  return (
    <>
      {alertObj.type === 'error' && (
        <Alert
          variant="destructive"
          appearance="light"
          className="my-5"
          onClose={() => setAlert(null)}
          close={true}
        >
          <AlertIcon>
            <AlertCircle />
          </AlertIcon>
          <AlertTitle>{alertObj.message}</AlertTitle>
        </Alert>
      )}
      {alertObj.type === 'success' && (
        <Alert
          variant="success"
          className="my-5"
          appearance="light"
          onClose={() => setAlert(null)}
          close={true}
        >
          <AlertIcon>
            <CheckCheck />
          </AlertIcon>
          <AlertTitle>{alertObj.message}</AlertTitle>
        </Alert>
      )}
    </>
  );
};
const FlashMessageContext: FC<any> = ({ children }) => {
  const [alert, setAlert] = useState<AlertInterface>({ type: '', message: '' });
  return (
    <FlashMessageAlert.Provider value={{ alert, setAlert }}>
      {children}
    </FlashMessageAlert.Provider>
  );
};
export default Alerts;
export { FlashMessageContext, useFlash };
