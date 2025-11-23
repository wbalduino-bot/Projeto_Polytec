import { toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTrash } from 'react-icons/fa';

export const notificar = {
  sucesso: (msg) =>
    toast.success(<div className="flex items-center gap-2"><FaCheckCircle />{msg}</div>),
  erro: (msg) =>
    toast.error(<div className="flex items-center gap-2"><FaTimesCircle />{msg}</div>),
  alerta: (msg) =>
    toast.warn(<div className="flex items-center gap-2"><FaExclamationTriangle />{msg}</div>),
  info: (msg) =>
    toast.info(<div className="flex items-center gap-2"><FaTrash />{msg}</div>),
};
