import React, { useEffect, useRef, useState, useMemo } from "react";
import Header from "../components/common/Header";
import IMAGES from "../images";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import Sidebar from "../components/common/Sidebar";
import FilterDropdown from "../components/filters/ProjectedFilter.jsx";

export const PossessionChart = (chartData) => {
  // //console.log(chartData?.chartData[0]);
  const data = {
    labels: ["Top 5 Companies"],
    datasets: [
      {
        label: chartData?.chartData[0]?.name || "No Data",
        data: [45],
        backgroundColor: "#6800FF",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: chartData?.chartData[1]?.name || "No Data",
        data: [20],
        backgroundColor: "#792EFC",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: chartData?.chartData[2]?.name || "No Data",
        data: [25],
        backgroundColor: "#8844FF",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: chartData?.chartData[3]?.name || "No Data",
        data: [25],
        backgroundColor: "#9C63FF",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: chartData?.chartData[4]?.name || "No Data",
        data: [25],
        backgroundColor: "#AD7EFF",
        barThickness: 30,
        borderRadius: 9,
      },
    ],
  };

  // Configuration options for the chart
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        angleLines: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
        beginAtZero: true,
        stacked: true,
        gridLines: {
          drawBorder: false,
          lineWidth: 0.5,
        },
        grid: {
          display: false,
        },
        title: {
          display: false, // Set to false to hide x-axis label
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

const ProjectedCashflowReportPage = () => {
  // sum of month data
  const [monthTotal, setMonthTotal] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const tdRefs = useRef([]);

  const [chartData, setChartData] = useState([]);

  const [isSorted, setIsSorted] = useState(null);

  const getTop5Companies = () => {
    const data = tdRefs?.current?.map((ref) => {
      const obj = {
        id: ref?.getAttribute("data-id"),
        name: ref?.getAttribute("data-com"),
        value: ref?.getAttribute("data-ns"),
      };
      return obj;
    });
    data.sort((a, b) => b.value - a.value);
    setChartData(data);
  };

  const [isActionbarVisible, setIsActionbarVisible] = useState(true);

  // data from the api
  const [data, setData] = useState([]);

  // to store the filtered month
  const [month, setMonth] = useState(null);

  // to store the filtered quarter
  const [quarter, setQuarter] = useState(null);

  // to store the boolean which indicates whether to show full year or not
  const [year, setYear] = useState(false);

  const [search , setSearch] = useState(false);

  const [companyNameArr, setCompanyNameArr] = useState([]);
  // Sidebar State
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [monthArr, setMonthArr] = useState([
    4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3,
  ]);

  // month name to map & create table data
  const [monthName, setMonthName] = useState([
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ]);


  useEffect(() => {
    // Store original values
    const originalMonthArr = monthArr;
    const originalMonthName = monthName;
  
    if (filteredData && year && !month && !quarter) {
      const tempUpdatedMonthNameSet = new Set(); // Use Set to store unique month names
      const tempUpdatedMonthArrSet = new Set(); // Use Set to store unique month numbers
  
      filteredData.forEach(data => {
        Object.entries(data).forEach(([key, value]) => {
          if (key !== "company_id" && key !== "company_name" && !value.every(val => val === 0)) {
            tempUpdatedMonthNameSet.add(key); // Add month name to the set
            tempUpdatedMonthArrSet.add(monthArr[monthName.indexOf(key)]); // Add corresponding month number to the set
          }
        });
      });
  
      // Convert sets to arrays
      const tempUpdatedMonthName = Array.from(tempUpdatedMonthNameSet);
      const tempUpdatedMonthArr = Array.from(tempUpdatedMonthArrSet);
  
      // Update state only if arrays are not empty
      if (tempUpdatedMonthArr.length > 0 && tempUpdatedMonthName.length > 0) {
        setMonthArr(tempUpdatedMonthArr);
        setMonthName(tempUpdatedMonthName);
      }
    } else {
      // If condition is not satisfied, revert to original values
      setMonthArr([4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]);
        setMonthName([
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
          "January",
          "February",
          "March",
        ]);
    }
  }, [filteredData, year, monthName, monthArr]);
  

  const formatNumber = (number) => {
    if (number >= 10000000) {
      return (number / 10000000).toFixed(1) + " Cr";
    } else if (number >= 100000) {
      return (number / 100000).toFixed(1) + " L";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + " T";
    } else {
      // //console.log(number);
      return number?.toString();
    }
  };

  // function to calculate the sum of month data
  const calculateMonthTotal = () => {
    let sum = [];

    filteredData?.forEach((item, id) => {
      monthName.forEach((name, idx) => {
        let total = [];
        //1st Company =>  January: [10,20,30]
        item[name].forEach((d, i) => {
          total[i] = +d;

          id != 0 ? (sum[idx][i] = sum[idx][i] + +d) : "";
        });
        id == 0 && sum.push(total);
      });
    });
    setMonthTotal(sum);
    //console.log(monthTotal);
  };

  // helper function to return the sum of array
  const sumArr = (arr) => {
    return arr?.reduce((a, b) => +a + +b, 0);
  };

  useEffect(() => {
    getData();

    const date = new Date();
    setMonth((date.getMonth() - 2) % 12);
  }, []);



  useEffect(() => {
    calculateMonthTotal();
  }, [data, filteredData , monthTotal , setMonthTotal]);


  useEffect(() => {
    getTop5Companies();
  }, [data]);

  // get data from api
  const getData = async () => {
    axios
      .get(
        "https://aarnainfra.com/ladder2/client/cashflow/projected_cashflow.php"
      )
      .then((res) => {
        setData(res?.data);
      });
  };

  
  let total = 0;
  let ct = 0;
  return (
    <>
      {/* Header Component */}
      <Header />
      <main className="flex ">
        {/* Sidebar Container */}
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 my-3 ml-5 mr-7  rounded shadow">
          <img
            onClick={(e) => {
              e.stopPropagation();
              setIsActionbarVisible((prev) => !prev);
            }}
            src={IMAGES.YellowToggleIcon}
            alt="toggle"
            className={`absolute z-10 right-0 top-40 cursor-pointer ${
              isActionbarVisible ? "rotate-180" : ""
            }`}
          />
          {isActionbarVisible && (
            <div className="bg-white flex items-center pl-4  border-b border-b-[#F6F6F6] mb-2 relative">
              <img
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFilterVisible((prev) => !prev);
                }}
                src={IMAGES.FilterIcon}
                alt="filter icon"
              />
              <FilterDropdown
                setMonth={setMonth}
                setSearch={setSearch}
                setYear={setYear}
                setQuarter={setQuarter}
                setCompanyNameArr={setCompanyNameArr}
                displayProperty={isFilterVisible ? "block" : "none"}
                data={data}
                setFilteredData={setFilteredData}
              />

              <p className="ml-auto mr-auto text-[#595959] font-bold text-xl border-b-4 border-b-[#9A55FF] uppercase pt-2 pb-2">
                Projected Cashflow
              </p>
            </div>
          )}
          {/* Table Container */}

        {filteredData.length > 0 && (
          <div
            className={`bg-white relative ${
              isSidebarVisible ? "max-w-[80vw]" : "max-w-[93vw]"
            }  overflow-x-scroll modal border border-black rounded-md`}
          >
           <table className="w-full ">
            <thead>
              <tr className="bg-[#F1EEFF] ">
                <th
                  className={`sticky z-20 drop-shadow-2xl left-0 bg-inherit text-[#595959] font-semibold text-base h-[42px] ${
              isSidebarVisible ? "min-w-[19vw] " : "min-w-[19vw]"
            } ${month != null ? "w-[300px]" : ""}`}
          >
            Company Name
          </th>
          <th
            className={`sticky left-[284px] top-0 text-[#595959] flex justify-center items-center gap-3 h-[42px] font-semibold text-base bg-inherit  min-w-[7vw]`}
          >
            <img
              onClick={() => {
                setIsSorted((prev) => {
                  if (prev === null) {
                    return true;
                  } else return !prev;
                });
                const chartDataOrderMap = Object.fromEntries(
                  chartData.map((item, index) => [item.name, index])
                );
              
                // Sort filteredData based on the order in chartData
                const sortedFilteredData = filteredData.sort((a, b) => {
                  const orderA = chartDataOrderMap[a.company_name];
                  const orderB = chartDataOrderMap[b.company_name];
                
                  return isSorted ? orderA - orderB : orderB - orderA;
                });
              
                setFilteredData((prev) => (prev = sortedFilteredData));
              }}
              src={IMAGES.TableSort}
              alt="table sort"
              className="cursor-pointer  sticky left-0"
            />
            Total
          </th>
          {monthName.map((name, idx) => {
            return (year && month === null && quarter === null) ||
              (month && idx + 1 == month) ||
              (quarter && Math.ceil((idx + 1) / 3) == quarter) ? (
              <th
                className={`border-r-2 border-r-black text-[#595959] font-semibold text-base ${
                  isSidebarVisible ? "min-w-[19.3vw]" : "min-w-[22.3vw]"
                } `}
                colSpan={3}
              >
                {name}{" - "}
                {Math.ceil((idx + 1) / 3) < 4
                  ? year.split("-").map(Number)[0]
                  : year.split("-").map(Number)[1]}
              </th>
            ) : null;
          })}
        </tr>
      </thead>
      <tbody>
    {/* Entire Header row */}
    <tr className=" h-[46px]">
      <td className="sticky left-0 bg-white text-center drop-shadow-2xl z-20">
        -
      </td>
      <td className="sticky left-[284px] z-0 bg-white text-center drop-shadow-2xl">
        -
      </td>
      {/* Header 1-10, 11-20, 21-last */}
      {monthArr?.map((item, i) => {
        return (year && month === null && quarter === null) ||
          (month && i + 1 == month) ||
          (quarter && Math.ceil((i + 1) / 3) == quarter) ? (
          <>
            <td className=" text-[#595959] border-r border-r-[#DFDFDF] text-sm font-medium text-center">
              1-10 Th Days
            </td>
            <td className=" text-[#595959] border-r border-r-[#DFDFDF] text-sm font-medium text-center">
              11-20 Th Days
            </td>
            <td className="border-r-2 border-r-black text-[#595959] text-sm font-medium text-center">
              21-Last Day
            </td>
          </>
        ) : null;
      })}
    </tr>

    {/* body data */}
    {filteredData?.map((item, i) => {
      let sum = 0;

      return (
        <tr
          className={`${
            i % 2 == 0 ? "bg-[#F4F4F4]" : "bg-white"
          } h-[42px]`}
        >
          {/* Company Name */}
          <td
            className={`text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-20 left-0 ${
              i % 2 == 0 ? "bg-[#F1EEFF]" : "bg-white"
            }  text-left pl-2`}
          >
            {item?.company_name}
          </td>

          {monthName?.forEach((mon, i) => {
          if (quarter && quarter == Math.ceil((i + 1) / 3)) { 
            sum += sumArr(item[mon]);
          } else if (year) {  
            sum += sumArr(item[mon]);
          } else if (month && month == i + 1) {
            sum += sumArr(item[mon]);
          } else if (!year && !month && !quarter) {
            sum += sumArr(item[mon]);
          }
          })}
          <td
            data-com={item?.company_name}
            data-id={item?.company_id}
            data-ns={sum}
            ref={(tdRef) => {
              tdRefs.current[i] = tdRef;
            }}
            className={` ${
              i % 2 == 0 ? "bg-[#F1EEFF]" : "bg-white"
            } text-[#595959] font-medium text-base text-center  sticky left-[284px] `}
          >
            {formatNumber(sum)}
          </td>
          {monthName?.map((mon, i) => {
            
            if (quarter && quarter == Math.ceil((i + 1) / 3)) {
              sum += sumArr(item[mon]);
            } else if (year) {
              sum += sumArr(item[mon]);
            } else if (month && month == i + 1) {
              sum += sumArr(item[mon]);
            } else if (!year && !month && !quarter) {
              sum += sumArr(item[mon]);
            }
            return (year && month === null && quarter === null) ||
              (month && i + 1 == month) ||
              (quarter && Math.ceil((i + 1) / 3) == quarter)
              ? item[mon]?.map((data, idx) => (
                  <td
                    key={idx}
                    className={`text-[#595959] text-sm font-medium text-center ${
                      idx === 2
                        ? "border-r-2 border-r-black"
                        : "border-r border-r-[#DFDFDF]"
                    }`}
                  >
                    {formatNumber(data)}
                  </td>
                                )) || null
                              : null;
                          })}
                        </tr>
                      );
                    })}



          <tr className="h-[42px] bg-[#F1EEFF] ">
                  <td className="text-[#e75b5b] sticky left-0 bg-inherit font-bold text-base  text-center drop-shadow-2xl z-20">
                    Total
                  </td>
                  {monthTotal?.forEach((item, i) => {
                        if (!year && !month && !quarter) {
                          for (let j = 0; j < item.length; j++) { 
                            ct += item[j]; 
                          }
                        } else if ((year && month === null && quarter === null) ||
                          (month && i + 1 == month) ||
                          (quarter && Math.ceil((i + 1) / 3) == quarter)) {
                          item.forEach((filteredData) => {
                            total += filteredData;
                          });
                        }
                      })}
                  <td
                    className={`bg-[#F1EEFF] text-[#595959] font-semibold sticky left-[280px] text-base text-center`}
                  >
                        {year || month || quarter ? formatNumber(total) : formatNumber(ct)}
                  </td>
                  {monthTotal?.map((item, i) => {
                    if (!year && !month && !quarter) {
                      
                      for (let j = 0; j < item.length; j++) { 
                          ct += item[j]; 
                      }
                      //console.log("ct:", ct); 
                      return null; 
                  }
                    return (year && month === null && quarter === null) ||
                      (month && i + 1 == month) ||
                      (quarter && Math.ceil((i + 1) / 3) == quarter)
                      ? item.map((filteredData, i) => {
                          total += filteredData;
                          return (
                            <td
                              className={`text-[#595959] border-r border-r-[#DFDFDF] text-base font-semibold text-center  ${
                                i == 2 ? "border-r-2 border-r-black" : ""
                              }`}
                            >
                              {formatNumber(filteredData)}
                            </td>
                          );
                        })
                      : null;
                  })}
                  
                </tr>

                  </tbody>
            </table>

          </div>
        )}

        {filteredData.length <= 0 && !search && (
              <div className="flex justify-center items-center h-[80vh]">
                <p className="text-[#595959] text-base font-medium">
                  Filter To Get Data 
                </p>
              </div>
        )}

        {filteredData && search && filteredData.length == 0 && (
          <div className="flex justify-center items-center h-[80vh]">
            <img src={IMAGES.NoData} alt="No Data" className="w-[30px] color-slate-600" /><br />  
          <p className="text-[#595959] text-base font-medium">
            No Specific Data Found 
          </p>
          </div>
        )}


          {filteredData.length >= 5 && (
            <div>
              <div
                className={` mt-5 rounded shadow  bg-white ${
                  isSidebarVisible ? "max-w-[80vw]" : "max-w-[93vw]"
                } `}
              >
                <p className="pl-4 py-3 border-b border-b-[#E5E5EF] text-[#202020] font-medium text-base">
                  Top 5 Companies
                </p>
                {chartData?.length > 0 && (
                  <div className="h-10 mt-5 pl-7 pr-4 ">
                    <PossessionChart chartData={chartData} />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap pl-7 pt-5 gap-5 bg-white pb-6">
                {chartData?.map((item, i) => {
                  if (i < 5)
                    return (
                      <div className="flex items-center gap-2 ">
                        <div
                          className={`w-6 h-5  ${
                            i == 0
                              ? "bg-[#6800FF]"
                              : i == 1
                              ? "bg-[#792EFC]"
                              : i == 2
                              ? "bg-[#8844FF]"
                              : i == 3
                              ? "bg-[#9C63FF]"
                              : "bg-[#AD7EFF]"
                          } `}
                        ></div>
                        <p className="text-[#595959] text-[10px] font-medium">
                          {item?.name}
                        </p>
                        <p className="bg-[#EEEEEE] px-3 py-[2px] leading-none text-[#595959] font-medium text-sm">
                          {formatNumber(item?.value)}
                        </p>
                      </div>
                    );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};
export default ProjectedCashflowReportPage;