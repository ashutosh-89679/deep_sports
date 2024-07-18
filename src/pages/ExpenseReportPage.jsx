import React, { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import IMAGES from "../images";
import { Chart } from "react-google-charts";
import useStore from '../store/index.jsx';
import { toast } from "react-toastify";
import FilterContainer from "../components/filters/ExpenseReportFilter.jsx";


export const CommonChart = React.memo((Data , Name) => {
    let data = [
      [Name, 'Amount'],
      ...Object.values(Data).flat().map(item => [item.Name, Number(item.Amount)])
    ];
  
    data = data.sort((a, b) => b[1] - a[1]);
  
    const options = {
      legend: {
        position: 'right',
        alignment: 'center',
        textStyle: {
          fontSize: 15
        }
      },
      chartArea: {
        left: '10%', // Adjust left padding
        top: '10%', // Adjust top padding
        width: '80%', // Adjust width
        height: '80%' // Adjust height
      },
      hAxis: {
        textStyle: {
          fontSize: 13
        }
      }
    };
     
    return <Chart
    chartType="PieChart"
    width="100%"
    height="250px"
    data={data}
    options={options}
  />;
  });

const ExpenseReportPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [IsActionBarVisible, setIsActionBarVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Category");
  const [data, setData] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableData, setTableData] = useState(null);
  const { ExpenseReportRequestBody } = useStore();
  const [expenseReportRequestBody1 , setExpenseReportRequestBody] = useState([]);
  const [expenseCategoryRequestBody1 , setExpenseCategoryRequestBody] = useState([]);



  useEffect(() => {
    let ExpenseReportRequestBodyOg = ExpenseReportRequestBody
    setExpenseReportRequestBody(ExpenseReportRequestBodyOg);
    setExpenseCategoryRequestBody(ExpenseReportRequestBodyOg);
    setCurrentPage(1);
  }
  , [ExpenseReportRequestBody]) 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", backgroundColor: "black", color: "white", borderRadius: "16px"}}
        onClick={onClick}
      />
    );
}

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", backgroundColor: "black", color: "white", borderRadius: "10px" }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  const getData = async () => {
    try {
      const res = await axios.post(
        "https://aarnainfra.com/ladder2/client/office_expense/expenseReportApi.php",
        expenseCategoryRequestBody1
      );

      setData(res?.data || []);
      setCategoryData(res?.data?.category || []);
      // console.log(res?.data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [expenseCategoryRequestBody1]);

  useEffect(() => {
    getData();
  }, []);

  const formatNumber = (number) => {
    if (number >= 10000000) {
      return Math.floor(number / 10000000 * 10) / 10 + " Cr";
    } else if (number >= 100000) {
      return Math.floor(number / 100000 * 10) / 10 + " L";
    } else if (number >= 1000) {
      return Math.floor(number / 1000 * 10) / 10 + " K";
    } else {
      return number?.toString();
    }
};  

  // code to fetch data 

  const fetchData = async () => {

    try {
      const res = await axios.post(
        `https://aarnainfra.com/ladder2/client/office_expense/expenseReportTable.php?page=${currentPage}`,
        expenseReportRequestBody1
      );
      if (currentPage === 1) {
        setTotalCount(res?.data[0]?.count);
      }
      setTableData(res?.data);

    } catch (err) {
      console.log(err)
    }
  };
  
  // UseEffect for initial data fetching
  useEffect(() => {
    fetchData();
  }, [currentPage , expenseReportRequestBody1]);


  return (
    <>
      <Header />
      <main className="flex gap-5">
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
              <div className="py-3 pl-2  border-b border-b-black relative flex gap-2 flex-1 ">
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

                  <div className="mt-1 flex justify-center">
                    <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                      <li className=" focus-within:z-10 cursor-pointer">
                        <a
                          className={`inline-block w-full p-3  ${
                            activeTab === "Category"
                              ? "bg-[#9A55FF] text-white"
                              : "bg-gray-200 text-gray-900"
                          } border-r-black border-gray-200  rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none `}
                          onClick={() => handleClick("Category")}
                        >
                          Category
                        </a>
                      </li>
                      <li className="focus-within:z-10 cursor-pointer">
                        <a
                          className={`inline-block w-full p-3 ${
                            activeTab === "Distribution"
                              ? "bg-[#9A55FF] text-white"
                              : "bg-gray-200 text-gray-900"
                          } border-r border-gray-200 rounded-e-lg   focus:ring-4 focus:ring-blue-300 focus:outline-none `}
                          onClick={() => handleClick("Distribution")}
                        >
                          Distribution
                        </a>
                      </li>
                    </ul>
                  </div>


              </div>
            </>
          )}

          {/* Category tab  */}

          <div className={`${activeTab === "Category" ? "block" : "hidden"}`}>
            <div
              className={` mt-3 mb-7 mr-2 w-[100%]`}
            >

              <div><p className="text-lg ml-4 font-medium">Categories wise expense</p></div>

      <table className="w-[100%] select-none mt-3	 p-2 border border-black rounded-tl-lg ">
        <thead className="h-14 bg-[#F7F8FF] text-[#9A55FF] border-b">
        <tr className="text-sm  h-10 ">
          <th className=" border-r border-r-[#0e0e11]">
            Name
          </th>
        {categoryData.length > 0 && (
        categoryData.map((item, index) => {
          return (
        <th className=" border-black border">
        {item.Name}
        </th>
            );
          })
        )}
        {categoryData.length <= 0 && (
            <td className=" text-center  font-bold border border-[#68686a]">
            No Data
          </td>
          )} 
        </tr>
        </thead>
        <tbody className=" bg-white">
          <tr className="text-[#595959] text-sm select-none h-16 rounded-lg">
            <td className=" text-center  font-bold border border-[#68686a]">
              AMOUNT
            </td>
          {categoryData.length > 0 && (
          categoryData.map((item, index) => {
            return (
            <td className=" items-center font-medium text-center text-[16px] border-r border-black" >
              ₹  {formatNumber(item.Amount.toLocaleString())} 
            </td>
              );
            })
          )} 

          {categoryData.length <= 0 && (
            <td className=" text-center  font-bold border border-[#68686a]">
            No Data
          </td>
          )} 
          </tr>
        </tbody>
      </table>

               
            </div>
            <div className={`flex flex-1 select-none justify-center bg-white flex-row flex-wrap`}>
    <div className="w-1/3">
        <p className="text-center text-lg border-b mb-2 font-medium">Category wise expense</p>
        <div className="border-r items-center">
            {data && data.category.length > 0 ? (
                <CommonChart Data={data.category} Name="Category" />
            ) : (
                <div className="text-center mt-11 font-bold">No Specific Data Found</div>
            )}
        </div>
    </div>
    <div className="w-1/3">
        <p className="text-center text-lg border-b mb-2 font-medium">Type wise expense</p>
        <div className="border-r items-center">
            {data && data.type.length > 0 ? (
                <CommonChart Data={data.type} Name="Type" />
            ) : (
                <div className="text-center mt-11 font-bold">No Specific Data Found</div>
            )}
        </div>
    </div>
    <div className="w-1/3">
        <p className="text-center text-lg border-b mb-2 font-medium">Location wise expense</p>
        <div className="items-center">
            {data && data.location.length > 0 ? (
                <CommonChart Data={data.location} Name="Location" />
            ) : (
                <div className="text-center mt-11 font-bold mb-11">No Specific Data Found</div>
            )}
        </div>
    </div>
</div>

          </div>
          {/* Category tab end */}

         {/* Distribution tab  */}
          <div
            className={`mt-2 rounded-lg ${activeTab === "Distribution" ? "block" : "hidden"}`}
          >
            <table className="w-full select-none p-2 rounded-lg">
            <thead className="h-14 bg-[#F7F8FF] text-[#9A55FF]">
                  <tr className=" text-sm border border-[#212529]">
                    <th className="text-left pl-2 font-medium">Name</th> 
                    <th className=" font-medium">Base Salary</th>
                    <th className="font-medium">Advance  Salary</th>
                    <th className="font-medium">Incentive</th>
                    <th className="font-medium">Bonus</th>
                    <th className="font-medium">Wage</th>
                    <th className="font-medium">Other Expenses</th>
                    <th className="font-medium">Operational Cost</th>
                  </tr>
                   </thead>
                   <tbody className=" bg-white text-[#595959]">
                {tableData && tableData[0]?.count === 0 ? (
              <tr className="text-center">
                <td colSpan="9" className="text-center py-8"> 
                  <p className="text-sm mt-2">No data found</p> 
                </td>
              </tr>
            ) : (
              tableData?.map((item, index) => {
            if (currentPage === 1 && index === 0) {
              // console.log(item);
            } else {
            return (
                  <tr className="text-sm select-none	 border-b h-12">
                    <td className="text-left pl-2 font-medium">   {item.user_name}</td>
                    <td className="text-center font-medium">₹  {formatNumber(item.Base_salary)}</td>
                    <td className="text-center font-medium">₹  {formatNumber(item.Advance_salary)}</td>
                    <td className="text-center font-medium">₹  {formatNumber(item.Incentive)}</td>
                    <td className="text-center font-medium">₹  {formatNumber(item.Bonus)}</td>
                    <td className="text-center font-medium">₹  {formatNumber(item.Wage)}</td>
                    <td className="text-center font-medium">₹  {formatNumber(item.Other_expenses)}</td>
                    <td className="text-center font-medium">₹  {formatNumber(item.Operational_cost)}</td>
                  </tr>
            );
            }
            })
            )}
                </tbody>

                </table>


                <div className="flex  select-none	 justify-between items-center py-4 mr-4">
                               <p className=" text-xs ml-10 text-gray-600">{totalCount} Rows in total</p>
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
          </div>
        {/* Distribution tab end */}

        </section>
      </main>
    </>
  );
};

export default ExpenseReportPage