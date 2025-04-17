import { Routes, Route } from 'react-router';

import MainOutlet from './components/outlets/MainOutlet';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import Merch from './components/pages/Merch';
import Product from './components/pages/Product';
import AddNewMerch from './components/pages/AddNewMerch';
import Cart from './components/pages/Cart';
import RestockMerch from './components/pages/RestockMerch';

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="" element={<MainOutlet />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="restock" element={<RestockMerch />} />
          <Route path="shop" > 
            <Route index element={<Merch />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="addNewMerch" element={<AddNewMerch />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;