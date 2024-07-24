import React, { useEffect, useState,useContext  , useRef } from "react";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import IMAGES from "../images";
import { AppContext } from "../../src/context/AppContext";
import { Chart } from "react-google-charts";


export const CommonChart = React.memo(({ Name }) => {
  // Example data for demonstration
  const exampleData = [
    { name: 'Product A', net_revenue: 1200 },
    { name: 'Product B', net_revenue: 800 },
    { name: 'Product C', net_revenue: 1500 },
    { name: 'Product D', net_revenue: 700 },
  ];

  let data = [
    [Name, 'Net Revenue'],
    ...exampleData.map(item => [item.name, Number(item.net_revenue)])
  ];

  data = data.sort((a, b) => b[1] - a[1]);

  const options = {
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        fontSize: 13,
      },
    },
    chartArea: {
      left: 0,
      top: 0,
      width: '100%',
      height: '90%',
    },
    hAxis: {
      textStyle: {
        fontSize: 13,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: '100%', maxHeight: '500px' }}>
      <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
    </div>
  );
});

export const CommonChart2 = React.memo(({  Name }) => {
  // Example data for demonstration
  const exampleData = [
    { month: 'Jan', sales: 1000 },
    { month: 'Feb', sales: 1170 },
    { month: 'Mar', sales: 660 },
    { month: 'Apr', sales: 1030 },
    { month: 'May', sales: 1200 },
    { month: 'Jun', sales: 950 },
    { month: 'Jul', sales: 870 },
  ];

  let data = [
    ['Month', 'Sales'],
    ...exampleData.map(item => [item.month, item.sales])
  ];

  const options = {
    legend: {
      position: 'bottom',
      alignment: 'center',
      textStyle: {
        fontSize: 13,
      },
    },
    chartArea: {
      left: 50,
      top: 20,
      width: '80%',
      height: '70%',
    },
    hAxis: {
      title: 'Month',
      titleTextStyle: {
        fontSize: 14,
        italic: false,
      },
      textStyle: {
        fontSize: 12,
      },
    },
    vAxis: {
      title: 'Sales',
      titleTextStyle: {
        fontSize: 14,
        italic: false,
      },
      minValue: 0,
      format: '#',
      textStyle: {
        fontSize: 12,
      },
    },
    curveType: 'function',
    lineWidth: 2,
    pointsVisible: true,
    pointSize: 5,
    series: {
      0: { color: '#4285F4' },
    },
    chart: {
      title: 'Monthly Sales',
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', maxHeight: '500px' }}>
      <Chart
        chartType="LineChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
    </div>
  );
});

const Dashboard = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { activeUserData } = useContext(AppContext);
    const [data, setData] = useState(null);
    const [transactions, setTransactions] = useState([]);


    useEffect(() => {
      // Fetch data from the API
      const fetchTransactions = async () => {
        try {
          const response = await fetch('https://deepsparkle.net/api/transactions.php');
          const data = await response.json();
          setTransactions(data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
  
      fetchTransactions();
    }, []);
  

    if (!data) {
      return <div>Loading...</div>;
    }

    function getCurrentYearRange() {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      return `${currentYear}-${nextYear}`;
    }

    const cy = getCurrentYearRange();


  return (
    <>
     <main className="flex  h-screen select-none">
       <Sidebar
         isSidebarVisible={isSidebarVisible}
         setIsSidebarVisible={setIsSidebarVisible}
       />
      

<div className="p-4 w-full bg-gray-100 min-h-screen">
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-[20px] font-semibold">Welcome {activeUserData?.user_name} </h1>
    <button className="bg-gray-800 text-white py-2 px-4 rounded-lg">Make report</button>
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Total Credits */}
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg font-medium">Total Credit Amount</h2>
        <p className="text-2xl font-bold">₹ {data.total_credit}</p>
        <div className="flex gap-2">
          <p className="text-green-500">⬆ 17.4%</p>
          <p className="font-semibold text-sm mt-1">{cy}</p>
        </div>
      </div>

      {/* Total Paid */}
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg font-medium">Total Paid</h2>
        <p className="text-2xl font-bold">₹ {data.total_paid}</p>
        <div className="flex gap-2">
          <p className="text-green-500">⬆ 17.4%</p>
          <p className="font-semibold text-sm mt-1">{cy}</p>
        </div>
      </div>

      {/* Total Balance */}
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg font-medium">Total Balance</h2>
        <p className="text-2xl font-bold">₹ {data.total_balance}</p>
        <div className="flex gap-2">
          <p className="text-green-500">⬆ 17.4%</p>
          <p className="font-semibold text-sm mt-1">{cy}</p>
        </div>
      </div>

      {/* Total Quantity */}
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg font-medium">Total Quantity</h2>
        <p className="text-2xl font-bold">{data.total_qty}</p>
        <div className="flex gap-2">
          <p className="text-green-500">⬆ 17.4%</p>
          <p className="font-semibold text-sm mt-1">{cy}</p>
        </div>
      </div>
    </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    {/* Monthly Target Card */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Monthly Target</h2>
      <div className="flex items-center justify-between mt-2">
        <p className="text-2xl font-bold">69.32%</p>
        <p className="text-gray-500">Goal set for the current month</p>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-2xl mt-2">
        <div className="bg-blue-600 h-2 rounded-lg" style={{ width: '69.32%' }}></div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-gray-500">{data.total_paid}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-gray-500">Total Balance</p>
          <p className="text-lg font-bold">{data.total_balance}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Qty</p>
          <p className="text-lg font-bold">{data.total_qty}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Paid</p>
          <p className="text-lg font-bold">{data.total_paid}</p>
        </div>
      </div>
    </div>
    
    {/* Accont balance */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Account balance</h2>
      <div className="mt-2 border-b  h-10 text-lg font-semibold">
      ₹ {data.current_bal}
      </div>
      <div className="p-6 flex gap-2 justify-center w-[100% ]">
          <div className=" h-[100%] justify-center w-[50%] border-r border-black">
            <p className="font-semibold">Total Credit</p>
            <p>₹ {data.total_credit_amount}</p>
          </div>
          <div className=" h-[100%] justify-center w-[50%] ">
          <p className="font-semibold">Total Credit</p>
          <p>₹ {data.total_debit_amount}</p>
          </div>
      </div>

    </div>
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    {/* Location Card with Map */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Location</h2>
      <div id="map" className="mt-2">
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.767181677502!2d73.01384387518075!3d19.248975846519542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bde5e82895ff%3A0x963d6375dc7f901c!2sDEEP%20SPORTS!5e0!3m2!1sen!2sin!4v1721840516974!5m2!1sen!2sin" 
    width="600" 
    height="150" 
    style={{ border: '0' }} 
    allowFullScreen 
    loading="lazy" 
    referrerPolicy="no-referrer-when-downgrade">
  </iframe>
      </div>



    </div>
    
    {/* Most recent transactions */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Recent Transactions</h2>
      <table className="mt-2 w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">Transaction ID</th>
            <th className="py-2">Date</th>
            <th className="py-2">Type</th>
            <th className="py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id} className="text-center py-2 border-b">
              <td>{transaction.transid}</td>
              <td>{transaction.date}</td>
              <td>{transaction.trans_type}</td>
              <td>₹ {transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


  </div>
</div>






      </main>
        </>
  )
}

export default Dashboard