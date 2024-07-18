import React, { useState, useEffect, useRef } from "react";
import CustomMultiSelect from "./ProjectedMultiSelect";
import IMAGES from "../../images";
import axios from "axios";



const FilterDropdown = ({
  displayProperty ,
  setQuarter,
  setMonth,
  setYear,
  setSearch,
  setCompanyNameArr,
  data,
  setFilteredData,
}) => {
  const [accordion, setAccordion] = useState({ 1: false, 2: false });
  const [selectedYear, setSelectedYear] = useState(null);
  const filterContainerRef = useRef(null);
  const [search , setSearch1] = useState(false);
  const [filteredCompanyData, setFilteredData1] = useState([]); 
  const [companyNameArray , setCompanyNameArray] = useState([]);


    const [localSelectedYear, setLocalSelectedYear] = useState(null);
    const [localMonth, setLocalMonth] = useState(null);
    const [localQuarter, setLocalQuarter] = useState(null);
    const [localYear, setLocalYear] = useState(false);
    const [dropdownData , setDropdownData] = useState([]);
    const [requestBody , setRequestBody] = useState({});

    function getFinancialPeriodDates(year, quarter) {
      let startYear = parseInt(year.split('-')[0], 10) + 2000;
      let endYear = parseInt(year.split('-')[1], 10) + 2000;
      let startDate, endDate;
  
      switch (quarter) {
          case 'Q1':
              startDate = `${startYear}-04-01`;
              endDate = `${startYear}-06-30`;
              break;
          case 'Q2':
              startDate = `${startYear}-07-01`;
              endDate = `${startYear}-09-30`;
              break;
          case 'Q3':
              startDate = `${startYear}-10-01`;
              endDate = `${startYear}-12-31`;
              break;
          case 'Q4':
              startDate = `${endYear}-01-01`;
              endDate = `${endYear}-03-31`;
              break;
          default:
              startDate = `${startYear}-04-01`;
              endDate = `${endYear}-03-31`;
              break;
      }
  
      return { startDate: startDate, endDate: endDate };
  }

  



  const handleSearch = () => {

    let FDate = {};

    if (localQuarter && selectedYear) {
      let PQ = "Q" + localQuarter;
      FDate = getFinancialPeriodDates(selectedYear, PQ);
      requestBody.start_date = FDate.startDate;
      requestBody.end_date = FDate.endDate;
    }
    
    else if (localMonth && selectedYear) {
      FDate = getFinancialPeriodDates(selectedYear, localMonth);
     // console.log(localMonth);
      requestBody.start_date = FDate.startDate;
      requestBody.end_date = FDate.endDate;
    }

    else if (selectedYear){
      const selectedYearDates = getFinancialPeriodDates(selectedYear);
      requestBody.start_date = selectedYearDates.startDate;
      requestBody.end_date = selectedYearDates.endDate;
    }

    if (filteredCompanyData && filteredCompanyData.length > 0) {
      const companyIds = filteredCompanyData.map(item => item.company_id);
      const companyNames = filteredCompanyData.map(item => item.company_name);
      setCompanyNameArray(companyNames);
      requestBody.company_id = companyIds.join(',');
    }

    if (requestBody) { 
      getData(requestBody);
    }
  //  console.log(companyNameArray);
    setSearch(true);
    setMonth(localMonth);
    setYear(selectedYear);
    setQuarter(localQuarter);
    setCompanyNameArr(companyNameArray);
    //setLocalSelectedYear(selectedYear);
  };

  const clearForm = () => {
    setSelectedYear(null);
    setLocalMonth(null);
    setLocalQuarter(null);
    setFilteredData1([]);
    setCompanyNameArray([]);
    setSearch1(false);
    setLocalYear(false);
    setAccordion({ 1: false, 2: false });
    setRequestBody({});
    setLocalSelectedYear(null);
    setFilteredData([]);
  }

//console.log(requestBody);  
  const getData = async (requestData) => {
   // console.log(requestData);
    axios
      .post("https://aarnainfra.com/ladder2/client/cashflow/test.php", requestData) 
      .then((res) => {
       // console.log(res);
        if(res?.data){
          setFilteredData(res?.data);        
        }
      });
  };
  

    const getDropDownData = async () => {
      axios
        .get("https://aarnainfra.com/ladder2/client/bookingdd.php")
        .then((res) => {
          const modifiedData = res?.data?.company.map(item => ({
            company_id: item.id,
            company_name: item.name
          }));
         // console.log(res);
          setDropdownData(modifiedData);
        });
    };

    useEffect(() => {
      getDropDownData();
    }, []);   
    
    const getOptions = () => {
      const currentYear = new Date().getFullYear();
      const startYear = 2018;
      let options = [];
    
      for (let i = startYear; i <= currentYear + 1; i++) {
        // Extract last two digits of the year
        let lastTwoDigits = i.toString().slice(2);
        // Calculate the next year
        let nextYearLastTwoDigits = (i + 1).toString().slice(2);
        let option = `FY ${lastTwoDigits}-${nextYearLastTwoDigits}`;
        options.push(
          <option value={`${lastTwoDigits}-${nextYearLastTwoDigits}`}>
            {option}
          </option>
        );
      }
    
      // Reverse the array before returning it
      return options.reverse();
    };

    useEffect(() => {
      // Function to close the dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (
          filterContainerRef.current &&
          !filterContainerRef.current.contains(event.target)
        ) {
          filterContainerRef.current.style.display = "none";
        }
      };
  
      if (displayProperty === "block" && filterContainerRef.current) {
        document.addEventListener("click", handleClickOutside);
      }
  
      // Cleanup function to remove event listener when component unmounts
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [displayProperty]);

  return (
    <div
    ref={filterContainerRef}
    style={{ display: displayProperty }}
    className=" absolute w-[250px] h-[400px] pb-10 pr-1 top-11 z-30 bg-white rounded  drop-shadow-2xl border border-[#E1E1E1] "
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
          <div className="mr-5 mt-2 h-full">
            <CustomMultiSelect
              options={dropdownData}
              setFilteredData={setFilteredData1}
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
              {getOptions()}
            </select>
            {/* <p className="mt-2 text-[#6F6B6B] ml-20 text-sm">AND</p>/ */}
            {selectedYear && (
              <select
                onChange={(e) => {
                  setLocalQuarter(null);
                  setLocalSelectedYear(null);
                  setLocalMonth(e.target.value);
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
                  setLocalMonth(null);
                  setLocalSelectedYear(false);
                  setLocalQuarter(e.target.value);
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
                      setLocalMonth(null);
                      setLocalQuarter(null);
                      setLocalSelectedYear(true);
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
        <div className="flex justify-between items-center px-14">
          <button className="bg-[#9A55FF]  text-white rounded text-sm w-[70px] py-1 mt-4" onClick={handleSearch}>
              Search
          </button>
          <img
              onClick={() => { 
                  clearForm();
              }}
              className="cursor-pointer py-1 mt-4 bg-white w-8 h-8 border border-gray"
              src={IMAGES.Clear}
              alt="clear all icon"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
