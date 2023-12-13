import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';



const client = new QueryClient();

document.getElementById('root').style.height = '100%';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={client}>
    <App />
    <ReactQueryDevtools />
    </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
