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
  isFiltersVisible,
  setIsFiltersVisible,
}) => {
  const [filterName, setFilterName] = useState("");

  // saved filters list getting from the api
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

  const [developerData, setDeveloperData] = useState([]);

  const [selectedDeveloperId, setSelectedDeveloperId] = useState([]);

  const [projectData, setProjectData] = useState([]);

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
    if (localStorage.getItem("filters")) {
      const filters = JSON.parse(localStorage.getItem("filters"));
      filters.push(obj);
      localStorage.setItem("filters", JSON.stringify(filters));
    } else {
      let temp = [obj];
      localStorage.setItem("filters", JSON.stringify(temp));
    }
    setSaveFilterVisible(false);
  };
  

  const getDropDownData = async () => {
    axios.post(`https://aarnainfra.com/ladder2/dropdown2.php`).then((res) => {
      //  setting the dropdown data
      setDropDownData(res?.data);

      // setting the location data from the api data
      setLocationData(
        res?.data.map((item) => {
          return {
            id: item.location_id,
            name: item.location_name,
          };
        })
      );

      // setting the developer data from the api data
      let temp = [];
      res?.data.map((item) => {
        item.developers.map((developer) => {
          const obj = {
            id: developer.developer_id,
            name: developer.developer_name,
          };
          temp.push(obj);
        });
      });
        res?.data.map((item) => {
        item?.localities?.forEach((locality) => {
          locality?.independent_developers.forEach((developer) => {
              const obj = {
                  id: developer.developer_id,
                  name: developer.developer_name,
              };
              temp.push(obj);
          });
        });
      });


      let uniqueTemp = temp.filter((value, index, self) => 
        self.findIndex(obj => obj.id === value.id) === index
      );
      //console.log(uniqueTemp);
    
      setDeveloperData(uniqueTemp);

      // setting the project data from the api data
      let temp2 = [];
      res?.data?.map((item) => {
        item?.developers?.map((developer) => {
          developer?.companies[0]?.projects.map((project) => {
            const obj = {
              id: project.project_id,
              name: project.project_name,
            };
            temp2.push(obj);
          });
        });

        item?.localities?.map((locality) => {
          locality?.projects.map((project) => {
              const obj = {
                  id: project.project_id,
                  name: project.project_name,
              };
              temp2.push(obj);
          });
      });

        setProjectData(temp2);
      });
    });
  };


  useEffect(() => {
    getDropDownData();

    if (localStorage?.getItem("filters")) {
      const filters = JSON.parse(localStorage.getItem("filters"));
      setSavedFilters(filters);
    }
  }, []);

  //console.log(dropDownData);

  useEffect(() => {
    setApiProjectData((prev) => {
      return [...prev, ...selectedProjectId];
    });
  }, [selectedProjectId]);

  const deleteFilter = (id) => {
    const filters = savedFilters.filter((item) => item.id !== id);
    localStorage.setItem("filters", JSON.stringify(filters));
    setSavedFilters(filters);
  };

  // to fill the project dropdown based on the selected location
  useEffect(() => {
    let temp2 = [];

    if (selectedLocationId.length > 0) {
      console.log(selectedLocationId);
        dropDownData.map((item) => {
            if (selectedLocationId.includes(item?.location_id)) {
                if (item.developers.length > 0 && selectedDeveloperId.length === 0) {
                    item?.developers?.map((developer) => {
                        developer?.companies[0]?.projects.map((project) => {
                            const obj = {
                                id: project.project_id,
                                name: project.project_name,
                            };
                            temp2.push(obj);
                        });
                    });
                } else {
                    // Use localities data if developers array is empty or developer is not selected
                    item?.localities?.map((locality) => {
                        locality?.projects.map((project) => {
                            const obj = {
                                id: project.project_id,
                                name: project.project_name,
                            };
                            temp2.push(obj);
                        });
                    });
                }
            }
        });
    } else {
        // setting the project data from the API data
        dropDownData?.map((item) => {
            if (item.developers.length > 0 && selectedDeveloperId.length === 0) {
                item?.developers?.map((developer) => {
                    developer?.companies[0]?.projects.map((project) => {
                        const obj = {
                            id: project.project_id,
                            name: project.project_name,
                        };
                        temp2.push(obj);
                        
                    });
                });
            } else {
                // Use localities data if developers array is empty or developer is not selected
                item?.localities?.map((locality) => {
                    locality?.projects.map((project) => {
                        const obj = {
                            id: project.project_id,
                            name: project.project_name,
                        };
                        temp2.push(obj);
                    });
                });
            }
        });
    }

    setProjectData(temp2);
}, [selectedLocationId, selectedDeveloperId]);



  useEffect(() => {
    // setting the project data from the api data
    let temp2 = [];
    if (selectedDeveloperId && selectedDeveloperId.length > 0) {
      //console.log(selectedDeveloperId);
      dropDownData && dropDownData.map((item) => {
        item.developers && item.developers.map((developer) => {
          if (selectedDeveloperId.includes(developer.developer_id)) {
            developer.companies[0].projects && developer.companies[0].projects.map((project) => {
              temp2.push(project.project_id);
            });
          }
        });
        item.localities && item.localities.map((locality) => {
          locality.independent_developers && locality.independent_developers.map((developer) => {
            if (selectedDeveloperId.includes(developer.developer_id)) {
                developer.companies && developer.companies.map((company) => {
                    company.projects && company.projects.map((project) => {
                     // console.log(project);
                        temp2.push(project.project_id);
                    });
                });
            }
        });
        });
      });
    }
      setApiProjectData((prev) => {
        return [...prev, ...temp2];
      });
    

  }, [selectedDeveloperId]);

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
        setIsFiltersVisible(false);
      }
    };

    // Add event listener when the dropdown is visible
    if (isFiltersVisible && filterContainerRef.current) {
      document.addEventListener("click", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFiltersVisible, filterContainerRef]);

  return (
    <div
      ref={filterContainerRef}
      className=" absolute w-[250px] h-[350px] pr-1 top-9 z-20 bg-white rounded  drop-shadow-2xl border border-[#E1E1E1] "
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
          className="pl-4 pr-4 h-[75%]  overflow-y-scroll pt-1 "
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
                setIsFiltersVisible(false);
              }}
              className="cursor-pointer"
              src={IMAGES.SearchIcon}
              alt="search icon "
            />
            <img
              onClick={() => {
                setIsFiltersVisible(false);
                setselectedFilter(null);
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
