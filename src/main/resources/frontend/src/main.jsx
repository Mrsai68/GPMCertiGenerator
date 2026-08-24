import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./context/useAuthContext.jsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
      <AuthProvider auth={createRoot}>
            <App />
      </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
