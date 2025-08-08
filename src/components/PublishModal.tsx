import React from 'react';
import { Modal } from 'react-bootstrap';
import watsappIcon from '../assets/images/whatapp-icon.png';
import twitterIcon from '../assets/images/twitter-icon.png';
import instagramIcon from '../assets/images/instagram-icon.png';
import messagesIcon from '../assets/images/messages-icon.png';

interface PublishModalProps {
  show: boolean;
  handleClose: () => void;
}

const PublishModal: React.FC<PublishModalProps> = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={true}
      dialogClassName="bottom-modal"
      contentClassName="modal-content"
      className="publish fade"
      id="exampleModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="publish-sec">
        <a href="" className='text-decoration-none'>
          <img src={watsappIcon} alt="WhatsApp" />
          WhatsApp
        </a>
        <a href="" className='text-decoration-none'>
          <img src={instagramIcon} alt="Instagram" />
          Instagram
        </a>
        <a href="" className='text-decoration-none'>
          <img src={twitterIcon} alt="Twitter" />
          Twitter
        </a>
        <a href="" className='text-decoration-none'>
          <img src={messagesIcon} alt="Messages" />
          Messages
        </a>
      </div>
    </Modal>
  );
};

export default PublishModal;
