import React, { useEffect, useState, useRef } from "react";
import IMAGES from "../../images/index.js";
import axios from "axios";
import CustomMultiSelect from "../RevenueReportPage/CustomMultiSelect.jsx";
import CustomSingleSelect from "../../components/FinancePage/CustomSingleSelect";
import DateRangePicker from "../common/DateRangePicker.jsx";
import useStore from '../../store/index.jsx';
import AgingSlider from "./agingSlider.jsx";



const generateJsonBody = (
  selectedDeveloperId,
  selectedProjectId,
  selectedLocationId,
  selectedCompanyId,
  daterange,
  invoiceStatus
) => {
  const requestBody = {};

  if (selectedDeveloperId !== null) {
    requestBody['developer_id'] = selectedDeveloperId;
  }

  if (selectedProjectId !== null) {
    requestBody['project_id'] = selectedProjectId;
  }

  if (selectedLocationId !== null) {
    requestBody['branch_id'] = selectedLocationId;
  }

  if (selectedCompanyId !== null) {
    requestBody['company_id'] = selectedCompanyId;
  }

  if(invoiceStatus !== "") {
    requestBody['invoice_status'] = invoiceStatus;
  }

  if(daterange !== null) {
    if(daterange.startDate != undefined && daterange.endDate !== undefined){
    requestBody['start_date'] = daterange.startDate;
    requestBody['end_date'] = daterange.endDate;
    }
  }


  return requestBody;
};

const FilterContainer = ({ displayProperty }) => {

  const {  updateCollection2RequestBody, } = useStore();

  const [invoiceStatus, setInvoiceStatus] = useState("");

  const [filterName, setFilterName] = useState("");

  const [savedFilters, setSavedFilters] = useState([]);

  // state to toggle the between filters & saved filters
  const [filterOrSavedFilterVisible, setFilterOrSavedFilterVisible] =
    useState("filters");

  // state to maintain the selected filters
  const [selectedFilter, setselectedFilter] = useState(null);

  // state to toggle save filter popoup in which the user will enter the filter name
  const [saveFilerVisible, setSaveFilterVisible] = useState(false);

  // ref of the container to close it if click outside
  const filterContainerRef = useRef(null);

  const [dropDownData, setDropDownData] = useState([]);

  const [locationData, setLocationData] = useState([]);

  const [selectedLocationId, setSelectedLocationId] = useState([]);

  const [companyData, setCompanyData] = useState([]);

  const [selectedComapnyId , setSelectedCompanyId] = useState([]);

  const [developerData, setDeveloperData] = useState([]);

  const [selectedDeveloperId, setSelectedDeveloperId] = useState([]);

  const [projectData, setProjectData] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState([]);

  const [daterange , setDaterange] = useState([]);

  const [apiProjectData, setApiProjectData] = useState([]);

  //console.log(daterange);

  /* if(selectedLocationId !== null){
    console.log(selectedLocationId);
  } */

  

  const statusArray = [
    { id: 1, name: "On-time" },
    { id: 2, name: "Not Raised" },
    { id: 3, name: "Not Submitted" },
    { id: 4, name: "Delayed Raised" },
    { id: 5, name: "Delayed Submitted" },
  ];
  

  const saveFilter = () => {
    const obj = {
      id: new Date().getTime(),
      name: filterName,
      data: {
        search_start_date: daterange?.startDate,
        search_end_date: daterange?.endDate,
        search_project_id: apiProjectData,
      },
    };
    if (localStorage.getItem("revenue_filters")) {
      const filters = JSON.parse(localStorage.getItem("revenue_filters"));
      filters.push(obj);
      localStorage.setItem("revenue_filters", JSON.stringify(filters));
    } else {
      let temp = [obj];
      localStorage.setItem("revenue_filters", JSON.stringify(temp));
    }
    setSaveFilterVisible(false);
  };

  const getDropDownData = async () => {
    try {
      const response = await axios.post(
        `https://aarnainfra.com/ladder2/client/bookingdd.php`
      );

      // setting the dropdown data
      setDropDownData(response.data);

      // setting the location data from the api data
      setLocationData(
        response.data.location.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      );

      setDeveloperData(
        response.data.developer.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      );

      setProjectData(
        response.data.project.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      );

      setCompanyData(
        response.data.company.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDropDownData();

    if (localStorage?.getItem("revenue_filters")) {
      const filters = JSON.parse(localStorage.getItem("revenue_filters"));
      setSavedFilters(filters);
    }
  }, []);

  useEffect(() => {
    setApiProjectData((prev) => {
      return [...prev, ...selectedProjectId];
    });
  }, [selectedProjectId]);

  const deleteFilter = (id) => {
    console.log(id);
    const filters = savedFilters.filter((item) => item.id !== id);
    console.log(filters);
    localStorage.setItem("filters", JSON.stringify(filters));
    setSavedFilters(filters);
  };

  

  const requestBody = generateJsonBody(
    selectedDeveloperId,
    selectedProjectId,
    selectedLocationId, 
    selectedComapnyId,
    daterange,
    invoiceStatus
  );

  /* if(requestBody !== null){
    console.log(requestBody);
   // 
  } */



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

  const handleClearAll = () =>{
    setSelectedCompanyId([]);
    setSelectedLocationId([]);
    setSelectedDeveloperId([]);
    setSelectedProjectId([]);
    setDaterange([]);
    setInvoiceStatus("");
    let temp = generateJsonBody(null,null,null,null,null,null);
    updateCollection2RequestBody(temp);
  }

  return (
    <div
    ref={filterContainerRef}
    style={{ display: displayProperty }}
    className=" absolute w-[250px] pb-10 pr-1 top-11 z-20 bg-white rounded  drop-shadow-2xl border border-[#E1E1E1] "
    >
      {/* Heading Filters OR Saved Fitlers*/}
      <div className="sticky top-0 flex pt-4 bg-white justify-evenly">
        <p
          onClick={() => setFilterOrSavedFilterVisible("filters")}
          className={`${
            filterOrSavedFilterVisible === "filters"
              ? "border-b-2 border-b-[#9A55FF] text-[#9A55FF]"
              : "text-[#919191]"
          } px-2 pb-1 text-sm font-medium  cursor-pointer`}
        >
          Filters
        </p>

        <p
          onClick={() => {
            setFilterOrSavedFilterVisible("savedFilters");
          }}
          className={`${
            filterOrSavedFilterVisible === "savedFilters"
              ? "border-b-2 border-b-[#9A55FF] text-[#9A55FF]"
              : "text-[#919191]"
          } px-2 pb-1 text-sm font-medium  cursor-pointer`}
        >
          Saved Filters
        </p>
      </div>

      {/* Filters Div's visible when filterOrSavedFilterVisible is filters*/}
      {filterOrSavedFilterVisible === "filters" && (
        <div
          id="filter-container"
          className="pl-4 pr-4 h-[75%]  overflow-y-scroll pt-1 filterContainer"
        >
          {/* DateRange OR Period */}
          <div>
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "Daterange" ? "" : "Daterange"
                )
              }
              className="cursor-pointer flex items-center justify-between"
            >
              <p
                className={` ${
                  selectedFilter === "Daterange"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Registration Date
              </p>
              {selectedFilter === "Daterange" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 "
                />
              )}
            </div>
            {selectedFilter === "Daterange" && (
              <div className="custom-daterange ">
                <DateRangePicker value={daterange} setValue={setDaterange} />
              </div>
            )}
          </div>

          {/* daysfilter */}

      

          {/* Developer */}
          <div>
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "developer" ? "" : "developer"
                )
              }
              className="cursor-pointer flex items-center justify-between"
            >
              <p
                className={` ${
                  selectedFilter === "developer"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Developer
              </p>
              {selectedFilter === "developer" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 "
                />
              )}
            </div>
            {selectedFilter === "developer" && (
              <div>
                <CustomMultiSelect
                  setValue={setSelectedDeveloperId}
                  options={developerData}
                />
              </div>
            )}
          </div>
          {/* Branch */}
          <div>
            <div
              onClick={() =>
                setselectedFilter((prev) => (prev === "branch" ? "" : "branch"))
              }
              className="cursor-pointer flex items-center justify-between"
            >
              <p
                className={` ${
                  selectedFilter === "branch"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Branch
              </p>
              {selectedFilter === "branch" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 "
                />
              )}
            </div>
            {selectedFilter === "branch" && (
              <div>
                <CustomMultiSelect
                  setValue={setSelectedLocationId}
                  options={locationData}
                />
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "company" ? "" : "company"
                )
              }
              className="cursor-pointer flex items-center justify-between"
            >
              <p
                className={` ${
                  selectedFilter === "company"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Company
              </p>
              {selectedFilter === "company" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 "
                />
              )}
            </div>
            {selectedFilter === "company" && (
              <div>
                <CustomMultiSelect
                  setValue={setSelectedCompanyId}
                  options={companyData}
                />
              </div>
            )}
          </div>

          {/* Project */}
          <div>
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "Project" ? "" : "Project"
                )
              }
              className="cursor-pointer flex items-center justify-between"
            >
              <p
                className={` ${
                  selectedFilter === "Project"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Projects
              </p>
              {selectedFilter === "Project" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 "
                />
              )}
            </div>
            {selectedFilter === "Project" && (
              <div>
                <CustomMultiSelect
                  setValue={setSelectedProjectId}
                  options={projectData}
                />
              </div>
            )}
          </div>

          {/* Icon's Container (search, clear all, save filters)*/}
          <div className="fixed bottom-0 right-2 flex items-center  justify-end gap-3 py-1 bg-white ">
            <img
              className="cursor-pointer"
              src={IMAGES.SearchIcon}
              alt="search icon "
              onClick={() => {
                updateCollection2RequestBody(requestBody);
              }
              }
            />
            <img
              onClick={() => {
                setselectedFilter(null);
                handleClearAll();
              }}
              className="cursor-pointer"
              src={IMAGES.ClearAllIcon}
              alt="clear all icon"
            />
            <img
              onClick={() => setSaveFilterVisible((prev) => !prev)}
              className="cursor-pointer"
              src={IMAGES.SaveIcon}
              alt="save icon"
            />
          </div>
        </div>
      )}

      {/* Saved Filters Div */}
      {filterOrSavedFilterVisible === "savedFilters" && (
        <div className="p-2 ">
          {savedFilters.length === 0 ? (
            <p className="text-[#919191] text-base font-normal">
              No Saved Filters
            </p>
          ) : (
            savedFilters.map((filter) => (
              <div
                key={filter?.id}
                className="flex items-center justify-between px-1 mt-2"
              >
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    handleSaveFilterClick(
                      filter?.data?.search_project_id,
                      filter?.data?.start_date,
                      filter?.data?.end_date
                    )
                  }
                >
                  {filter?.name}
                </span>
                <img
                  className="cursor-pointer"
                  onClick={() => deleteFilter(filter?.id)}
                  src={IMAGES.DeleteIcon}
                  alt="delete icon"
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Save Filter Popup */}
      {saveFilerVisible && (
        <div className="absolute w-52 h-fit left-[104%] bg-white top-[55%] rounded-md py-2 px-3 shadow-lg">
          <span className="text-sm font-medium text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid decoration-2 underline-offset-[8px]">
            Save Filter
          </span>
          <div>
            <p className="text-[#696969] text-sm pt-3 pb-2">Filter Name</p>
            <input
              onChange={(e) => {
                setFilterName(e.target.value);
              }}
              placeholder="Name Here"
              type="text"
              className="border border-[#B4B4B4] rounded w-full h-8 placeholder:text-xs text-sm text-[#696969] outline-none placeholder:text-[#818181] pl-3"
            />
          </div>
          <button
            onClick={saveFilter}
            className="bg-[#9A55FF] text-white font-medium text-sm h-6  rounded px-4 mt-4 block mx-auto"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterContainer;
