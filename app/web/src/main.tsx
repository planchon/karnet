import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Router } from "./router/router";
import "./index.css";
import { TooltipProvider } from "./primitive/ui/tooltip";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider
      delayDuration={800}
      skipDelayDuration={1000}
      disableHoverableContent
    >
      <BrowserRouter>
        <Toaster richColors position="bottom-right" />
        <Router />
      </BrowserRouter>
    </TooltipProvider>
  </StrictMode>
);
