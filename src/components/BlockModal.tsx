import "../assets/BlockModal.css";

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
  return (
    <div className="modal-overlay-of-block">
      <div className="modal-content-of-block">
        {/* Close Button */}
        <button className="close-btn-of-block" onClick={onCancel}>
          &times;
        </button>
        <h3>{isBlocked ? "Unblock" : "Block"}</h3>
        <h3 className="modal-text-of-block">"{userName}"?</h3>
        <div className="modal-actions-of-block">
          <button className="block-btn-of-block" onClick={onConfirm}>
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
