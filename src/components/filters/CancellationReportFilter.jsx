/**
 * @file CancellationReportFilter.jsx
 * @desc This file contains the CancellationReportFilter component, which is responsible for rendering the filter options for the cancellation report.
 * The component fetches dropdown data from an API and allows the user to select filters such as location, developer, project, and date range.
 * The selected filter values are used to generate a JSON request body for the cancellation report.
 * The component also includes functionality to clear all selected filters.
 */
import React, { useEffect, useState, useRef } from "react";
import IMAGES from "../../images";
import axios from "axios";
import CustomMultiSelect from "../RevenueReportPage/CustomMultiSelect";
import DateRangePicker from "../common/DateRangePicker";
import useStore from '../../store/index.jsx';
import Multiselect from 'multiselect-react-dropdown';

const generateJsonBody = (
    selectedDeveloperId,
    selectedProjectId,
    selectedLocationId,
    selectedCompanyId,
    daterange
  ) => {

    const requestBody = {};
  
    if (selectedDeveloperId !== null) {
        const developerIdString = selectedDeveloperId.map(developer => developer.value).join(',');
        requestBody['developer_id'] = developerIdString;
      }
      
      if (selectedProjectId !== null) {
        const projectIdString = selectedProjectId.map(project => project.value).join(',');
        requestBody['project_id'] = projectIdString;
      }
      
      if (selectedLocationId !== null) {
        const locationIdString = selectedLocationId.map(location => location.value).join(',');
        requestBody['location_id'] = locationIdString;
      }
      
      if (selectedCompanyId !== null) {
        const companyIdString = selectedCompanyId.map(company => company.value).join(',');
        requestBody['company_id'] = companyIdString;
      }
      
  
    if (daterange !== null && daterange !== undefined && daterange.startDate !== undefined && daterange.endDate !== undefined) {
      requestBody['startDate'] = daterange.startDate;
      requestBody['endDate'] = daterange.endDate;
    }
  
  
    return requestBody;
  };

const CancellationReportFilter = ({ displayProperty }) => {

    const [dropDownData, setDropDownData] = useState([]);

    const [locationData, setLocationData] = useState([]);
  
    const [selectedLocationId, setSelectedLocationId] = useState([]);
  
    const [selectedComapnyId , setSelectedCompanyId] = useState([]);
  
    const [developerData, setDeveloperData] = useState([]);
  
    const [selectedDeveloperId, setSelectedDeveloperId] = useState([]);
  
    const [projectData, setProjectData] = useState([]);
  
    const [companyData, setCompanyData] = useState([]);
  
    const [selectedProjectId, setSelectedProjectId] = useState([]);
  
    const [daterange , setDaterange] = useState([]);
    const filterContainerRef = useRef(null);

    const [selectedFilter, setselectedFilter] = useState(null);

    const { updateCancellationReportRequestBody } = useStore();

    const getDropDownData = async () => {
        axios.post(`https://aarnainfra.com/ladder2/client/ladderFilter.php`).then((res) => {
          //  setting the dropdown data
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
    
          setCompanyData(
            res?.data?.company?.map((item) => {
              return {
                id: item.company_id,
                name: item.company_name,
              };
            })
          );
    
          
        });
      };
    
      useEffect(() => {
        getDropDownData();
      }, []);

      const requestBody = generateJsonBody(
        selectedDeveloperId,
        selectedProjectId,
        selectedLocationId, 
        selectedComapnyId,
        daterange
      );

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
        setSelectedLocationId([]);
        setSelectedDeveloperId([]);
        setSelectedProjectId([]);
        setSelectedCompanyId([]);
        setDaterange([]);
        let temp = generateJsonBody(null , null , null, null, null);
        updateCancellationReportRequestBody(temp);
      };

      //use effect to map as per the hirarchy

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
            const locationIdString = selectedLocationId.map(location => location.value.toString());
            const locProjId = fetchLocationIds(locationIdString);
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
            const developerIdString = selectedDeveloperId.map(developer => developer.value.toString());
            const devProjId = fetchDeveloperIds(developerIdString);
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
                const developerIdString = selectedDeveloperId.map(developer => developer.value).join(',');
                const locationIdString = selectedLocationId.map(location => location.value.toString());
            const bothIds = filterBoth(developerIdString, locationIdString);
            if(bothIds.length > 0){
                setProjectData(
                    dropDownData.project.filter(project => bothIds.includes(project.project_id))
                    .map(project => ({ id: project.project_id, name: project.project_name }))
                );
            }
        }

        if(selectedComapnyId && dropDownData && dropDownData.project){
            function fetchCompanyIds(companyIDs) {
                const projects = dropDownData.project;
                const projectIds = [];
    
                companyIDs.forEach(companyID => {
                    const filteredProjects = projects.filter(project => project.company_id === String(companyID));
                    const ids = filteredProjects.map(project => project.project_id);
                    projectIds.push(...ids);
                });
    
                return projectIds;
            }
            const companyIdString = selectedComapnyId.map(company => company.value.toString());
            const comProjId = fetchCompanyIds(companyIdString);
            if (comProjId.length > 0) {
                setProjectData(
                    dropDownData.project.filter(project => comProjId.includes(project.project_id))
                    .map(project => ({ id: project.project_id, name: project.project_name }))
                );
            }
        }
    
    }, [selectedLocationId, selectedDeveloperId, dropDownData , selectedComapnyId , selectedProjectId]);


  return (
    <>
    <div
        ref={filterContainerRef}
        style={{ display: displayProperty }}
      className=" absolute w-[250px] pb-10 h-[400px] pr-1 top-11 z-20 bg-white rounded  drop-shadow-2xl border border-[#E1E1E1] "
    >

    {/* Heading Filters OR Saved Fitlers*/}
    <div className="sticky top-0 flex pt-4 bg-white justify-evenly">
        <p
          onClick={() => setFilterOrSavedFilterVisible("filters")}
          className="border-b-2 border-b-[#9A55FF] text-[#9A55FF]
           px-2 pb-1 text-sm font-medium  cursor-pointer"
        >
          Filters
        </p>

       
    </div>

    {/* main filter body  */}

    <div
          id="filter-container"
          className="pl-4 pr-4 h-[85%]  overflow-y-scroll pt-1 filterContainer"
        >
        {/* Branch */}
        <div>
            <div
              onClick={() =>
                setselectedFilter((prev) => (prev === "branch" ? "" : "branch"))
              }
              className="cursor-pointer flex items-center justify-between relative"
            >
              <p
                className={` ${
                  selectedFilter === "branch"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Branch (Location's)
              </p>
              {selectedFilter === "branch" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 rotate-90"
                />
              )}
            </div>
            {selectedFilter === "branch" && (
              <div className="">
                {/* <CustomMultiSelect
                  setValue={setSelectedLocationId}
                  options={locationData}
                /> */}
                <Multiselect
                      options={locationData.map(option => ({
                        name: option.name,
                        value: option.id,
                      }))}
                      showCheckbox
                      selectedValues={selectedLocationId}
                      onSelect={(selectedList, selectedItem) => {
                        setSelectedLocationId(selectedList);
                      }}
                      onRemove={(selectedList, removedItem) => {
                        setSelectedLocationId(selectedList);
                      }}
                      displayValue="name"  
                      placeholder="Select Location"
                      style={{
                        chips: {
                          background: '#bb86fc',
                          fontSize: '12px'
                        },
                        multiselectContainer: {
                          color: 'black',
                        },
                        searchBox: {
                          border: 'none',
                          'border-bottom': '1px solid blue',
                        },
                        option: {
                          height: '35px',
                          fontSize: '12px'
                        }
                      }}
                    />
              </div>
            )}
          </div>

        {/* Developer */}
        <div>
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "developer" ? "" : "developer"
                )
              }
              className="cursor-pointer flex items-center justify-between relative"
            >
              <p
                className={` ${
                  selectedFilter === "developer"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Developer's
              </p>
              {selectedFilter === "developer" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 rotate-90"
                />
              )}
            </div>
            {selectedFilter === "developer" && (
              <div className="">
                {/* <CustomMultiSelect
                  setValue={setSelectedDeveloperId}
                  options={developerData}
                /> */}
                 <Multiselect
                      options={developerData.map(option => ({
                        name: option.name,
                        value: option.id,
                      }))}
                      showCheckbox
                      selectedValues={selectedDeveloperId}
                      onSelect={(selectedList, selectedItem) => {
                        setSelectedDeveloperId(selectedList);
                      }}
                      onRemove={(selectedList, removedItem) => {
                        setSelectedDeveloperId(selectedList);
                      }}
                      displayValue="name"  
                      placeholder="Select developer"
                      style={{
                        chips: {
                          background: '#bb86fc',
                          fontSize: '12px'
                        },
                        multiselectContainer: {
                          color: 'black',
                        },
                        searchBox: {
                          border: 'none',
                          'border-bottom': '1px solid blue',
                        },
                        option: {
                          height: '35px',
                          fontSize: '12px'
                        }
                      }}
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
              className="cursor-pointer flex items-center justify-between "
            >
              <p
                className={` ${
                  selectedFilter === "company"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Company's
              </p>
              {selectedFilter === "company" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 rotate-90"
                />
              )}
            </div>
            {selectedFilter === "company" && (
               <div className="">
                {/* <CustomMultiSelect
                  setValue={setSelectedCompanyId}
                  options={companyData}
                /> */}
                <Multiselect
                      options={companyData.map(option => ({
                        name: option.name,
                        value: option.id,
                      }))}
                      showCheckbox
                      selectedValues={selectedComapnyId}
                      onSelect={(selectedList, selectedItem) => {
                        setSelectedCompanyId(selectedList);
                      }}
                      onRemove={(selectedList, removedItem) => {
                        setSelectedCompanyId(selectedList);
                      }}
                      displayValue="name"  
                      placeholder="Select Company"
                      style={{
                        chips: {
                          background: '#bb86fc',
                          fontSize: '12px'
                        },
                        multiselectContainer: {
                          color: 'black',
                        },
                        searchBox: {
                          border: 'none',
                          'border-bottom': '1px solid blue',
                        },
                        option: {
                          height: '35px',
                          fontSize: '12px'
                        }
                      }}
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
              className="cursor-pointer flex items-center justify-between relative"
            >
              <p
                className={` ${
                  selectedFilter === "Project"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B]"
                } my-2  text-[15px]`}
              >
                Project's
              </p>
              {selectedFilter === "Project" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-2 rotate-90"
                />
              )}
            </div>
            {selectedFilter === "Project" && (
              <div className="">
                {/* <CustomMultiSelect
                  setValue={setSelectedProjectId}
                  options={projectData}
                /> */}
                <Multiselect
                      options={projectData.map(option => ({
                        name: option.name,
                        value: option.id,
                      }))}
                      showCheckbox
                      selectedValues={selectedProjectId}
                      onSelect={(selectedList, selectedItem) => {
                        setSelectedProjectId(selectedList);
                      }}
                      onRemove={(selectedList, removedItem) => {
                        setSelectedProjectId(selectedList);
                      }}
                      displayValue="name"  
                      placeholder="Select Project"
                      style={{
                        chips: {
                          background: '#bb86fc',
                          fontSize: '12px'
                        },
                        multiselectContainer: {
                          color: 'black',
                        },
                        searchBox: {
                          border: 'none',
                          'border-bottom': '1px solid blue',
                        },
                        option: {
                          height: '35px',
                          fontSize: '12px'
                        }
                      }}
                    />
              </div>
            )}
          </div>


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
                Period
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
              className="cursor-pointer"
              src={IMAGES.SearchIcon}
              alt="search icon "
              onClick={() => {
                updateCancellationReportRequestBody(requestBody);
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
              title="Rest All Filters"
            />
          </div> 


        </div>

    {/* main filter body ends  */}
              


    </div>
    </>
  )
}

export default CancellationReportFilter