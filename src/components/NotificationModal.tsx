import React from "react";
import GlobalBtn from "./GlobalBtn";
import { useTranslation } from "react-i18next";

interface NotificationModalProps {
  show: boolean;
  handleClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal")) {
      handleClose();
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
        onClick={handleBackdropClick}
      >
        <div
          className="modal-dialog"
          style={{ left: "28%", top: "18%" }}
          onClick={(e) => e.stopPropagation()}
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
                    <h4>{t("notifications.filter")}</h4>
                    <form>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="form-group mt-3">
                            <label>{t("notifications.from")}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("notifications.datePlaceholder")}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="form-group mt-3">
                            <label>{t("notifications.to")}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("notifications.datePlaceholder")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("notifications.keywords")}
                        />
                      </div>
                    </form>

                    <GlobalBtn
                      text={t("notifications.done")}
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
