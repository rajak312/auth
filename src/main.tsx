import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppThemeProvider } from "./providers/AppThemeProvider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <RouterProvider router={router} />
    </AppThemeProvider>
  </StrictMode>
);
