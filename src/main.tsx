import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./responsive.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";
import LoadingSpinner from "./components/LoadingSpinner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={<LoadingSpinner />}  
        persistor={persistor}
      >
        <>
          <App />
          <ToastContainer position="top-center" autoClose={3000} />
        </>
      </PersistGate>
    </Provider>
  </StrictMode>
);
