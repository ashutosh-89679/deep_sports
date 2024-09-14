import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard.jsx";
import CreditForm from "./components/Credit_debit/CreditForm.jsx";
import OrderForm from "./components/Orders/Orders.jsx";
import TransactionForm from "./components/Account/TransactionForm.jsx";
import useStore from "./store";

const App = () => {
  const { userDetails } = useStore();

  return (
    <AppProvider>
      <ToastContainer autoClose={1000} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute 
                element={<Dashboard />} 
                key={"dashboard-page"} 
              />
            } 
          />
          <Route 
            path="/credit" 
            element={
              <ProtectedRoute 
                element={<CreditForm />} 
                key={"credit-page"} 
              />
            } 
          />
          <Route path="/order" 
            element={
              <ProtectedRoute element={<OrderForm />} key={"order-page"} />
            } 
          />
          <Route path="/account" 
            element={
              <ProtectedRoute element={<TransactionForm />} key={"transaction-page"} />
            } 
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
