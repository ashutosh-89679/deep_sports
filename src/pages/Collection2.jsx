import React from "react";
import Header from "../components/common/Header";
import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import IMAGES from "../images";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import FilterContainer from "../components/filters/Collection2Filter";
import useStore  from "../store/index.jsx";
import { Chart } from "react-google-charts";


export const ProjectChart = React.memo((graphData) => {

  const data = [
    ['Status', 'Count'],
    ['Not Submitted Yet', parseInt(graphData.graphData[0]?.not_submitted) || 0],
    ['On-time', parseInt(graphData.graphData[0]?.on_time) || 0],
    ['Delayed', parseInt(graphData.graphData[0]?.delayed_raised) || 0],
    ['Delayed submitted', parseInt(graphData.graphData[0]?.delayed_submitted) || 0],
    ['Not Raised', parseInt(graphData.graphData[0]?.not_raised) || 0]
  ];

  const options = {
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        fontSize: 10
      }
    },
    chartArea: {
      width: '100%',
      height: '90%'
    },
    is3D: true
  };

  return (
    <Chart
      width={'100%'}
      height={'300px'}
      chartType="PieChart"
      data={data}
      options={options}
    />
  );
});

const Collection2 = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);   
  const [data, setData] = useState([]);
  const [graphData, setgraphData] = useState([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const {fetchCollection2GraphData , collection2GraphData , collection2RequestBody} = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [collection2RequestBodyMain , setCollection2RequestBodyMain] = useState([]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  /* const getGraphData = async () => {
    axios
      .get(
        "https://aarnainfra.com/ladder/client/collections/collectiongraph.php"
      )
      .then((res) => {
        setgraphData(res?.data);
        console.log(res?.data);
      });
  }; */

  useEffect(() => {console.log(collection2RequestBody)} , 
  [collection2RequestBody])

  useEffect(() => {
    //console.log(AgingRequestBody);
    let collection2RequestBodyMain = collection2RequestBody
    setCollection2RequestBodyMain(collection2RequestBody)
    setCurrentPage(1);
  }
  , [collection2RequestBody]) 

  useEffect(() => {

   const getData = async () => {
    axios
      .post(`https://aarnainfra.com/ladder2/client/collections/collection_2.php?page=${currentPage}` , collection2RequestBodyMain)
      .then((res) => {
        if (currentPage === 1) {
          setTotalCount(res?.data?.data.total_count);
        }
        setData(res?.data);
       // console.log(res?.data);
      });
  }; 
  getData()
}, [currentPage , collection2RequestBodyMain]);


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

  /* useEffect(() => {
    getGraphData();
  }, []); */



/*   useEffect(() => {
    const fetchData = async () => {
      await fetchCollection2Data();
    };
    fetchData();
  }, [fetchCollection2Data]); */

  const sortData = (type) => {
    let updatedRequest1 = {...collection2RequestBodyMain}; 
    if (type === "cp_asc") {
      updatedRequest1.cp_sort_asc = "True";
      delete updatedRequest1.cp_sort_desc;
      delete updatedRequest1.submit_sort_asc;
      delete updatedRequest1.submit_sort_desc;
      delete updatedRequest1.raise_sort_asc;
      delete updatedRequest1.raise_sort_desc;
    }
    else if (type === "cp_desc") {
      updatedRequest1.cp_sort_desc = "True";
      delete updatedRequest1.cp_sort_asc;
      delete updatedRequest1.submit_sort_asc;
      delete updatedRequest1.submit_sort_desc;
      delete updatedRequest1.raise_sort_asc;
      delete updatedRequest1.raise_sort_desc;
    }
    else if (type === "raise_asc") {
      updatedRequest1.raise_sort_asc = "True";
      delete updatedRequest1.cp_sort_asc;
      delete updatedRequest1.cp_sort_desc;
      delete updatedRequest1.submit_sort_asc;
      delete updatedRequest1.submit_sort_desc;
      delete updatedRequest1.raise_sort_desc;
    }
    else if (type === "raise_desc") {
      updatedRequest1.raise_sort_desc = "True";
      delete updatedRequest1.cp_sort_asc;
      delete updatedRequest1.cp_sort_desc;
      delete updatedRequest1.submit_sort_asc;
      delete updatedRequest1.submit_sort_desc;
      delete updatedRequest1.raise_sort_asc;
    }
    else if (type === "submit_desc") {
      updatedRequest1.submit_sort_asc = "True";
      delete updatedRequest1.submit_sort_desc;
      delete updatedRequest1.cp_sort_asc;
      delete updatedRequest1.cp_sort_desc;
      delete updatedRequest1.raise_sort_asc;
      delete updatedRequest1.raise_sort_desc;
    }
    else if (type === "submit_asc") {
      updatedRequest1.submit_sort_desc = "True";
      delete updatedRequest1.submit_sort_asc;
      delete updatedRequest1.cp_sort_asc;
      delete updatedRequest1.cp_sort_desc;
      delete updatedRequest1.raise_sort_asc;
      delete updatedRequest1.raise_sort_desc;
    }
    setCollection2RequestBodyMain(updatedRequest1); 
    console.log(collection2RequestBodyMain);
  }

  useEffect(() => {
    const fetchGraphData = async () => {
      await fetchCollection2GraphData();
    };
    fetchGraphData();
  }, [fetchCollection2GraphData]);


/*   useEffect(() => {
    if (collection2Data !== null) {
     setData(collection2Data);
      console.log(collection2Data);
    }
  }, [collection2Data]); */

  useEffect(() => {
    if (collection2GraphData !== null) {
     setgraphData(collection2GraphData);
    }
  }, [collection2GraphData]);

  return (
    <>
      <Header />
      <main className="flex gap-5">
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 mr-6 relative mt-4">
          <div className="mb-5 flex gap-3">
            <img
              src={IMAGES.FilterIcon}
              alt="filter icon"
              className="cursor-pointer"
              onClick={(e) => {
               
                e.stopPropagation();
                setIsFiltersVisible(!isFiltersVisible);
              }}
            />
            
                <FilterContainer
                  displayProperty={isFiltersVisible ? "block" : "none"} 
                />
             
            <div className="bg-white pl-6 py-2 flex-1 flex items-center gap-4">
              <p className="text-[#5F6C72] text-sm font-bold">
                Collection 2 Report
              </p>
            </div>
          </div>

          <div className="bg-white">
            <table className="w-full">
              <thead>
                <tr className="text-[#212529] text-sm border-b border-b-[#212529] h-16  ">
                  <th className="text-[#212529] font-medium">Invoice Number</th>
                  <th className="text-[#212529] font-medium">Invoice Value</th>
                  <th className="text-[#212529] font-medium">Closure Date</th>
                  <th className="font-medium  mt-3 relative">CP Date
                  <div className=" flex flex-col absolute right-4 top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("cp_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("cp_asc")}></i>
                         </div>
                  </th>
                  <th className="font-medium  mt-3 ">Raised Date</th>
                  <th className="font-medium  mt-3 relative">Raise Gap  
                  <div className=" flex flex-col absolute right-2 top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("raise_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("raise_asc")}></i>
                      </div>
                  </th>
                  <th className="font-medium  mt-3 ">Submit Date</th>
                  <th className="font-medium  mt-3 relative">Submit Gap  
                  <div className=" flex flex-col absolute right-3 top-[25%]">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("submit_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("submit_asc")}></i>
                      </div>
                  </th>
                </tr>
              </thead>
              <tbody>
  {data?.data?.data && data.data.data.length > 0 ? (
    data.data.data.map((item, index) => {
      const raiseDate = new Date(item?.invoice_raise_date);
      const sdrDate = new Date(item?.sdr_date);
      const submitDate = new Date(item?.submit_date);

      const raiseSDRDiff = Math.ceil(Math.abs((sdrDate - raiseDate) / (1000 * 60 * 60 * 24)));
      const raiseSubmitDiff = Math.ceil(Math.abs(( submitDate - raiseDate ) / (1000 * 60 * 60 * 24)));

      return (
        <tr key={index} className="h-14 border-b border-b-[#DEE2E6]">
          <td className="text-[#0222C9] text-sm font-medium text-center">
            {item?.invoice_number || '-'}
          </td>
          <td className="text-[#0222C9] text-sm font-medium text-center">
            {convertAmount(item?.invoice_value) || '-'}
          </td>
          <td className="text-[#595959] text-sm font-medium text-center">
            {item?.closure_date || '-'}
          </td>
          <td className="text-[#595959] text-sm font-medium text-center">
            {item?.sdr_date || '-'}
          </td>
          <td className="text-[#595959] text-sm font-medium text-center">
            {item?.invoice_raise_date || '-'}
          </td>
          <td className="text-[#595959] text-sm font-medium text-center">
            {raiseSDRDiff || 0} Days
          </td>
          <td className="text-[#595959] text-sm font-medium text-center">
            {item?.submit_date || '-'}
          </td>
          <td className="text-[#595959] text-sm font-medium text-center">
            {raiseSubmitDiff || 0} Days
          </td>
        </tr>
      );
    })
  ) : (
    <tr className="text-center">
      <td colSpan="7" className="text-center py-8"> 
        <img src={IMAGES.NoData} alt="No Data" className="w-9 mx-auto" /> 
        <p className="text-sm mt-2">No data found</p> 
      </td>
    </tr>
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

          {/* PIE CHART START */}
          <div
            className="py-5 pl-7 bg-white mt-4 "
          >
            <p className="text-[#202020] text-lg font-medium mt-2">
              Collection 2 Overview
            </p>

            <div className="flex pl-[38px] pr-12 gap-x-2.5 h-[300px] justify-between mt-3">
              <div className=" self-cente pl-5 w-[400px] h-[302px] ">
              {graphData && graphData.length > 0 && (
                  <ProjectChart graphData={graphData} />
                  )}

              </div>
            </div>
          </div>
          {/* PIE CHART END */}
        </section>
      </main>
    </>
  );
};

export default Collection2;
