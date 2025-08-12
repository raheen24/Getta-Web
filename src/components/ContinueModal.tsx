import React from 'react';
import { Modal } from 'react-bootstrap';
import GlobalBtn from './GlobalBtn';
import { useTranslation } from 'react-i18next';

interface LogoutModalProps {
  show: boolean;
  handleClose: () => void;
  handleContinue: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ show, handleClose, handleContinue }) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="text-center p-3">
          <h3 className="heading colorofall my-5">{t("modal.requestAccepted")}</h3>
          <div className="d-flex justify-content-center gap-3">
            <GlobalBtn text={t("common.goToHome")} className="cta w-100" onClick={handleContinue} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LogoutModal;
