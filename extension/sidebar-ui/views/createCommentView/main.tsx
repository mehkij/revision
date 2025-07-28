import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../src/index.css";
import CommentCreationView from "./CreateCommentView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommentCreationView />
  </StrictMode>
);
