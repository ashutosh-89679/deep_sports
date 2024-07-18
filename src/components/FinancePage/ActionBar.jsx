import { useState } from "react";
import IMAGES from "../../images";
import FilterContainer from "./FilterContainer";
import SortIconComponent from "./SortIconComponent";
import TableFilterIconComponent from "./TableFilterIconComponent";
import AddClient from "./AddClient";

const ActionBar = ({ setTableFilter, tableFilter }) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isClientModalVisible, setIsClientModalVisible] = useState(false);

 
  return (
    <>
      <div className="z-20 flex items-center gap-4 pb-2  pr-5 bg-white border-b border-b-[#F6F6F6] mb-[10px]">
      <div className="relative">
        <img
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsFiltersVisible((prev) => !prev);
          }}
          src={IMAGES.FilterIcon}
          alt="filter icon"
        />
        <FilterContainer displayProperty={isFiltersVisible ? "block" : "none"} />
      </div>

        <div
            onClick={() => window.location.reload(false)}
            className="relative cursor-pointer group"
          >
            <img 
            src={IMAGES.RefreshIcon}
            alt="Refresh"
            />
            <div className="tooltiptext absolute invisible text-sm top-[125%] z-20 -left-10 bg-white text-[#6F6B6B] drop-shadow-xl text-center p-1 w-24 rounded group-hover:visible  ">
              Refresh
            </div>
        </div>

        {/* <div
            className="relative cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              setIsClientModalVisible((prev) => !prev);
            }}
          >
            <img 
            src={IMAGES.AddClientIcon}
            alt="Add Client"
            />
            <div className="tooltiptext absolute invisible text-sm top-[125%] z-20 -left-10 bg-white text-[#6F6B6B] drop-shadow-xl text-center p-1 w-24 rounded group-hover:visible  ">
            Add Client 
            </div>
        </div>
        {isClientModalVisible && (
        <AddClient
          onClose={setIsClientModalVisible}
        />
        )} */}

        {/* <TableFilterIconComponent
          tableFilter={tableFilter}
          setTableFilter={setTableFilter}
        /> */}
      </div>
    </>
  );
};

export default ActionBar;
