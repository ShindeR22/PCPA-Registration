import { loadSteps } from "./js/steps.js";
import { initRegistration } from "./js/registration.js";
import { initPassDownload } from "./js/pass-download.js";

await loadSteps();
initRegistration();
initPassDownload();
