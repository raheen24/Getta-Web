import React from "react";
import GlobalBtn from "./GlobalBtn";

interface NotificationModalProps {
  show: boolean;
  handleClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  show,
  handleClose,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal")) {
      handleClose(); // only close when clicking outside the modal-dialog
    }
  };

  return (
    <>
      <div
        className={`modal fade ${show ? "show" : ""}`}
        tabIndex={-1}
        style={{
          display: show ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        aria-hidden={!show}
        onClick={handleBackdropClick} // Dismiss on outside click
      >
        <div
          className="modal-dialog"
          style={{ left: "28%", top: "18%" }}
          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
        >
          <div
            className="modal-content"
            style={{
              borderRadius: "0px", // remove border-radius
            }}
          >
            <div className="modal-body">
              <div className="settingInner_content">
                <div className="notification_sect">
                  <div className="create-profile-input">
                    <h4>Filter</h4>
                    <form>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="form-group mt-3">
                            <label>From</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="DD/MM/YYYY"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="form-group mt-3">
                            <label>To</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="DD/MM/YYYY"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Keywords"
                        />
                      </div>
                    </form>

                    <GlobalBtn
                      text="Done"
                      onClick={handleClose}
                      className="w-100 mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: if you're not using Bootstrap's built-in backdrop */}
      {show && (
        <div
          className="modal-backdrop fade show"
          style={{ opacity: 0.5 }}
        ></div>
      )}
    </>
  );
};

export default NotificationModal;
