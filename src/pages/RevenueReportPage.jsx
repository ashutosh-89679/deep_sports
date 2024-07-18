import React, { useEffect, useState, useRef, useContext } from "react";
import IMAGES from "../images";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { Chart } from "react-google-charts";
import FilterContainer from "../components/RevenueReportPage/FilterContainer";
import useStore from "../store/index.jsx";



const formatNumber = (number) => {
  if (number >= 10000000) {
    return Math.floor(number / 10000000 * 10) / 10 + " Cr.";
  } else if (number >= 100000) {
    return Math.floor(number / 100000 * 10) / 10 + " L";
  } else if (number >= 1000) {
    return Math.floor(number / 1000 * 10) / 10 + " K";
  } else {
    return number?.toString();
  }
};

export const CommonChart = React.memo((Data , Name) => {
  let data = [
    [Name, 'Net Revenue'],
    ...Object.values(Data).flat().map(item => [item.name, Number(item.net_revenue)])
  ];

  data = data.sort((a, b) => b[1] - a[1]);

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
      width: '100%',
      height: '90%'
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
  height="300px"
  data={data}
  options={options}
/>;
});


const RevenueReportPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [IsActionBarVisible, setIsActionBarVisible] = useState(true);
  const [data, setData] = useState(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const { fetchRevenueGraphData , revenueGraphData , fetchRevenueSampleData , revenueSampleData , resetAndFetchData } = useStore();
  const [graphVisState, setGraphVisState] = useState('Company');

  const [graphData, setGraphData] = useState([]);

  //code to update the graph data from store
  useEffect(() => {
    fetchRevenueGraphData();
  }, [fetchRevenueGraphData]);

  useEffect(() => {
    if (revenueGraphData !== null) {
      setGraphData(revenueGraphData);
    }
  }, [revenueGraphData, setGraphData, graphData]);

  useEffect(() => {
    fetchRevenueSampleData();
  }, [fetchRevenueSampleData]);

  useEffect(() => {
    if (revenueSampleData !== null) {
      setData(revenueSampleData);
    }
  }, [revenueSampleData, setData, data]);

  useEffect(() => {
    resetAndFetchData();
  }, []);
  

  const handleClick = (state) => {
    setGraphVisState(state);
  }
  

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
            <div className="bg-[#F8F8F8] rounded-md py-3 pl-3 relative flex border-b ">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFiltersVisible(!isFiltersVisible);
                }}
                src={IMAGES.FilterIcon}
                alt="filter icon"
                className="cursor-pointer"
              />
             
                <FilterContainer
                  displayProperty={isFiltersVisible ? "block" : "none"}
                />
             
            </div>
          )}

          <div className="p-4 bg-[#F8F8F8] select-none">

            <div className="flex w-[100%]  justify-around flex-1 flex-row flex-wrap gap-1">

                    <div className="w-[19%]">
                      <div className="shadow relative mt-3 bg-white card rounded-xl px-4 h-[160px] flex flex-col justify-center text-center w-full">
                          <p className="text-[26px] text-black font-bold leading-none mt-3 pb-2">
                              {formatNumber(data?.total_sales) || 0}
                          </p>
                          <p className="text-black text-sm font-semibold border-b border-b-black pb-2">
                              Developer Revenue - Pre sale
                          </p>
                          <div className="flex flex-col items-center justify-center">
                              <p className="text-[26px] text-black font-bold leading-none mt-3">
                                  {formatNumber(data?.actual_sales) || 0}
                                  <span className="text-green-500 text-[13px] pl-1 mt-2">
                                  {data?.actual_sales && data?.total_sales ? 
                                    `(${((data.actual_sales / data.total_sales) * 100).toFixed(1)}%)` : 
                                    "0"}
                                  </span>
                              </p>
                              <p className="text-black text-sm font-semibold mt-2">
                                  Net Sales
                              </p>
                          </div>
                      </div>
                    </div>

                    <div className="w-[19%]">
                      <div className="shadow relative mt-3 bg-white card rounded-xl px-4 h-[160px] flex flex-col justify-center text-center w-full">
                          <p className="text-[26px] text-black font-bold leading-none mt-3 pb-2">
                              {formatNumber(data?.gross_revenue) || 0}
                          </p>
                          <p className="text-black text-sm font-semibold border-b border-b-black pb-2">
                          LN Gross Revenue
                          </p>
                          <div className="flex flex-col items-center justify-center">
                              <p className="text-[26px] text-black font-bold leading-none mt-3">
                                  {formatNumber(data?.ln_net_actual) || 0}
                                  <span className="text-green-500 text-[13px] pl-1 mt-2">
                                  {data?.ln_net_actual && data?.gross_revenue ? 
                                  `(${((data.ln_net_actual / data.gross_revenue) * 100).toFixed(1)}%)` : 
                                  "0"}
                                  </span>
                              </p>
                              <p className="text-black text-sm font-semibold mt-2">
                              LN Net Revenue
                              </p>
                          </div>
                      </div>
                    </div>

                    <div className="w-[19%]">
                      <div className="shadow relative mt-3 bg-white card rounded-xl px-4 h-[160px] flex flex-col justify-center text-center w-full">
                          <p className="text-[26px] text-black font-bold leading-none mt-3 pb-2">
                              {formatNumber(data?.average_brokerage) + " %" || 0}
                          </p>
                          <p className="text-black text-sm font-semibold border-b border-b-black pb-2">
                            Pre sale Brokerage
                          </p>
                          <div className="flex flex-col items-center justify-center">
                              <p className="text-[26px] text-black font-bold leading-none mt-3">
                                  {data?.actual_average_brokerage +  " %" || 0}
                              </p>
                              <p className="text-black text-sm font-semibold mt-2">
                                  Net Brokerage
                              </p>
                          </div>
                      </div>
                    </div>

                    <div className="w-[19%]">
                      <div className="shadow relative mt-3 bg-white card rounded-xl px-4 h-[160px] flex flex-col justify-center text-center w-full">
                          <p className="text-[26px] text-black font-bold leading-none mt-3 pb-2">
                              {formatNumber(data?.in_collection) || 0}
                          </p>
                          <p className="text-black text-sm font-semibold border-b border-b-black pb-2">
                          Collection In Progress
                          </p>
                          <div className="flex flex-col items-center justify-center">
                              <p className="text-[26px] text-black font-bold leading-none mt-3">
                                  {formatNumber(data?.net_revenue) || 0}
                                  <span className="text-green-500 text-[13px] pl-1 mt-2">
                                  {data?.net_revenue && data?.ln_net_actual ? 
                                  `(${((data.net_revenue / data.ln_net_actual) * 100).toFixed(1)}%)` : 
                                  "0"}
                                  </span>
                              </p>
                              <p className="text-black text-sm font-semibold mt-2">
                              Collected Amount
                              </p>
                          </div>
                      </div>
                    </div>

                    <div className="w-[19%]">
                      <div className="shadow relative mt-3 bg-white card rounded-xl px-4 h-[160px] flex flex-col justify-center text-center w-full">
                          <p className="text-[26px] text-black font-bold leading-none mt-3 pb-2">
                              {formatNumber(data?.total_cashback) || 0}
                          </p>
                          <p className="text-black text-sm font-semibold border-b border-b-black pb-2">
                          Total Cashback 
                          </p>
                          <div className="flex flex-col items-center justify-center">
                              <p className="text-[26px] text-black font-bold leading-none mt-3">
                                  {formatNumber(data?.total_cancel) || 0}
                              </p>
                              <p className="text-black text-sm font-semibold mt-2">
                              Cancellation
                              </p>
                          </div>
                      </div>
                    </div>

            </div>

            <div className="flex gap-2 my-7 border justify-between rounded-lg w-[100%] select-none">
              
            <div className="w-[17%] ">
            <div className="md:flex mt-12 ml-8">
                   <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0 w-[150px] bg-slate-200 rounded-lg p-4">
                     <li className={graphVisState === 'Company' ? 'shadow-3xl' : ''}>
                       <a  onClick={() => handleClick('Company')} className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${graphVisState === 'Company' ? 'text-white bg-slate-500 active dark:bg-slate-800' : 'hover:text-gray-900 bg-gray-50 hover:bg-gray-100 '}`}>
                         Company
                       </a>
                     </li>
                     <li className={graphVisState === 'Branch' ? 'shadow-3xl' : ''}>
                       <a  onClick={() => handleClick('Branch')} className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${graphVisState === 'Branch' ? 'text-white bg-slate-500 active dark:bg-slate-800' : 'hover:text-gray-900 bg-gray-50 hover:bg-gray-100 '}`}>
                         Branch
                       </a>
                     </li>
                     <li className={graphVisState === 'Developer' ? 'shadow-3xl' : ''}>
                       <a  onClick={() => handleClick('Developer')} className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${graphVisState === 'Developer' ? 'text-white bg-slate-500 active dark:bg-slate-800' : 'hover:text-gray-900 bg-gray-50 hover:bg-gray-100 '}`}>
                         Developer
                       </a>
                     </li>
                     <li className={graphVisState === 'Project' ? 'shadow-3xl' : ''}>
                       <a  onClick={() => handleClick('Project')} className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${graphVisState === 'Project' ? 'text-white bg-slate-500 active dark:bg-slate-800' : 'hover:text-gray-900 bg-gray-50 hover:bg-gray-100'}`}>
                         Project
                       </a>
                     </li>
                   </ul>
                 </div>
            </div>
           


              <div className=" mt-1  mb-1 mr-1 w-[80%]">
              
                  <div className="flex-1 justify-center shadow border border-[#D9D9D9] bg-white rounded-lg py-6 px-3 ">
                    <p className="text-[#202020] font-medium text-center">{graphVisState} (Net Revenue)</p>
                    <div className="flex justify-center mt-5 items-center">
                    <div className="flex w-[500px] ms-0">
                    {graphVisState === 'Company' && graphData.COMPANY && (
                      <CommonChart Data={graphData.COMPANY} Name="Company" />
                    ) }
                    {graphVisState === 'Branch' && graphData.BRANCH && (
                    <CommonChart Data={graphData.BRANCH} Name="Branch" />
                    )}
                    
                    {graphVisState === 'Developer' && graphData.DEVELOPER && (
                      <CommonChart Data={graphData.DEVELOPER} Name="Developer" />
                    )}
                    
                    {graphVisState === 'Project' && graphData.PROJECT && (
                      <CommonChart Data={graphData.PROJECT} Name="Project" />
                    ) }
                  </div>
                    </div>
                  </div>
                    
              </div>
            </div>

               {/*    <div className="flex gap-5 my-7">
                  {graphData.COMPANY && (
                  <div className="flex-1 justify-center shadow border border-[#D9D9D9] bg-white rounded-lg py-6 px-3 max-w-[615px]">
                    <p className="text-[#202020] font-medium">Company (Net Revenue)</p>
                    <div className="flex justify-center mt-5 items-center">
                      <div className="flex  w-full ms-0">
                        <CommonChart Data={graphData.COMPANY ? graphData.COMPANY : []} Name="Company" />
                      </div>
                    </div>
                  </div>
                    )}

            {graphData.BRANCH && (
              <div className="flex-1 justify-center	shadow border border-[#D9D9D9] bg-white rounded-lg py-6 px-3 max-w-[605px]">
                <p className="text-[#202020] font-medium ">Branch (Net Revenue)</p>
                <div className=" justify-center items-center">
                  <div className="mt-12 max-w-40">
                  <CommonChart Data={graphData && graphData.BRANCH ? graphData.BRANCH : []} Name="Branch" />
                  </div> 
                </div>
              </div>

            )}

                  </div> */}


           {/*  <div className="flex gap-5 my-7">

            {graphData.DEVELOPER && (
              <div className="flex-1 justify-center	shadow border border-[#D9D9D9] bg-white rounded-lg py-4 px-4 max-w-[605px]">
                <p className="text-[#38424B] font-medium text-[18px]">
                  Developer (Net Revenue)
                </p>
               <div className=" w-full max-w-40 mt-12">
                  <CommonChart Data={graphData && graphData.DEVELOPER ? graphData.DEVELOPER : []} Name="Developer" />
                </div> 
              </div>
            )}

            {graphData.PROJECT && (
              <div className="flex-1 shadow border py-[18px] px-6 border-[#D9D9D9] bg-white rounded-lg max-w-[605px]">
                <p className="text-[18px] font-medium">Project (Net Revenue)</p>
                   <div className=" self-center mt-12 max-w-40">
                    <CommonChart Data={graphData && graphData.PROJECT ? graphData.PROJECT : []} Name="Project" />
                  </div> 
              </div>
            )}

            </div> */}



          </div>
        </section>
      </main>
    </>
  );
};

export default RevenueReportPage;