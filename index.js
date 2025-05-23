import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.js')
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.error("Service Worker registration failed:", err));
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);