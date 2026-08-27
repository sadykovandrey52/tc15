import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSeoValidation } from "./utils/seoValidation";
import { saveUtmParams } from "./utils/utm";

saveUtmParams();
initSeoValidation();

createRoot(document.getElementById("root")!).render(<App />);
