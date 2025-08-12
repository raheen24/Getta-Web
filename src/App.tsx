import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import Terms from "./components/TermsAndConditions";
import SignInWithEmail from "./SignInWithEmail";
import SignInWithPhone from "./SignInWithPhone";
import VerificationScreen from "./components/VerificationScreen";
import CreateProfile from "./CreateProfile";
import Home from "./components/Home";
import ProfilePage from "./Profile";
import DriversTable from "./DriversTable";
import Request from "./Request";
import Charges from "./Charges";
import Limits from "./Limits";
import PayDrives from "./PayDrivers";
import Income from "./Income";
import IncomeDetails from "./components/IncomeDetails";
import Transaction from "./Transaction";
import Disputes from "./Disputes";
import DisputesMain from "./DisputesMain";
import DisputesDetail from "./components/DisputesDetails";
import TimeLog from "./TimeLog";
import Settings from "./Settings";
import LanguageTab from "./components/LanguageTab";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditionsTab from "./components/TermsConditions";
import ListBlocked from "./components/ListBlocked";
import DriverHistory from "./components/DriversHistory";
import TrackingRiderPage from "./components/TrackingRiderPage";
import DriverProfile from "./components/DriverProfile";
import TrackingDetails from "./components/TrackingDetails";
import Payment from "./components/Payment";
import PaymentTransfer from "./components/PaymentTransfer";
import PaymentTransferAcc from "./components/PaymentTransferAcc";
import Notifications from "./components/Notifications";
import PaidDetails from "./components/PaidDetails";
import EditProfile from "./EditProfile";
import RequestProfile from "./components/RequestProfile";
import BankDetails from "./BankDetails";
import Privacy from "./components/Privacy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sign-in-with-email" element={<SignInWithEmail />} />
        <Route path="/sign-in-with-phone" element={<SignInWithPhone />} />
        <Route path="/verification-screen" element={<VerificationScreen />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-drivers" element={<DriversTable />} />
        <Route path="/request" element={<Request />} />
        <Route path="/charges" element={<Charges />} />
        <Route path="/limits" element={<Limits />} />
        <Route path="/pay-drivers" element={<PayDrives />} />
        <Route path="/income" element={<Income />} />
        <Route path="/income-details" element={<IncomeDetails />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/disputes" element={<DisputesMain />} />
        <Route path="/disputes-details/:id" element={<DisputesDetail />} />
        <Route path="/disputes-tabs" element={<Disputes />} />
        <Route path="/time-log" element={<TimeLog />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/language" element={<LanguageTab />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditionsTab />} />
        <Route path="/block-list" element={<ListBlocked />} />
        <Route path="/drivers-details/:driverId" element={<DriverHistory />} />
        <Route path="/rider-tracking/:rideId" element={<TrackingRiderPage />} />
        <Route path="/drivers-profile" element={<DriverProfile />} />
        <Route path="/tracking-details/:id" element={<TrackingDetails />} />
        <Route path="/payment/:driverId" element={<Payment />} />
        <Route path="/payment-transfer" element={<PaymentTransfer />} />
        <Route
          path="/payment-transfer-acc"
          element={
            <PaymentTransferAcc selectedDriver={{ name: "Ivan Smith" }} />
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/request-profile" element={<RequestProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/paid-details" element={<PaidDetails />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/bank-details" element={<BankDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
