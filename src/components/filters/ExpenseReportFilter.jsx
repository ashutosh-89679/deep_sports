import IMAGES from "../../images/index.js";
import axios from "axios";
import DateRangePicker from "../common/DateRangePicker.jsx";
import React, { useEffect, useState, useRef } from "react";
import Multiselect from 'multiselect-react-dropdown';
import useStore from "../../store/index.jsx";


const generateJsonBody = (
  selectedCategoryId,
  selectedSubCategoryId,
  selectedMerchantId,
  selectedTypeId,
  selectedLocationId,
  daterange,
) => {
  const requestBody = {};

 // Assuming each selected variable is an array of objects like [{name: 'Name', value: '1'}]

if (selectedCategoryId !== null) {
  const categoryIdString = selectedCategoryId.map(category => category.value).join(',');
  requestBody["category_id"] = categoryIdString;
}

if (selectedSubCategoryId !== null) {
  const subCategoryIdString = selectedSubCategoryId.map(subCategory => subCategory.value).join(',');
  requestBody["sub_category_id"] = subCategoryIdString;
}

if (selectedMerchantId !== null) {
  const merchantIdString = selectedMerchantId.map(merchant => merchant.value).join(',');
  requestBody["merchant_id"] = merchantIdString;
}

if (selectedLocationId !== null) {
  const locationIdString = selectedLocationId.map(location => location.value).join(',');
  requestBody["location_id"] = locationIdString;
}

  if (selectedTypeId !== null) {
    const typeIdString = selectedTypeId.map(type => type.value).join(',');
    requestBody["type_id"] = typeIdString;
  }
  
  if(daterange !== null) {
    if(daterange.startDate != null && daterange.endDate != null || daterange.startDate != "" && daterange.endDate != "" || daterange.startDate != undefined && daterange.endDate != undefined) {
    requestBody['start_date'] = daterange.startDate;
    requestBody['end_date'] = daterange.endDate;
    }
  }

  return requestBody;
};


const FilterContainer = ({ displayProperty }) => {

    //state to update request body 

    const { updateExpenseReportRequestBody } = useStore();

    //visbility state
    const filterContainerRef = useRef(null);
    const [selectedFilter, setselectedFilter] = useState(null);
    const [filterOrSavedFilterVisible, setFilterOrSavedFilterVisible] = useState("filters");

    // options state 
    const [categoriesOptions, setCategoriesOptions] = useState([]);
    const [SubCategoriesOptions, setSubCategoriesOptions] = useState([]);
    const [merchantsOptions, setMerchantsOptions] = useState([]);
    const [TransactionsOptions, setTransactionsOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [appliedByOptions, setAppliedByOptions] = useState([]);
    
    // selected options state
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
    const [selectedMerchantId, setSelectedMerchantId] = useState(null);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [daterange , setDateRange] = useState(null);


    

    // use effect for filling options 
    const url = 'https://aarnainfra.com/ladder2/client/office_expense/main.php';

    useEffect(() => {
        const getDropdownData = async () => {
            try {
                const response = await axios.get(url);
                if (response?.data?.category) {
                    setCategoriesOptions(response?.data?.category);
                    setSubCategoriesOptions(response?.data?.sub_category);
                    setMerchantsOptions(response?.data?.merchant);
                    setTransactionsOptions(response?.data?.transaction);
                    setTypeOptions(response?.data?.type);
                    setLocationOptions(response?.data?.location);
                    setAppliedByOptions(response?.data?.employee);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        getDropdownData();  
    }, []);

    const clearAllFields = () => {
        setselectedFilter(null);
        setSelectedCategoryId(null);
        setSelectedSubCategoryId(null);
        setSelectedMerchantId(null);
        setSelectedTypeId(null);
        setSelectedLocationId(null);
        setDateRange(null);
        let temp = generateJsonBody(null , null , null , null , null , null)
        updateExpenseReportRequestBody(temp);
    }

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


    const requestBody = generateJsonBody(
      selectedCategoryId,
      selectedSubCategoryId,
      selectedMerchantId,
      selectedTypeId,
      selectedLocationId,
      daterange
    );

    return (
        <div
        ref={filterContainerRef}
        style={{ display: displayProperty }}
        className=" absolute w-[250px] pb-10 h-[350px] pr-1 top-11 z-20 bg-white rounded  drop-shadow-2xl border border-[#E1E1E1] "
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
    
          
          </div>
    
          {/* Filters Div's visible when filterOrSavedFilterVisible is filters*/}
          {filterOrSavedFilterVisible === "filters" && (
            <div
              id="filter-container"
              className="pl-4 pr-4 h-[100%]  overflow-y-scroll pt-1 filterContainer"
            >
           
              {/* Type  */}

              <div>
                <div
                  onClick={() =>
                    setselectedFilter((prev) =>
                      prev === "Type" ? "" : "Type"
                    )
                  }
                  className="cursor-pointer flex items-center justify-between"
                >
                  <p
                    className={` ${
                      selectedFilter === "Type"
                        ? "text-[#9A55FF] font-medium"
                        : "text-[#6F6B6B]"
                    } my-2  text-[15px]`}
                  >
                    Type
                  </p>
                  {selectedFilter === "Type" && (
                    <img
                      src={IMAGES.ArrowIcon}
                      alt="arrow icon"
                      className="mr-2 "
                    />
                  )}
                </div>
                {selectedFilter === "Type" && (
                  <div className="">
                    <Multiselect
                      options={typeOptions.map(option => ({
                        name: option.label,
                        value: option.value,
                      }))}
                      showCheckbox
                      selectedValues={selectedTypeId}
                      onSelect={(selectedList, selectedItem) => {
                        setSelectedTypeId(selectedList);
                      }}
                      onRemove={(selectedList, removedItem) => {
                        setSelectedTypeId(selectedList);
                      }}
                      displayValue="name"  
                      placeholder="Select Type"
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
    
                {/* Category  */}

                <div>
                <div
                  onClick={() =>
                    setselectedFilter((prev) =>
                      prev === "Category" ? "" : "Category"
                    )
                  }
                  className="cursor-pointer flex items-center justify-between"
                >
                  <p
                    className={` ${
                      selectedFilter === "Category"
                        ? "text-[#9A55FF] font-medium"
                        : "text-[#6F6B6B]"
                    } my-2  text-[15px]`}
                  >
                    Category
                  </p>
                  {selectedFilter === "Category" && (
                    <img
                      src={IMAGES.ArrowIcon}
                      alt="arrow icon"
                      className="mr-2 "
                    />
                  )}
                </div>
                {selectedFilter === "Category" && (
                  <div className="">
                      <Multiselect
                 options={categoriesOptions.map(option => ({
                    name: option.label,
                    value: option.value,
                  }))}
                showCheckbox
                selectedValues={selectedCategoryId}
                onSelect={(selectedList, selectedItem) => {
                  setSelectedCategoryId(selectedList);
                }}
                onRemove={(selectedList, removedItem) => {
                  setSelectedCategoryId(selectedList);
                }}
                displayValue="name"  
                placeholder="Select Category"
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

                {/* Sub Category  */}

                <div>
                <div
                  onClick={() =>
                    setselectedFilter((prev) =>
                      prev === "sub_category" ? "" : "sub_category"
                    )
                  }
                  className="cursor-pointer flex items-center justify-between"
                >
                  <p
                    className={` ${
                      selectedFilter === "sub_category"
                        ? "text-[#9A55FF] font-medium"
                        : "text-[#6F6B6B]"
                    } my-2  text-[15px]`}
                  >
                    Sub Category
                  </p>
                  {selectedFilter === "sub_category" && (
                    <img
                      src={IMAGES.ArrowIcon}
                      alt="arrow icon"
                      className="mr-2 "
                    />
                  )}
                </div>
                {selectedFilter === "sub_category" && (
                  <div className="">
                    <Multiselect
                      options={SubCategoriesOptions.map(option => ({
                        name: option.label,
                        value: option.value,
                      }))}
                      showCheckbox
                      selectedValues={selectedSubCategoryId}
                      onSelect={(selectedList, selectedItem) => {
                        setSelectedSubCategoryId(selectedList);
                      }}
                      onRemove={(selectedList, removedItem) => {
                        setSelectedSubCategoryId(selectedList);
                      }}
                      displayValue="name"  
                      placeholder="Select Sub Category"
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

                {/* Location  */}

                <div>
                <div
                  onClick={() =>
                    setselectedFilter((prev) =>
                      prev === "Location" ? "" : "Location"
                    )
                  }
                  className="cursor-pointer flex items-center justify-between"
                >
                  <p
                    className={` ${
                      selectedFilter === "Location"
                        ? "text-[#9A55FF] font-medium"
                        : "text-[#6F6B6B]"
                    } my-2  text-[15px]`}
                  >
                    Location
                  </p>
                  {selectedFilter === "Location" && (
                    <img
                      src={IMAGES.ArrowIcon}
                      alt="arrow icon"
                      className="mr-2 "
                    />
                  )}
                </div>
                {selectedFilter === "Location" && (
                  <div className="">
                     <Multiselect
                options={locationOptions.map(option => ({
                    name: option.label,
                    value: option.value,
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

               {/* Merchant  */}

                <div>
                <div
                  onClick={() =>
                    setselectedFilter((prev) =>
                      prev === "Merchant" ? "" : "Merchant"
                    )
                  }
                  className="cursor-pointer flex items-center justify-between"
                >
                  <p
                    className={` ${
                      selectedFilter === "Merchant"
                        ? "text-[#9A55FF] font-medium"
                        : "text-[#6F6B6B]"
                    } my-2  text-[15px]`}
                  >
                    Merchant
                  </p>
                  {selectedFilter === "Merchant" && (
                    <img
                      src={IMAGES.ArrowIcon}
                      alt="arrow icon"
                      className="mr-2 "
                    />
                  )}
                </div>
                {selectedFilter === "Merchant" && (
                  <div className=" z-auto">
                     <Multiselect
                options={merchantsOptions.map(option => ({
                    name: option.label,
                    value: option.value,
                  }))}
                showCheckbox
                selectedValues={selectedMerchantId}
                onSelect={(selectedList, selectedItem) => {
                  setSelectedMerchantId(selectedList);
                }}
                onRemove={(selectedList, removedItem) => {
                  setSelectedMerchantId(selectedList);
                }}
                displayValue="name"  
                placeholder="Select Merchant"
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
                    <DateRangePicker value={daterange} setValue={setDateRange} />
                  </div>
                )}
                </div>


    
              {/* Icon's Container (search, clear all, save filters)*/}
              <div className="fixed bottom-0 right-2 flex items-center  justify-end mt-11 mr-3 mb-2 gap-3 py-1 bg-white ">
                <img
                  className="cursor-pointer"
                  src={IMAGES.SearchIcon}
                  alt="search icon "
                   onClick={() => {
                    updateExpenseReportRequestBody(requestBody);
                  } 
                } 
                />
                <img
                  onClick={() => {
                    setselectedFilter(null);
                    clearAllFields();
                  }}
                  className="cursor-pointer"
                  src={IMAGES.ClearAllIcon}
                  alt="clear all icon"
                />
              </div>
            </div>
          )}
    

    
    
        </div>
            )
}

export default FilterContainer;
