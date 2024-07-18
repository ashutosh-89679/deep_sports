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
    {/* Card for Total Orders */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Total Credits</h2>
      <p className="text-2xl font-bold">39,572</p>
      <div className="flex gap-2">
      <p className="text-green-500">⬆ 17.4%</p>
      <p className="font-semibold text-sm mt-1">2021-2022</p>

      </div>

    </div>
    
    {/* Card for Monthly Orders */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Total Orders</h2>
      <p className="text-2xl font-bold">2,294</p>
      <p className="text-red-500">⬇ 3.9%</p>       
    </div>
    
    {/* Card for Monthly Income */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Account</h2>
      <p className="text-2xl font-bold">$98,572</p>
      <p className="text-green-500">⬆ 2.1%</p>
    </div>
    
    {/* Card for Preparing to Ship */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Preparing to Ship</h2>
      <p className="text-2xl font-bold">361</p>
      <p className="text-green-500">⬆ 5.2%</p>
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
        <p className="text-gray-500">2,294</p>
        <p className="text-gray-500">3,000</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-gray-500">Today</p>
          <p className="text-lg font-bold">$6.8k</p>
        </div>
        <div>
          <p className="text-gray-500">Orders</p>
          <p className="text-lg font-bold">164</p>
        </div>
        <div>
          <p className="text-gray-500">Delivered</p>
          <p className="text-lg font-bold">104</p>
        </div>
      </div>
    </div>
    
    {/* Sales Statistics Card with Line Chart */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Sales Statistics</h2>
      <div id="line-chart" className="mt-2">
      <CommonChart2  Name="Company" />
      
      </div>

    </div>
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    {/* Location Card with Map */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-medium">Location</h2>
      <div id="map" className="mt-2">

      <CommonChart  Name="Company" />
      </div>



    </div>
    
    {/* Most Popular Products Card */}
    <div className="bg-white p-4 rounded-2xl shadow-lg">
  <h2 className="text-lg font-medium">The most popular products</h2>
  <table className="mt-2 w-full">
    <thead>
      <tr className="border-b">
        <th className="py-2">Product Name</th>
        <th className="py-2">Price</th>
        <th className="py-2">Units Sold</th>
      </tr>
    </thead>
    <tbody>
      <tr className="text-center py-2 border-b">
        <td>Apple iPhone 13 Pro Max</td>
        <td>$1,600</td>
        <td>99</td>
      </tr>
      <tr className="text-center py-2 border-b">
        <td>Apple MacBook Pro M2</td>
        <td>$1,200</td>
        <td>112</td>
      </tr>
      <tr className="text-center py-2 border-b">
        <td>Apple iPad Pro 12.9</td>
        <td>$899</td>
        <td>84</td>
      </tr>
      <tr className="text-center py-2 border-b">
        <td>Apple Watch Ultra 2</td>
        <td>$799</td>
        <td>72</td>
      </tr>
      <tr className="text-center py-2 border-b">
        <td>Apple AirPods Pro 2</td>
        <td>$249</td>
        <td>95</td>
      </tr>
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