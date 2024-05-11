import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>
        <MaterialTailwindControllerProvider>
          <App />
        </MaterialTailwindControllerProvider>
    </BrowserRouter>
);
