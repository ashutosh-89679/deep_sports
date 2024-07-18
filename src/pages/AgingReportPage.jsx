import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import IMAGES from "../images";
import FilterContainer from "../components/filters/FilterContainer";
import useStore from '../store/index.jsx';
import { Chart } from 'react-google-charts';


export const TopAccountReached = ({ graphData }) => {

  const data = [
    ['Developer', 'Avg Receive Days'],
    ...(Array.isArray(graphData?.ascending) ? graphData.ascending.map(item => [
      item.company_name,
      Number(item.avg_receive_days)
    ]) : [])
  ];


  const options = {
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        fontSize: 13
      }
    },
    chartArea: {
      left: 0,
      top: 0,
      width: '85%',
      height: '90%'
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width="100%"
      height="300px"
    />
  );
};


export const TopAccountDelayed = ({ graphData }) => {
console.log(graphData);
  const data = [
    ['Developer', 'Avg Delayed Days'],
    ...(Array.isArray(graphData?.descending) ? graphData.descending.map(item => [
      item.company_name,
      Number(item.avg_receive_days)
    ]) : [])
  ];

  const options = {
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        fontSize: 13
      }
    },
    chartArea: {
      left: 0,
      top: 0,
      width: '90%',
      height: '90%'
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width="100%"
      height="300px"
    />
  );
};

const AgingReportPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [IsActionBarVisible, setIsActionBarVisible] = useState(true);
  const [data, setData] = useState(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [dataGraph, setGraphData] = useState([]);
  const [AgingRequestBody1 , setAgingRequestBody] = useState([]);
  // const [data, setData] = useState([]);

  const { AgingRequestBody } = useStore();


  const currentDate = new Date();


  useEffect(() => {
    //console.log(AgingRequestBody);
    let AgingRequestBody1 = AgingRequestBody
    setAgingRequestBody(AgingRequestBody1)
    setCurrentPage(1);
  }
  , [AgingRequestBody]) 

/*   useEffect(() => {
    if (sortByRefAgingData !== null ) {
      let updatedRequest = {...AgingRequestBody1}; 
      if (sortByRefAgingData.typeName === "expected_date_sort_asc") {
        updatedRequest.expected_date_sort_asc = "True";
        delete updatedRequest.max_age_sort;
      } else if (sortByRefAgingData.typeName === "max_age_sort") {
        updatedRequest.max_age_sort = "True";
        delete updatedRequest.expected_date_sort;
      }
      else if (sortByRefAgingData.typeName === "invoice_raise_sort") {
        updatedRequest.invoice_raise_sort = "True";
        delete updatedRequest.expected_date_sort;
        delete updatedRequest.max_age_sort;
      }
     // console.log(updatedRequest);
      setAgingRequestBody(updatedRequest); 
    }
  }, [sortByRefAgingData]); */


  function sortData(type) {
    let updatedRequest1 = {...AgingRequestBody1}; 
    if (type === "expected_date_sort_asc") {
      updatedRequest1.expected_date_sort_asc = "True";
      delete updatedRequest1.expected_date_sort_desc;
      delete updatedRequest1.max_age_sort_desc;
      delete updatedRequest1.max_age_sort_asc;
      delete updatedRequest1.invoice_raise_sort_asc;
      delete updatedRequest1.invoice_raise_sort_desc;
    }
    else if (type === "expected_date_sort_desc") {
      updatedRequest1.expected_date_sort_desc = "True";
      delete updatedRequest1.expected_date_sort_asc;
      delete updatedRequest1.max_age_sort_desc;
      delete updatedRequest1.max_age_sort_asc;
      delete updatedRequest1.invoice_raise_sort_asc;
      delete updatedRequest1.invoice_raise_sort_desc;
    }
    else if (type === "invoice_raise_sort_asc") {
      updatedRequest1.invoice_raise_sort_asc = "True";
      delete updatedRequest1.expected_date_sort_asc;
      delete updatedRequest1.expected_date_sort_desc;
      delete updatedRequest1.max_age_sort_desc;
      delete updatedRequest1.max_age_sort_asc;
      delete updatedRequest1.invoice_raise_sort_desc;
    }
    else if (type === "invoice_raise_sort_desc") {
      updatedRequest1.invoice_raise_sort_desc = "True";
      delete updatedRequest1.expected_date_sort_asc;
      delete updatedRequest1.expected_date_sort_desc;
      delete updatedRequest1.max_age_sort_desc;
      delete updatedRequest1.max_age_sort_asc;
      delete updatedRequest1.invoice_raise_sort_asc;
    }
    else if (type === "max_age_sort_desc") {
      updatedRequest1.max_age_sort_desc = "True";
      delete updatedRequest1.expected_date_sort_asc;
      delete updatedRequest1.expected_date_sort_desc;
      delete updatedRequest1.invoice_raise_sort_asc;
      delete updatedRequest1.invoice_raise_sort_desc;
    }
    else if (type === "max_age_sort_asc") {
      updatedRequest1.max_age_sort_asc = "True";
      delete updatedRequest1.max_age_sort_desc;
      delete updatedRequest1.expected_date_sort_asc;
      delete updatedRequest1.expected_date_sort_desc;
      delete updatedRequest1.invoice_raise_sort_asc;
      delete updatedRequest1.invoice_raise_sort_desc;
    }
    setAgingRequestBody(updatedRequest1); 
  //  console.log(type);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

/*   if (dataGraph.length > 0) {
    console.log(dataGraph);
  } */
  const getGraphData = async () => {
    try {
      const res = await axios.get(
        "https://aarnainfra.com/ladder2/client/expense/agingGraphApi.php"
      );
      setGraphData(res?.data || []);
     // console.log(res?.data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    getGraphData();
  }, []);

  useEffect(() => {
   // console.log("from use",AgingRequestBody1);
    const fetchData = async () => {
      setLoading(true);
      axios
        .post(
          `https://aarnainfra.com/ladder2/client/expense/aging2.php?page=${currentPage}` , AgingRequestBody1
        )
        .then((res) => {
          if (currentPage === 1) {
            setTotalCount(res?.data[0]?.count);
          }
         // console.log(res?.data);
          setData(res?.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };

    fetchData();
  }, [currentPage , AgingRequestBody1]);

  function getDiff(startDateStr, endDateStr) {
    // Convert strings to Date objects
    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);
    
    // Calculate the difference in milliseconds
    var diffInMilliseconds = startDate - endDate;
    
    // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
    var diffInDays = Math.abs(diffInMilliseconds / (1000 * 60 * 60 * 24));
    
    return diffInDays;
}


function calculateDays(date) {
  // Convert the given date to a Date object
  var givenDate = new Date(date);
  
  // Get the current date
  var currentDate = new Date();
  
  // Calculate the difference between the two dates in milliseconds
  var difference = currentDate - givenDate;
  
  // Convert the difference from milliseconds to days
  var days = Math.floor(difference / (1000 * 60 * 60 * 24));
  
  // Check if the given date is in the future
  if (days < 0) {
      return   " Upcoming in " + Math.abs(days) + " Days";
  } else {
      return  "Delayed by " + days + " Days";
  }
}


const convertAmount = (number) => {
  if (isNaN(number)) {
    return;
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
};


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
          <div className="bg-white w-full overflow-scroll overflow-x-auto">
              <table className="w-full select-none">
                <thead>
                  <tr className="text-[#212529] text-sm border-b border-b-[#212529] h-16  ">
                    <th className=" font-medium">Invoice No.</th>
                    <th className=" font-medium">Company</th> 
                    <th className=" font-medium w-8">Amount</th>
                    <th className="font-medium">Project</th>
                    <th className="font-medium  mt-3 relative">
                      Invoice <br /> Raise Date
                      <div className=" flex flex-col absolute right-0 top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("invoice_raise_sort_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("invoice_raise_sort_asc")}></i>
                         </div>
                    </th>
                    <th className="font-medium  mt-3 relative">
                      Expected <br /> Recv Date
                      <div className=" flex flex-col absolute right-[15%] top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("expected_date_sort_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("expected_date_sort_asc")}></i>
                         </div>
                    </th>
                    <th className="font-medium relative">
                       Aging <br />days
                      <div className=" flex flex-col absolute right-[4%] top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("max_age_sort_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("max_age_sort_asc")}></i>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
            {data && data[0]?.count === '0' ? (
              <tr className="text-center">
                <td colSpan="9" className="text-center py-8"> 
                  <img src={IMAGES.NoData} alt="No Data" className="w-9 mx-auto" /> 
                  <p className="text-sm mt-2">No data found</p> 
                </td>
              </tr>
            ) : (
              data?.map((item, index) => {
            if (currentPage === 1 && index === 0) {
              // console.log(item);
            } else {
        return (
          <tr key={index} className="h-14 border-b border-b-[#DEE2E6]">
            <td className="text-[#2F579A] font-medium text-sm text-center">
              {item?.invoice_number}
            </td>
            <td className="text-[#595959] text-sm font-medium text-center max-w-[120px]">
              {item?.company_name}
            </td>
            <td className="text-[#2F579A] font-medium text-sm text-center">
              {convertAmount(item?.invoice_value)}
            </td>
            <td className="text-[#595959] text-sm font-medium text-center max-w-[100px] text-wrap">
              {item?.project_name}
            </td>
            <td className="text-[#595959] text-sm font-medium text-center">
              {new Date(item?.submit_date).toLocaleDateString("en-US", {
                year: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </td>
            <td className="text-[#595959] text-sm font-medium text-center">
              {new Date(item?.expected_date).toLocaleDateString("en-US", {
                year: "2-digit",
                month: "short",
                day: "numeric",
              })}
              <br />
              <span className="text-[#E60000] text-xs font-medium">
                {           
                  calculateDays(item?.expected_date)
                }

              </span>
            </td>
            <td className="text-[#595959] text-sm font-medium text-center">
              {item?.days_interval} Days
            </td>
          </tr>
        );
      }
    })
  )}
</tbody>

              </table>
            

              <div className="flex justify-between items-center py-4 mr-4">
  <p className=" text-xs ml-10 text-gray-600">{totalCount} Invoices in total</p>
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

          <div className="flex flex-1 bg-white max-h-[350px] w-[100%] border-t border-gray">
            {dataGraph && dataGraph.length != 0 && (
              <>
                <div className="ml-[10%] w-[50%] mt-5">
                  <h4>Top Developers Invoices Received  </h4><br />
                  <TopAccountReached graphData={dataGraph} />
                </div>
            
                <div className="mr-[10%] w-[50%] mt-5">
                  <h4>Top Developers Invoice's Delayed (in days) </h4><br />
                  <TopAccountDelayed graphData={dataGraph} />
                </div>
              </>
            )}
          </div>



        </section>
      </main>
    </>
  );
};

export default AgingReportPage;
