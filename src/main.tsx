import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppThemeProvider } from "./providers/AppThemeProvider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.tsx";
import { ToastProvider } from "./providers/ToastProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <AppThemeProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
