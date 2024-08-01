import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FinanacePage from "./pages/FinancePage";
import MasterPage from "./pages/MasterPage";
import RevenueReportPage from "./pages/RevenueReportPage";
import AgingReportPage from "./pages/AgingReportPage";
import Collection1 from "./pages/Collection1";
import ActualCashflowReportPage from "./pages/ActualCashflowReportPage";
import Collection2 from "./pages/Collection2";
import ProjectedCashflowReportPage from "./pages/ProjectedCashflowReportPage";
import DelayedCashflowReportPage from "./pages/DelayedCashflowReportPage";
import PerformaInvoice from '../src/components/FinancePage/PerformaInvoice';
import ExpenseTablePage from "./pages/ExpenseTablePage.jsx";
import ExpenseReportPage from "./pages/ExpenseReportPage.jsx";
import CancellationReportPage from "./pages/CancellationReportPage.jsx";
import { useEffect , useState} from "react";
import useStore from "./store";
import Dashboard from "./pages/Dashboard.jsx";
import PcfModal from "./components/FinancePage/PcfModal.jsx";
import CreditForm from "./components/Credit_debit/CreditForm.jsx";
import OrderForm from "./components/Orders/Orders.jsx";
import TransactionForm from "./components/Account/TransactionForm.jsx";


const App = () => {

  const { userDetails } = useStore();


  useEffect(() => {
    const handleBeforeUnload = (e) => {
        // Retrieve userActivities from localStorage
        const userActivities = localStorage.getItem('userActivities');

        // Send userActivities data to the server if it exists
        if (userActivities) {
            // Make a POST request to the server
            fetch('https://aarnainfra.com/ladder2/logs/getLog.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userActivities: userActivities })
            })
            .then(response => {
                // Handle response
                if (response.ok) {
                  //  console.log('Log data sent successfully');
                    // Delete userActivities from localStorage
                    localStorage.removeItem('userActivities');
                } else {
                    console.error('Error sending log data:', response.status);
                }
            })
            .catch(error => {
                // Handle error
                console.error('Error sending log data:', error);
            });
        }

        // Prompt user before leaving the page
        const confirmationMessage = 'Are you sure you want to leave? Changes you made may not be saved.';
        e.preventDefault();
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Remove the event listener on cleanup
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);



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
                key={"finance-route"} 
              />
            } 
          />
          <Route 
            path="/userDashboard" 
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
                key={"Credit-page"} 
              />
            } 
          />
          <Route path="/order" 
          element={
          <ProtectedRoute element={<OrderForm />} key={"Order-page"} />
           } 
          />
          <Route path="/account" 
          element={
          <ProtectedRoute element={<TransactionForm />} key={"Transction-page"} />
           } 
          />
          <Route path="/cancellationReport" 
          element={
          <ProtectedRoute element={<CancellationReportPage />} key={"cancelReport-page"} />
           } 
          />
          <Route 
            path="/expenses" 
            element={
            <ProtectedRoute element={<ExpenseTablePage />} key={"expense-page"} />
           } 
          />
          <Route path="/reports/aging" 
          element={
          <ProtectedRoute element={<AgingReportPage />} key={"aging-report"} />
          } />
          <Route path="/reports/collection1" 
          element={
          <ProtectedRoute element={<Collection1 />} key={"collection1"} />
          } 
          />
          <Route path="/reports/collection2" 
          element={
          <ProtectedRoute element={<Collection2 />} key={"collection2"} />}
          />
          <Route path="/performa-invoice" element={<PerformaInvoice />} />

          <Route path="/pcfmodal" 
           element={
             <ProtectedRoute element={<PcfModal />} key={"pcfmodal"} />
           } 
          />
          <Route
            path="/reports/actual_cashflow"
            element={
            <ProtectedRoute element={<ActualCashflowReportPage />} key={"actual-cashflow"} />}
          />
          <Route
            path="/reports/projected_cashflow"
            element={
            <ProtectedRoute element={<ProjectedCashflowReportPage />} key={"projected-cashflow"} />
              }
          />
          <Route
            path="/reports/delayed_cashflow"
            element={
            <ProtectedRoute element={<DelayedCashflowReportPage />} key={"delayed-cashflow"} />
            }
          />
          <Route
            path="/extras/master"
            element={
              <ProtectedRoute element={<MasterPage />} key={"master-route"} />
              }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
export default App;
