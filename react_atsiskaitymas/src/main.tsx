import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { MerchProvider } from './contexts/MerchContext.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import { UsersProvider } from './contexts/UsersContext.tsx';
import { CommentsProvider } from './contexts/CommentsContext.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <BrowserRouter>
  <UsersProvider>
    <MerchProvider>
    <CommentsProvider>
      <CartProvider>
        <App />
      </CartProvider>
      </CommentsProvider>
    </MerchProvider>
  </UsersProvider>
</BrowserRouter>
);