import React from 'react';

const Modal = ({ id, children }: { id: string, children: React.ReactNode }) => {
  return (
    <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer>
      <Modal id="accountDetails_modal">
        <div className="modal-body addcards">
          <h1>Your Request <br /> has been Accepted</h1>
          <a href="index.php" className="cta">Go to Home</a>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal id="logoutModal">
        <div className="modal-body">
          <div className="modal_content">
            <a href="javascript:void(0)" className="logoutModal_icon">
              <img src="assets/images/log_out.png" alt="" />
            </a>
            <h3 className="heading">Are you sure want to logout?</h3>
            <div className="drivers-btn-sec">
              <a href="index.php" className="cta cta-2">Cancel</a>
              <a href="login.php" className="cta">Logout</a>
            </div>
          </div>
        </div>
      </Modal>

      {/* Payment Success Modal */}
      <Modal id="payModal">
        <div className="modal-body">
          <div className="modal_content">
            <a href="javascript:void(0)" className="logoutModal_icon">
              <img src="assets/images/Object-pay.png" alt="" />
            </a>
            <h3 className="heading">Payment has been Successfully Transferred</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </p>
            <div className="drivers-btn-sec">
              <a href="index.php" className="cta">Back to home</a>
            </div>
          </div>
        </div>
      </Modal>

      {/* Notification Modal */}
      <Modal id="notificationModal">
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
                        <input type="text" placeholder="DD/MM/YYYY" />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group mt-3">
                        <label>To</label>
                        <input type="text" placeholder="DD/MM/YYYY" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    <input type="text" placeholder="Keywords" />
                  </div>
                </form>
                <a href="#" className="cta">Done</a>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Publish Modal */}
      <Modal id="exampleModal">
        <div className="modal-body">
          <div className="publish-sec">
            <a href="#"><img src="assets/images/whatapp-icon.png" alt="WhatsApp" /> WhatsApp</a>
            <a href="#"><img src="assets/images/instagram-icon.png" alt="Instagram" /> Instagram</a>
            <a href="#"><img src="assets/images/twitter-icon.png" alt="Twitter" /> Twitter</a>
            <a href="#"><img src="assets/images/messages-icon.png" alt="Messages" /> Messages</a>
          </div>
        </div>
      </Modal>

    </footer>
  );
};

export default Footer;
