import { useEffect, useRef, useState } from "react";
import IMAGES from "../../images";
import DateRangePicker from "./DateRangePicker";
import CustomMultiSelect from "./CustomMultiSelect";
import axios from "axios";

const FilterContainer = ({
  selectedQuickFilter,
  getFilteredKickerData,
  getFilteredEiData,
  getFilteredLadderData,
  daterange,
  setDaterange,
  displayProperty,
}) => {
  const [filterName, setFilterName] = useState("");
 
  const [savedFilters, setSavedFilters] = useState([]);

  // state to toggle the between filters & saved filters
  const [filterOrSavedFilterVisible, setFilterOrSavedFilterVisible] =
    useState("Ladderfilters");

  const [selectedFilter, setselectedFilter] = useState(null);
  const [saveFilerVisible, setSaveFilterVisible] = useState(false);

  const filterContainerRef = useRef(null);

  const [dropDownData, setDropDownData] = useState([]);

  const [locationData, setLocationData] = useState([]);
  const [developerData, setDeveloperData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState([]);

  const [apiProjectData, setApiProjectData] = useState([]);


  //TO SAVE THE FILTER DATA INTO LOCALSTORAGE
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
    if (localStorage.getItem("Ladderfilters")) {
      const filters = JSON.parse(localStorage.getItem("Ladderfilters"));
      filters.push(obj);
      localStorage.setItem("Ladderfilters", JSON.stringify(filters));
    } else {
      let temp = [obj];
      localStorage.setItem("Ladderfilters", JSON.stringify(temp));
    }
    setSaveFilterVisible(false);
  };
  


  const getDropDownData = async () => {
    axios.get('https://aarnainfra.com/ladder2/client/ladderFilter.php').then((res) => {
      setDropDownData(res?.data);
  
      // setting the location data from the api data
      setLocationData(
        res?.data?.location?.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      );
  
      setDeveloperData(
        res?.data?.developer?.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      );
    
      setProjectData(
        res?.data?.project?.map((item) => {
          return {
            id: item.project_id,
            name: item.project_name,
          };
        })
      );

  
    }); 
  };

  useEffect(() => {

    if (selectedLocationId && dropDownData && dropDownData.project) {
        function fetchLocationIds(locationIDs) {
            const projects = dropDownData.project;
            const projectIds = [];

            locationIDs.forEach(locationID => {
                const filteredProjects = projects.filter(project => project.location_id === String(locationID));
                const ids = filteredProjects.map(project => project.project_id);
                projectIds.push(...ids);
            });

            return projectIds;
        }

        const locProjId = fetchLocationIds(selectedLocationId);
        if (locProjId.length > 0) {
            setProjectData(
                dropDownData.project.filter(project => locProjId.includes(project.project_id))
                .map(project => ({ id: project.project_id, name: project.project_name }))
            );
        }
    } 
    if (selectedDeveloperId && dropDownData && dropDownData.project) {
        function fetchDeveloperIds(developerIDs) {
            const Dprojects = dropDownData.project;
            const DprojectIds = [];

            developerIDs.forEach(developerID => {
                const DfilteredProjects = Dprojects.filter(project => project.developer_id === String(developerID));
                const ids = DfilteredProjects.map(project => project.project_id);
                DprojectIds.push(...ids);
            });

            return DprojectIds;
        }

        const devProjId = fetchDeveloperIds(selectedDeveloperId);
        if (devProjId.length > 0) {
           // console.log(devProjId);
            setProjectData(
                dropDownData.project.filter(project => devProjId.includes(project.project_id))
                .map(project => ({ id: project.project_id, name: project.project_name }))
            );
        }
    }
    if(selectedLocationId && dropDownData && dropDownData.project && selectedDeveloperId){
        function filterBoth (developerIds, locationIds) {
            const projects = dropDownData.project;

            const filteredProjects = projects.filter(project => 
                developerIds.includes(String(project.developer_id)) && 
                locationIds.includes(String(project.location_id))
            );
        
            return filteredProjects.map(project => project.project_id);
        }

        const bothIds = filterBoth(selectedDeveloperId, selectedLocationId);
        if(bothIds.length > 0){
            setProjectData(
                dropDownData.project.filter(project => bothIds.includes(project.project_id))
                .map(project => ({ id: project.project_id, name: project.project_name }))
            );
        }
    }

}, [selectedLocationId, selectedDeveloperId, dropDownData , selectedProjectId]);

useEffect(() => {
   // console.log("selected DeveloperID ->" , selectedDeveloperId);
   // console.log("selected ProjectID ->" , selectedProjectId);
   // console.log("selected LocationID ->" , selectedLocationId);
    if((selectedLocationId.length != 0 && selectedDeveloperId.length != 0 && selectedProjectId.length == 0) ||
       (selectedLocationId.length != 0 && selectedDeveloperId.length == 0 && selectedProjectId.length == 0) ||
       (selectedLocationId.length == 0 && selectedDeveloperId.length != 0 && selectedProjectId.length == 0)){
        setApiProjectData(projectData.map(item => item.id));
    }
    else if(selectedProjectId.length != 0){
      setApiProjectData(selectedProjectId);
    } 
}, [selectedLocationId , selectedDeveloperId , selectedProjectId , projectData]);


  useEffect(() => {
    getDropDownData();

    if (localStorage?.getItem("Ladderfilters")) {
      const filters = JSON.parse(localStorage.getItem("Ladderfilters"));
      setSavedFilters(filters);
    }
  }, []);

  const deleteFilter = (id) => {
    const filters = savedFilters.filter((item) => item.id !== id);
    localStorage.setItem("Ladderfilters", JSON.stringify(filters));
    setSavedFilters(filters);
  };


   const handleSaveFilterClick = (id, startDate, endDate) => {
    if (selectedQuickFilter === "ladder") {
      getFilteredLadderData(id, startDate, endDate);
    } else if (selectedQuickFilter === "kicker") {
      getFilteredKickerData(apiProjectData);
    } else if (selectedQuickFilter === "ei"){
      getFilteredEiData(apiProjectData)
    }
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


  const handleClearAll = () => {
    setSelectedDeveloperId([]);
    setSelectedLocationId([]);
    setSelectedProjectId([]);
    setDaterange(null);
  }

  //console.log(projectData.map(item => item.id));
  console.log(selectedLocationId)


  return (
    <div
      ref={filterContainerRef}
      style={{ display: displayProperty }}
      className=" absolute w-[250px] h-[490px] pr-1 top-9 z-20 bg-white rounded  drop-shadow-2xl border border-[#E1E1E1] ladderFilter"
    >
      {/* Heading Filters OR Saved Fitlers*/}
      <div className="sticky top-0 flex pt-4 bg-white justify-evenly">
        <p
          onClick={() => setFilterOrSavedFilterVisible("Ladderfilters")}
          className={`${
            filterOrSavedFilterVisible === "Ladderfilters"
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
      {filterOrSavedFilterVisible === "Ladderfilters" && (
        <div
          id="filter-container"
          className="pl-4 pr-4 h-[75%]  overflow-y-scroll pt-1 ladderFilter"
        >
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
                Select Developer
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
          {/* Location */}
          <div>
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "location" ? "" : "location"
                )
              }
              className="cursor-pointer flex items-center justify-between"
            >
              <p
                className={` ${
                  selectedFilter === "location"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Select Location
              </p>
              {selectedFilter === "location" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 "
                />
              )}
            </div>
            {selectedFilter === "location" && (
              <div>
                <CustomMultiSelect
                  setValue={setSelectedLocationId}
                  options={locationData}
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
                Select Project
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

          {/* DateRange */}
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
                Select Daterange
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

          {/* Icon's Container (search, clear all, save filters)*/}
          <div className="fixed bottom-0 right-2 flex items-center  justify-end gap-3 py-1 bg-white ">
            <img
              onClick={() => {
                if (selectedQuickFilter === "ladder") {
                  getFilteredLadderData(
                    apiProjectData,
                    daterange?.startDate,
                    daterange?.endDate
                  );
                } else if (selectedQuickFilter === "kicker") {
                  getFilteredKickerData(apiProjectData);
                } else if (selectedQuickFilter === "ei") {
                  getFilteredEiData(apiProjectData)
                }
                setSaveFilterVisible(false);
              }}
              className="cursor-pointer"
              src={IMAGES.SearchIcon}
              alt="search icon "
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
      <div className={`absolute w-52 h-fit left-[104%] bg-white top-[72%] rounded-md py-2 px-3 shadow-lg ${saveFilerVisible ? 'block' : 'hidden'}`}>
          <span className="text-sm font-medium text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid decoration-2 underline-offset-[8px]">
            Save Filter
          </span>
          <div>
            <p className="text-[#696969] text-sm pt-3 pb-2">Filter Name</p>
            <input
              onChange={(e) => {
                setFilterName(e.target.value);
              }}
              value={filterName}
              placeholder="Name Here"
              type="text"
              className="border border-[#B4B4B4] rounded w-full h-8 placeholder:text-xs text-sm text-[#696969] outline-none placeholder:text-[#818181] pl-3"
            />
          </div>
          <button className="bg-[#9A55FF] text-white font-medium text-sm h-6  rounded px-4 mt-4 block mx-auto" onClick={saveFilter}>
            Save
          </button>
      </div>
    </div>
  );
};

export default FilterContainer;
