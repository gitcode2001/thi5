import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import OrderListComponent from "./components/OrderListComponent";
import AddOrderComponent from "./components/AddOrderComponent";

function App() {
  return (
      <BrowserRouter>
      <ToastContainer position="top-right" autoClose={1000} />
      <Routes>
        <Route path="/order" element={<OrderListComponent />} />
        <Route path="/order/add" element={<AddOrderComponent />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;