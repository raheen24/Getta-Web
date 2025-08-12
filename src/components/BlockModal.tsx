import "../assets/BlockModal.css";
import { useTranslation } from "react-i18next";

interface BlockModalProps {
  userName: string;
  isBlocked: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const BlockModal: React.FC<BlockModalProps> = ({
  userName,
  isBlocked,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay-of-block">
      <div className="modal-content-of-block">
        {/* Close Button */}
        <button className="close-btn-of-block" onClick={onCancel}>
          &times;
        </button>
        <h3 className="modal-heading-of-block">
          {isBlocked ? t("blockModal.unblock") : t("blockModal.block")}
        </h3>
        
        <h3 className="modal-text-of-block">{userName}</h3> {/* Driver's name */}
        <div className="modal-actions-of-block">
          <button
            className="block-btn-of-block"
            onClick={onConfirm}
          >
            {isBlocked ? t("blockModal.unblockButton") : t("blockModal.blockButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
