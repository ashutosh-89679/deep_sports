import React, { useEffect, useRef, useState, useMemo } from "react";
import Header from "../components/common/Header";
import IMAGES from "../images";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import Sidebar from "../components/common/Sidebar";

export const CustomMultiSelect = ({ options, setFilteredData }) => {
  // To store selected option values
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  // To store the search text
  const [searchText, setSearchText] = useState("");

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    // Prevent the click event from propagating to the parent div
    event.stopPropagation();
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedOptions.length === 0) {
      setFilteredData(options);
    } else {
      const filteredResults = options.filter((item) =>
        selectedOptions.includes(item?.company_name)
      );
      setFilteredData(filteredResults);
    }
  }, [selectedOptions]);

  // Function to toggle the selection of all options
  const toggleSelectAll = () => {
    if (selectedOptions.length === filteredOptions.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(filteredOptions.map((option) => option?.company_name));
    }
  };

  // Function to clear all selections
  const toggleClearAll = () => {
    setSelectedOptions([]);
    setSearchText("");
  };

  // Function to handle a single option click
  const handleOptionClick = (name) => {
    if (selectedOptions.includes(name)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== name));
    } else {
      setSelectedOptions([...selectedOptions, name]);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option?.company_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);

  const selectedOptionsText = useMemo(() => {
    if (selectedOptions.length === 0) {
      return "Select Here..";
    }
    const text = selectedOptions.join(", ").substring(0, 20);
    return selectedOptions.length > 1 ? `${text}...` : text;
  }, [selectedOptions]);

  return (
    <div className="relative rounded  ">
      {/* Button  */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => (prev === true ? false : true));
        }}
        className="h-8 w-full  rounded border border-[#E0E0E0]  pl-3 text-left text-sm text-[#696969] focus:outline-none"
      >
        {selectedOptionsText}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-[6px]   w-full rounded border border-[#E0E0E0] bg-white "
        >
          <div className="px-2 pt-2">
            {/* Search input */}
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-[#E0E0E0] pl-2 py-1  outline-none text-sm text-[#6F6B6B]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-1">
              {/* Select All button */}
              <button
                onClick={toggleSelectAll}
                className="text-sm font-medium text-[#9A55FF]"
              >
                SELECT ALL
              </button>
              {/* Clear All button */}
              <button
                onClick={toggleClearAll}
                className="text-sm font-medium text-[#9A55FF]"
              >
                CLEAR ALL
              </button>
            </div>
            <div className="overflow-y-scroll modal max-h-40">
              {/* Render the filtered options */}
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option?.company_name)}
                  className={`my-1 rounded flex cursor-pointer justify-between px-2 py-1 text-sm text-[#696969]  ${
                    selectedOptions.includes(option.company_name)
                      ? "bg-[#EADCFF] after:content-['✓'] text-black"
                      : ""
                  }`}
                >
                  {option?.company_name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PossessionChart = () => {
  const data = {
    labels: ["Top 5 Companies"],
    datasets: [
      {
        label: "",
        data: [45],
        backgroundColor: "#6800FF",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: "",
        data: [20],
        backgroundColor: "#792EFC",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: "",
        data: [25],
        backgroundColor: "#8844FF",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: "",
        data: [25],
        backgroundColor: "#9C63FF",
        barThickness: 30,
        borderRadius: 9,
      },
      {
        label: "",
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
export const FilterIcon = ({
  isFilterVisible,
  setIsFilterVisible,
  setQuarter,
  setMonth,
  setYear,
  data,
  setFilteredData,
}) => {
  const [accordion, setAccordion] = useState({
    1: false,
    2: false,
  });

  const [selectedYear, setSelectedYear] = useState(null);
  const filterContainerRef = useRef(null);
  useEffect(() => {
    // Function to close the dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(event.target)
      ) {
        setIsFilterVisible(false);
      }
    };

    // Add event listener when the dropdown is visible
    if (isFilterVisible && filterContainerRef.current) {
      document.addEventListener("click", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFilterVisible, filterContainerRef]);
  return (
    <div
      ref={filterContainerRef}
      className=" absolute w-[250px]   pr-1 top-10 z-20 bg-white rounded  drop-shadow-2xl border border-[#E1E1E1] "
    >
      <div className="flex justify-center mt-2">
        <span className="text-[#9A55FF]  font-medium border-b-2 border-b-[#9A55FF] ">
          Filters
        </span>
      </div>

      {/* Filter Container */}
      <div className="mt-2 pl-5">
        <div
          onClick={() => setAccordion({ ...accordion, 1: !accordion[1] })}
          className="flex justify-between item-center"
        >
          <p
            className={`cursor-pointer text-sm ${
              accordion[1] ? "text-[#9A55FF] font-medium" : "text-[#6F6B6B]"
            } `}
          >
            Select Companies
          </p>
          <img
            src={IMAGES.ArrowIcon}
            alt="down arrow"
            className={`mr-7 ${accordion[1] ? "" : "rotate-180"}`}
          />
        </div>
        {accordion[1] && (
          <div className="mr-5 mt-2">
            <CustomMultiSelect
              options={data}
              setFilteredData={setFilteredData}
            />
          </div>
        )}

        <div
          onClick={() => setAccordion({ ...accordion, 2: !accordion[2] })}
          className="flex mt-3 justify-between item-center"
        >
          <p
            className={`cursor-pointer text-sm ${
              accordion[2] ? "text-[#9A55FF] font-medium" : "text-[#6F6B6B]"
            } `}
          >
            Select Period
          </p>
          <img
            src={IMAGES.ArrowIcon}
            alt="down arrow"
            className={`mr-7 ${accordion[2] ? "" : "rotate-180"}`}
          />
        </div>
        {accordion[2] && (
          <div className="flex flex-col">
            <select
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-[#6F6B6B] text-sm border mr-5 mt-2 outline-none rounded h-7"
            >
              <option hidden>Select Year</option>
              <option value="17-18">FY 17-18</option>
              <option value="18-19">FY 18-19</option>
              <option value="19-20">FY 19-20</option>
              <option value="20-21">FY 20-21</option>
              <option value="22-23">FY 22-23</option>
              <option value="23-24">FY 23-24</option>
            </select>
            {/* <p className="mt-2 text-[#6F6B6B] ml-20 text-sm">AND</p>/ */}
            {selectedYear && (
              <select
                onChange={(e) => {
                  setQuarter(null);
                  setYear(null);
                  setMonth(e.target.value);
                }}
                className="text-[#6F6B6B] text-sm border mr-5 mt-2 outline-none rounded h-7"
              >
                <option hidden>Select Month</option>
                <option value="1">April</option>
                <option value="2">May</option>
                <option value="3">June</option>
                <option value="4">July</option>
                <option value="5">August</option>
                <option value="6">September</option>
                <option value="7">October</option>
                <option value="8">Novemebr</option>
                <option value="9">December</option>
                <option value="10">January</option>
                <option value="11">February</option>
                <option value="12">March</option>
              </select>
            )}

            {selectedYear && (
              <p className="mt-2 text-[#6F6B6B] ml-20 text-sm">OR</p>
            )}
            {selectedYear && (
              <select
                onChange={(e) => {
                  setMonth(null);
                  setYear(false);
                  setQuarter(e.target.value);
                }}
                className="text-[#6F6B6B] text-sm border mr-5 mt-2 oultine-none rounded h-7 outline-none"
              >
                <option hidden>Select Quarter</option>
                <option value="1">Q1</option>
                <option value="2">Q2</option>
                <option value="3">Q3</option>
                <option value="4">Q4</option>
              </select>
            )}

            {selectedYear && (
              <p className="mt-2 text-[#6F6B6B] ml-20 text-sm">OR</p>
            )}
            {selectedYear && (
              <label
                htmlFor="cb"
                className="mt-2 text-[#6F6B6B] text-sm gap-3 flex items-center "
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMonth(null);
                      setQuarter(null);
                      setYear(true);
                    }
                  }}
                  type="checkbox"
                  name="cb"
                  id="cb"
                  className="w-4 h-4 mb-[2px]"
                />
                <span>Entire Year</span>
              </label>
            )}
          </div>
        )}

        {/* <button className="bg-[#9A55FF] fixed bottom-3 text-white rounded text-sm w-[70px] py-1 mx-auto ml-16 mt-4">
          Search
        </button> */}

        <button className="bg-[#9A55FF] mb-2 text-white rounded text-sm w-[70px] py-1 mx-auto ml-16 mt-4">
          Search
        </button>
      </div>
    </div>
  );
};

const DelayedCashflowReportPage = () => {
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

  // month array to map & create header 1-10, 11-20, 21-last
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

  // data from the api
  const [data, setData] = useState([]);

  // to store the filtered month
  const [month, setMonth] = useState(null);

  // to store the filtered quarter
  const [quarter, setQuarter] = useState(null);

  // to store the boolean which indicates whether to show full year or not
  const [year, setYear] = useState(false);

  // Sidebar State
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  console.log(data);

  const formatNumber = (number) => {
    if (number >= 10000000) {
      return (number / 10000000).toFixed(1) + "Cr";
    } else if (number >= 100000) {
      return (number / 100000).toFixed(1) + "L";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "T";
    } else {
      console.log(number);
      return number?.toString();
    }
  };

  // function to calculate the sum of month data
  const calculateMonthTotal = () => {
    setMonthTotal([]);
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
  };

  // helper function to return the sum of array
  const sumArr = (arr) => {
    return arr?.reduce((a, b) => +a + +b, 0);
  };

  useEffect(() => {
    getData();

    // onload set the current month from the date api

    const date = new Date();
    setMonth((date.getMonth() - 2) % 12);
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    getTop5Companies();
    calculateMonthTotal();
    // filteredData.length <= 0 && setFilteredData(data);
  }, [data, month, year, quarter]);
  // get data from api
  const getData = async () => {
    axios
      .get("https://aarnainfra.com/ladder/client/cashflow/delayed_cashflow.php")
      .then((res) => {
        setData(res?.data);
      });
  };

  let total = 0;
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
              {isFilterVisible && (
                <FilterIcon
                  setMonth={setMonth}
                  setYear={setYear}
                  setQuarter={setQuarter}
                  isFilterVisible={isFilterVisible}
                  setIsFilterVisible={setIsFilterVisible}
                  data={data}
                  setFilteredData={setFilteredData}
                />
              )}
              <p className="ml-auto mr-auto text-[#595959] font-bold text-xl border-b-4 border-b-[#9A55FF] uppercase pt-2 pb-2">
                Actual Cashflow
              </p>
            </div>
          )}

          <div
            className={`bg-white relative ${
              isSidebarVisible ? "max-w-[80vw]" : "max-w-[93vw]"
            }  overflow-x-scroll modal`}
          >
            <table className="w-full ">
              <thead>
                <tr className="bg-[#F1EEFF] ">
                  <th
                    className={`  sticky  drop-shadow-2xl left-0 bg-inherit text-[#595959] font-semibold text-base h-[42px] ${
                      isSidebarVisible ? "min-w-[14.9vw] " : "min-w-[19vw]"
                    } ${month != null ? "w-[300px]" : ""}`}
                  >
                    Project Name
                  </th>
                  {monthName.map(
                    (name, idx) =>
                      (month == idx + 1 ||
                        quarter == Math.ceil((idx + 1) / 3) ||
                        year) && (
                        <th
                          className={`border-r-2 border-r-black text-[#595959] font-semibold text-base ${
                            isSidebarVisible
                              ? "min-w-[19.3vw]"
                              : "min-w-[22.3vw]"
                          } `}
                          colSpan={3}
                        >
                          {name} {Math.ceil((idx + 1) / 3) < 4 ? "23" : "24"}'
                        </th>
                      )
                  )}

                  <th
                    className={`sticky right-0 text-[#595959] flex justify-center items-center gap-3 h-[42px] font-semibold text-base bg-inherit  min-w-[7vw]`}
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
                        console.log(filteredData);
                      }}
                      src={IMAGES.TableSort}
                      alt="table sort"
                      className="cursor-pointer   "
                    />
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Entire Header row */}
                <tr className=" h-[46px]">
                  <td className="sticky left-0 bg-white text-center drop-shadow-2xl ">
                    -
                  </td>

                  {/* Header 1-10, 11-20, 21-last */}
                  {monthArr?.map(
                    (item, i) =>
                      (month == i + 1 ||
                        quarter == Math.ceil((i + 1) / 3) ||
                        year) && (
                        <>
                          <td className=" text-[#595959] border-r border-r-[#DFDFDF] text-sm font-medium text-center">
                            1-10 Days
                          </td>
                          <td className=" text-[#595959] border-r border-r-[#DFDFDF] text-sm font-medium text-center">
                            11-20 Days
                          </td>
                          <td className="border-r-2 border-r-black text-[#595959] text-sm font-medium text-center">
                            21-Last
                          </td>
                        </>
                      )
                  )}
                  <td className=" text-center sticky right-0 bg-white ">-</td>
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
                        className={`text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-10 left-0 ${
                          i % 2 == 0 ? "bg-[#F1EEFF]" : "bg-white"
                        }  text-center`}
                      >
                        {item?.company_name}
                      </td>
                      {monthName?.map((mon, i) => {
                        if (quarter && quarter == Math.ceil((i + 1) / 3)) {
                          sum += sumArr(item[mon]);
                        } else if (year) {
                          sum += sumArr(item[mon]);
                        } else if (month && month == i + 1) {
                          sum += sumArr(item[mon]);
                        }
                        return (
                          (month == i + 1 ||
                            quarter == Math.ceil((i + 1) / 3) ||
                            year) &&
                          item[mon]?.map((data, idx) => (
                            <td
                              key={idx}
                              className={`text-[#595959] text-sm font-medium text-center  ${
                                idx == 2
                                  ? "border-r-2 border-r-black"
                                  : "border-r border-r-[#DFDFDF]"
                              } `}
                            >
                              {formatNumber(data)}
                            </td>
                          ))
                        );
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
                        } text-[#595959] font-medium text-base text-center  sticky right-0 z-10`}
                      >
                        {formatNumber(sum)}
                      </td>
                    </tr>
                  );
                })}

                <tr className="h-[42px] bg-[#F1EEFF] ">
                  <td className="text-[#595959] sticky left-0 bg-inherit font-bold text-base  text-center drop-shadow-2xl z-10">
                    Total
                  </td>
                  {monthTotal?.map(
                    (item, i) =>
                      (month == i + 1 ||
                        quarter == Math.ceil((i + 1) / 3) ||
                        year) &&
                      item.map((data, i) => {
                        total += data;
                        return (
                          <td
                            className={`text-[#595959] border-r border-r-[#DFDFDF] text-base font-semibold text-center ${
                              i == 2 ? "border-r-2 border-r-black" : ""
                            }`}
                          >
                            {formatNumber(data)}
                          </td>
                        );
                      })
                  )}
                  <td
                    className={`bg-[#F1EEFF] text-[#595959] font-semibold text-base text-center  sticky right-0 z-50`}
                  >
                    {formatNumber(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {filteredData.length >= 6 && (
            <div>
              <div
                className={` mt-5 rounded shadow  bg-white ${
                  isSidebarVisible ? "max-w-[80vw]" : "max-w-[93vw]"
                } `}
              >
                <p className="pl-4 py-3 border-b border-b-[#E5E5EF] text-[#202020] font-medium text-base">
                  Top 5 Companies
                </p>
                <div className="h-10 mt-5 pl-7 pr-4 ">
                  <PossessionChart />
                </div>
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
export default DelayedCashflowReportPage;
