import { Modal } from 'react-bootstrap';
import GlobalBtn from './GlobalBtn';
import imgObject from '../assets/images/Object.png';
import { useTranslation } from 'react-i18next';

interface TransferModalProps {
    show: boolean;
    handleClose: () => void;
    selectedDriver: {
      name: string;
    };
}

const PaymentSuccessModal: React.FC<TransferModalProps> = ({ show, handleClose }) => {
  const { t } = useTranslation();
  
  return (
    <Modal show={show} onHide={handleClose} centered >
        <Modal.Body className="p-4">
            <div className='justify-content-center d-flex'>
                <img src={imgObject} color="#28a745" className="mb-3" />
            </div>
            <h3 className="fw-bold mb-3 text-center">{t("paymentSuccessModal.paymentTransferred")}</h3>
            <p className='text-center mb-2'>{t("paymentSuccessModal.successMessage")}</p>
            <div className='d-flex justify-content-center'>
                <GlobalBtn text={t("paymentSuccessModal.backToHome")} className='w-50' navigateTo="/home" />
            </div>
        </Modal.Body>
    </Modal>
  );
};

export default PaymentSuccessModal;
