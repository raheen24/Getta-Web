import React from 'react';
import { Modal } from 'react-bootstrap';
import GlobalBtn from './GlobalBtn';
interface LogoutModalProps {
  show: boolean;
  handleClose: () => void;
  handleContinue: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ show, handleClose, handleContinue }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="text-center p-3">
          <h3 className="heading colorofall my-5">Your Request has been Accepted</h3>
          <div className="d-flex justify-content-center gap-3">
            <GlobalBtn text="Go to Home" className="cta w-100" onClick={handleContinue} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LogoutModal;
