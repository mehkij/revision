import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../src/index.css";
import AuthView from "./AuthView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthView />
  </StrictMode>
);
