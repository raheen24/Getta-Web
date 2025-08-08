// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
 apiKey: "AIzaSyAEjbFsCew-kQDLaLlUM11bBianzlw8IsI",
  authDomain: "getta-7ab03.firebaseapp.com",
  projectId: "getta-7ab03",
  storageBucket: "getta-7ab03.firebasestorage.app",
  messagingSenderId: "684756589836",
  appId: "1:684756589836:web:dd797b806792383353fd29",
  measurementId: "G-B043JWQMCE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message: ", payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/firebase-logo.png", // You can use your own icon here
  });
});
