import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import './index.css';

const ROOT_ELEMENT_ID = 'root';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (rootElement === null) {
  throw new Error(`#${ROOT_ELEMENT_ID} element is missing in index.html`);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
