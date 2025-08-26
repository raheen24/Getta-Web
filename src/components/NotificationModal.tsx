import React, { useState } from "react";
import GlobalBtn from "./GlobalBtn";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface NotificationModalProps {
  show: boolean;
  handleClose: () => void;
  onApplyFilters: (filters: {
    startDate?: string;
    endDate?: string;
    keyword?: string;
  }) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  show,
  handleClose,
  onApplyFilters,
}) => {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal")) {
      handleClose();
    }
  };

  const handleApply = () => {
    // ✅ At least one filter required
    if (!startDate && !endDate && !keyword.trim()) {
      toast.error(t("notifications.errors.atLeastOneFilter"));
      return;
    }

    if (startDate && !endDate) {
      toast.error(t("notifications.errors.endDateRequired"));
      return;
    }
    if (!startDate && endDate) {
      toast.error(t("notifications.errors.startDateRequired"));
      return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error(t("notifications.errors.invalidDateRange"));
      return;
    }

    onApplyFilters({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      keyword: keyword || undefined,
    });

    handleClose();
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
          <div className="modal-content" style={{ borderRadius: "0px" }}>
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
                              type="date"
                              className="form-control"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="form-group mt-3">
                            <label>{t("notifications.to")}</label>
                            <input
                              type="date"
                              className="form-control"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Keyword input */}
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("notifications.keywords")}
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                      </div>
                    </form>

                    <GlobalBtn
                      text={t("notifications.done")}
                      onClick={handleApply}
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
