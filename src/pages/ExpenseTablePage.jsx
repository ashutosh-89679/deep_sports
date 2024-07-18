import React, { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import IMAGES from "../images";
import FilterContainer from "../components/filters/ExpenseFilter.jsx";
import useStore from '../store/index.jsx';
import ReactSwitch from 'react-switch';
import UpdateExpense from "./UpdateExpense.jsx";
import { toast } from "react-toastify";

const ExpenseTablePage = () => {
 

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [IsActionBarVisible, setIsActionBarVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isUpdateVisible , setIsUpdateVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [data, setData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [expenseRequestBody1 , setExpenseRequestBody] = useState([]);
  const StatusRef = useRef(null);
  const [StatusPopOverVisible, setStatusPopoverVisible] = useState(false);
  const [filterStatus , setFilterStatus] = useState('');
  const { ExpenseRequestBody } = useStore();
  const [itemState , setItemState] = useState();
  const [checkedItems, setCheckedItems] = useState({});

  const toogleStatusPopOver = () => {
    setStatusPopoverVisible(!StatusPopOverVisible);
  }

  useEffect(() => {
    //console.log(AgingRequestBody);
    let ExpenseRequestBodyOg = ExpenseRequestBody
    setExpenseRequestBody(ExpenseRequestBodyOg)
    setCurrentPage(1);
  }
  , [ExpenseRequestBody]) 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const sortData = (type) => {
    let updatedRequest1 = { ...expenseRequestBody1 };
    
    if (type === "id_sort_desc") {
        updatedRequest1.id_sort_desc = "True";
        delete updatedRequest1.id_sort_asc;
        delete updatedRequest1.date_desc;
        delete updatedRequest1.date_asc;
        delete updatedRequest1.amount_desc;
        delete updatedRequest1.amount_asc;
    } 
    else if (type === "id_sort_asc") {
        updatedRequest1.id_sort_asc = "True";
        delete updatedRequest1.id_sort_desc;
        delete updatedRequest1.date_desc;
        delete updatedRequest1.date_asc;
        delete updatedRequest1.amount_desc;
        delete updatedRequest1.amount_asc;
    } 
    else if (type === "date_desc") {
        updatedRequest1.date_desc = "True";
        delete updatedRequest1.id_sort_asc;
        delete updatedRequest1.id_sort_desc;
        delete updatedRequest1.date_asc;
        delete updatedRequest1.amount_desc;
        delete updatedRequest1.amount_asc;
    }
    else if (type === "date_asc") {
        updatedRequest1.date_asc = "True";
        delete updatedRequest1.id_sort_asc;
        delete updatedRequest1.id_sort_desc;
        delete updatedRequest1.date_desc;
        delete updatedRequest1.amount_desc;
        delete updatedRequest1.amount_asc;
    }
    else if (type === "amount_desc") {
        updatedRequest1.amount_desc = "True";
        delete updatedRequest1.id_sort_asc;
        delete updatedRequest1.id_sort_desc;
        delete updatedRequest1.date_desc;
        delete updatedRequest1.date_asc;
        delete updatedRequest1.amount_asc;
    }
    else if (type === "amount_asc") {
        updatedRequest1.amount_asc = "True";
        delete updatedRequest1.id_sort_asc;
        delete updatedRequest1.id_sort_desc;
        delete updatedRequest1.date_desc;
        delete updatedRequest1.date_asc;
        delete updatedRequest1.amount_desc;
    }
    setExpenseRequestBody(updatedRequest1);    
  };

  const handleStatusFilter = (type , operation) => {
    let updatedStatusRequest = { ...expenseRequestBody1 };
    if(operation == "search" && type !== ''){
      updatedStatusRequest.status = "";
      updatedStatusRequest.status = type;
    } else if(operation == "clear"){
      updatedStatusRequest.status = "";
      setFilterStatus("");
    }
    setExpenseRequestBody(updatedStatusRequest);
  }

  const handleUpdateVisible = (item) => {
    setIsUpdateVisible(true);
    setItemState(item);
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `https://aarnainfra.com/ladder2/client/office_expense/expenseTable.php?page=${currentPage}`,
        expenseRequestBody1
      );
      if (currentPage === 1) {
        setTotalCount(res?.data[0]?.count);
      }
      setData(res?.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  
  // UseEffect for initial data fetching
  useEffect(() => {
    fetchData();
  }, [currentPage, expenseRequestBody1]);

  const handleChange = async (id, val) => {
    console.log(val);
    const checkedValue = val === false ? false : true;
    setCheckedItems(prevState => ({
      ...prevState,
      [id]: checkedValue
    }));
    
  
    if(val === true && id){
      try {
        const AddingformData = new FormData();
        AddingformData.append('expense_id', id);
        AddingformData.append('operation', 'update_status');
        const response = await fetch('https://aarnainfra.com/ladder2/client/office_expense/main.php', {
            method: 'POST',
            body: AddingformData
        });
          toast.success("Approved");
          fetchData()
        
      } catch (error) {
        console.error('Error:', error);
      }
    } else if(val === false && id){
      try {
        const AddingformData = new FormData();
        AddingformData.append('expense_id', id);
        AddingformData.append('operation', 'update_status_false');
        const response = await fetch('https://aarnainfra.com/ladder2/client/office_expense/main.php', {
            method: 'POST',
            body: AddingformData
        });
          toast.success("Not Approved");
          fetchData()
        
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (StatusRef.current && !StatusRef.current.contains(event.target)) {
        setStatusPopoverVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <>
      <Header />
      <main className="flex gap-5 select-none">
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 mr-6 relative mt-4">
          <img
            onClick={() => setIsActionBarVisible(!IsActionBarVisible)}
            src={IMAGES.YellowToggleIcon}
            alt="toggle icon"
            className={`${
              IsActionBarVisible ? "rotate-180" : ""
            } absolute -right-6 top-10 cursor-pointer`}
          />
          {IsActionBarVisible && (
            <>
            <div className="bg-white py-3 pl-4 border-b border-b-black relative flex gap-4   flex-1">
              <img
                className="cursor-pointer"
                onClick={(e) => {
                  //console.log(1);
                  e.stopPropagation();
                  setIsFiltersVisible(!isFiltersVisible);
                }}
                src={IMAGES.FilterIcon}
                alt="filter icon"
              />
              
                <FilterContainer
                  displayProperty={isFiltersVisible ? "block" : "none"}
                />
              
            </div>
            </>
          )}
          <div className="bg-white w-full overflow-scroll overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="h-14 bg-[#F7F8FF] text-[#9A55FF] border-b">
                  <tr className="text-sm border-b border-b-[#212529] h-12">
                  
                  <th className="font-medium  mt-3 relative">
                    Status
                    <div className="flex flex-col absolute right-[-12%] top-[37%] ">
                      <i class="fa-solid fa-filter cursor-pointer" onClick={() => toogleStatusPopOver()}></i>
                      <div ref={StatusRef}  className={`absolute top-8 left-[-9%] h-[130px] w-[200px] bg-white rounded-xl shadow-xl border border-gray-700 ${StatusPopOverVisible ? 'block' : 'hidden'}`}>
                      <select 
                          name="filter" 
                          id="filter"
                          onChange={(e) => setFilterStatus(e.target.value)}
                          value={filterStatus}
                          className="p-2 px-2 border mt-3 w-[170px] rounded-lg"
                        >
                          <option value="">Select Status</option>
                          <option value="N">Not Approved</option>
                          <option value="Y">Approved</option>
                        </select>
                        {filterStatus == '' && <p className=" text-red-700 text-xs">No filter selected.</p>}
                        <div className=" mt-6 ml-12">
                          <button className=" mr-2 border p-1 rounded-lg bg-[#4695da] text-white" onClick={() => handleStatusFilter(filterStatus , 'search')}>Filter</button>
                          <button className="p-1 border rounded-lg bg-[#EA3801] text-white" onClick={() => handleStatusFilter(null , 'clear')}>Clear</button>
                        </div>
                      </div>
                    </div>
                  </th> 
                    <th className=" font-medium">Type</th> 
                    <th className=" font-medium w-8">Category</th>
                    <th className="font-medium">Sub Category</th>
                    <th className="font-medium">
                      Vendor
                    </th>
                    <th className="font-medium">
                      Tansaction Type 
                    </th>
                    <th className="font-medium relative">
                      Date
                      <div className=" flex flex-col absolute right-[4%] top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("date_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("date_asc")}></i>
                      </div>
                    </th>
                    <th className="font-medium relative">Amount
                    <div className=" flex flex-col absolute right-0 top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("amount_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("amount_asc")}></i>
                         </div>
                    </th>
                    <th className="font-medium">Location</th>
                    <th className="font-medium"></th>
                  </tr>
                </thead>
                <tbody className="bg-white text-[#595959]">
                        {data && data[0]?.count === 0 ? (
                          <tr className="text-center">
                            <td colSpan="9" className="text-center py-8">
                              <img src={IMAGES.NoData} alt="No Data" className="w-9 mx-auto" />
                              <p className="text-sm mt-2">No data found</p>
                            </td>
                          </tr>
                        ) : (
                          data?.slice(1).map((item, index) => {
                            return (
                              <tr key={item.id} className="text-sm border-b border-b-[#212529] h-16">
                                <td className="text-center font-medium">
                                  <div>
                                    <ReactSwitch
                                      key={item.id}
                                  checked={item.STATUS === 'Y' ? true : checkedItems[item.id]}
                                  height={20}
                                  width={40}
                                  onChange={(val) => handleChange(item.id, val)}
                                />
                              </div>
                            </td>
                            <td className="text-center font-medium">{item.type}</td>
                            <td className="text-center font-medium">{item.Category}</td>
                            <td className="text-center font-medium">{item.Sub_Category}</td>
                            <td className="text-center font-medium">{item.Merchant}</td>
                            <td className="text-center font-medium">{item.Transaction}</td>
                            <td className="text-center font-medium">{item.Date}</td>
                            <td className="text-center font-medium">₹{item.Amount}</td>
                            <td className="text-center font-medium">{item.Location}</td>
                            <td className="text-center font-medium">
                              <div className="flex items-center gap-1">
                                <span className="cursor-pointer" onClick={() => handleUpdateVisible(item)}>
                                  <img src={IMAGES.Pencil} alt="edit" />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

              </table>
            
              <div className="flex justify-between items-center py-4 mr-4">
                               <p className=" text-xs ml-10 text-gray-600">{totalCount} Expenses in total</p>
                               <ul className="flex gap-1">
                                 <li
                                   onClick={() => paginate(currentPage - 1)}
                                   className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 rounded-xl ${
                                     currentPage === 1
                                       ? "bg-white text-[#686868] cursor-not-allowed"
                                       : "bg-white text-[#686868] cursor-pointer"
                                   }`}
                                 >
                                   <a href="#" className="pt-1">
                                     &lt;
                                   </a>
                                 </li>
                                 
                                 {pageNumbers.map((number) => {
                                   if (
                                     number === 1 ||
                                     number === currentPage - 1 ||
                                     number === currentPage ||
                                     number === currentPage + 1 ||
                                     number === Math.ceil(totalCount / itemsPerPage)
                                   ) {
                                     return (
                                       <li
                                         key={number}
                                         onClick={() => paginate(number)}
                                         className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 rounded-xl ${
                                           currentPage === number
                                             ? "bg-[#9A55FF] text-white cursor-not-allowed"
                                             : "bg-white text-[#686868] cursor-pointer"
                                         }`}
                                       >
                                         <a href="#" className="">
                                           {number}
                                         </a>
                                       </li>
                                     );
                                   } else if (
                                     number === 2 ||
                                     number === Math.ceil(totalCount / itemsPerPage) - 1
                                   ) {
                                     return (
                                       <li
                                         key={number}
                                         className="border border-[#E0E0E0] w-9 h-9 text-center pt-1 cursor-not-allowed rounded-xl"
                                       >
                                         <span className="page-link">...</span>
                                       </li>
                                     );
                                   }
                                   return null;
                                 })}

                                 <li
                                   onClick={() => {
                                     if (currentPage !== Math.ceil(totalCount / itemsPerPage)) {
                                       paginate(currentPage + 1);
                                     }
                                   }}
                                   className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 rounded-xl ${
                                     currentPage === Math.ceil(totalCount / itemsPerPage)
                                       ? "bg-white text-[#686868] cursor-not-allowed"
                                       : "bg-white text-[#686868] cursor-pointer"
                                   }`}
                                 >
                                   <a href="#" className="pt-1">
                                     &gt;
                                   </a>
                                 </li>
                               </ul>
              </div>
             
              {isUpdateVisible && (
                <UpdateExpense onClose={() => { setIsUpdateVisible(false); fetchData(); }} expenseData={itemState} />
              )}

          </div>
        </section>
        


      </main>
    </>
  );
};

export default ExpenseTablePage