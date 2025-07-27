import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../src/index.css";
import CommentsView from "./CommentsView.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommentsView />
  </StrictMode>
);
