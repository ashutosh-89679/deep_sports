import React, { useEffect, useState,useContext  , useRef } from "react";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import IMAGES from "../images";
import { AppContext } from "../../src/context/AppContext";
import Select from 'react-select'
import DateRangePicker from "../components/common/DateRangePicker";





const Dashboard = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const { activeUserData } = useContext(AppContext);
    const [data, setData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [userOptions , setUserOptions] = useState([]);
    const filterRef = useRef(null);
    const [filterData, setFilterData] = useState({
      user: '',
      startDate: '',
      endDate: ''
    });
    const [daterange , setDaterange] = useState([]);
    
    const toggleFilter = () => setIsOpen(!isOpen);

  // Close the filter if a click is detected outside
  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };


  const handleUserChange = (selectedOption) => {
    setFilterData(prevData => ({
        ...prevData,
        user: selectedOption ? selectedOption.value : ''
    }));
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch data from the first API
          const response1 = await axios.post('https://deepsparkle.net/api/dashboard.php' , filterData);
          setData(response1.data.data[0]);
        } catch (error) {
          console.error('Error fetching data', error);
        }
      };
    
      fetchData();
    }, [filterData]); 

    useEffect(() => {
      const fetchData2 = async () => {
        try{
            // Fetch data from the second API
            const response2 = await fetch('https://deepsparkle.net/api/transactions.php');
            const data2 = await response2.json();
            setTransactions(data2);
                    
            const response3 = await axios.get('https://deepsparkle.net/api/optionsData.php');
            setUserOptions(response3.data);
        } catch (error) {
          console.error('Error fetching data', error);
        }
      }
      fetchData2();
    }, [])

    if (!data) {
      return <div>Loading...</div>;
    }

    function getCurrentYearRange() {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      return `${currentYear}-${nextYear}`;
    }

    const cy = getCurrentYearRange();

    const customStyles = {
      control: (provided) => ({
          ...provided,
          minHeight: '30px', // Decrease the height
          height: '30px', // Set a specific height
      }),
      valueContainer: (provided) => ({
          ...provided,
          padding: '0 8px', // Adjust padding to match the smaller size
      }),
      input: (provided) => ({
          ...provided,
          margin: '0', // Remove any default margin
          fontSize: '12px', // Adjust font size
      }),
      placeholder: (provided) => ({
          ...provided,
          fontSize: '12px', // Adjust font size for placeholder
      }),
      singleValue: (provided) => ({
          ...provided,
          fontSize: '12px', // Adjust font size for selected value
      }),
      dropdownIndicator: (provided) => ({
          ...provided,
          padding: '4px', // Decrease the size of the dropdown indicator
      }),
      clearIndicator: (provided) => ({
          ...provided,
          padding: '4px', // Decrease the size of the clear indicator
      }),
      menu: (provided) => ({
          ...provided,
          fontSize: '12px', // Adjust font size for dropdown options
      }),
      option: (provided) => ({
          ...provided,
          fontSize: '12px', // Adjust font size for individual options
          padding: '8px 12px', // Adjust padding for individual options
          color : 'black'
      }),
  };
  
  const clearfilter = () => {
    setFilterData({
      user: '',
      startDate: '',
      endDate: ''
    })
    setDaterange({startDate : null , endDate: null});
  }

  const searchRecords = () => {
    const startDate = daterange.startDate;
    const endDate = daterange.endDate;

  
    // Set the filter data state
    setFilterData(prevData => ({
      ...prevData,
      startDate: startDate,
      endDate: endDate
    }));


    console.log(filterData)
  }
  


  return (
    <>
     <main className="flex  h-screen select-none">
       <Sidebar
         isSidebarVisible={isSidebarVisible}
         setIsSidebarVisible={setIsSidebarVisible}
       />
      

<div className="p-4 w-full bg-gray-100 min-h-screen">
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-[14px] font-semibold">Welcome {activeUserData?.user_name} </h1>
    <div className="flex gap-2">

    {/* <div>
      <p
        className="bg-gray-800 text-white relative py-2 cursor-pointer text-[14px] px-2 rounded-md"
        onClick={toggleFilter}
      >
        <i className="fa-solid fa-filter"></i>
      </p>
      {isOpen && (
        <div ref={filterRef} className="filter absolute left-[84%]  bg-black w-[180px] text-white p-4 h-[200px] mt-2 rounded-md">
          <p className="text-xs mb-1">Filter User </p>

          <Select
              options={userOptions.data}
              onChange={handleUserChange}
              value={userOptions.data?.find(option => option.value === filterData.user) || null}
              placeholder="user"
              styles={customStyles} 
          />

          <p className="text-xs mb-1 mt-2">Filter Date </p>
          <DateRangePicker value={daterange} setValue={setDaterange} />

          <div className="mt-4 flex justify-end gap-2">
              <div className="border border-white p-1 cursor-pointer rounded-md px-2" onClick={searchRecords}>
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <div className="border border-white p-1 rounded-md cursor-pointer px-2" onClick={clearfilter} >
                <i class="fa-solid fa-rectangle-xmark"></i>
              </div>
          </div>
        </div>

        
      )}
    </div> */}          
    <button className="bg-gray-800 text-white text-[14px] py-2 px-2 rounded-lg">Make report</button>
    </div>
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
    
      {/* Total Credits */}
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg font-medium">Total Credit Amount</h2>
        <p className="text-2xl font-bold">₹ {data.total_credit_amount}</p>
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
  
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
    
      {/* Total Credits */}
       <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg font-medium">Total Credit Amount</h2>
        <p className="text-2xl font-bold">₹ {data.total_credit_amount}</p>
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
          <p className="font-semibold">Total Debit</p>
          <p>₹ {data.total_debit_amount}</p>
          </div>
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
  {transactions.slice(0, 5).map(transaction => (
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