import { Modal, } from 'react-bootstrap';
import GlobalBtn from './GlobalBtn';
import imgObject from '../assets/images/Object.png';

interface TransferModalProps {
    show: boolean;
    handleClose: () => void;
    selectedDriver: {
      name: string;
    };
  }
  
  const PaymentSuccessModal: React.FC<TransferModalProps> = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered >
            <Modal.Body className="p-4">
                <div className='justify-content-center d-flex'>
            <img src={imgObject} color="#28a745" className="mb-3" />
            </div>
                <h3 className="fw-bold mb-3 text-center">Payment Has Been Successfully Transferred</h3>
                <p className='text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur itaque doloremque, qui ratione architecto, quod cupiditate nihil.</p>
               <div className='d-flex justify-content-center'>
               <GlobalBtn text='Back To Home' className='w-50' navigateTo="/home" />
               </div>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentSuccessModal;
