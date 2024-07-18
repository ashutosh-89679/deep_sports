import { useEffect, useState } from "react";
import IMAGES from "../../images";
import QuickFilter from "./QuickFilter";
import AddLadderModal from "./AddLadderModal";
import FilterContainer from "./DummyFilter";
import axios from "axios";
import AddKickerModal from "./AddKickerModal";
import AddEIModal from "./AddEIModal";
//import AddProjectModal from "./AddProject";

const ActionBar = ({  
  getFilteredKickerData,
  getFilteredEiData,
  projectData,
  getFilteredLadderData,
  daterange,
  setDaterange,
  fetchLader,
  fetchKicker,
  fetchEI,
  selectedQuickFilter,
  setSelectedQuickFilter,
}) => {
  const [isQuickFilterDropdownVisible, setIsQuickFilterDropdownVisible] =
    useState(false);

  const [isAddLadderModalVisible, setIsAddLadderModalVisible] = useState(false);

  const [isAddKickerModalVisible, setIsAddKickerModalVisible] = useState(false);

  const [isEIModalVisible, setIsEIModalVisible] = useState(false);

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  /* const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(
    false
  ); */

  return (
    <>
      <div className="z-20 flex items-center gap-4 py-3 pl-3 pr-5 bg-white">
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
          
            <FilterContainer
              selectedQuickFilter={selectedQuickFilter}
              getFilteredKickerData={getFilteredKickerData}
              projectData={projectData}
              getFilteredLadderData={getFilteredLadderData}
              getFilteredEiData={getFilteredEiData}
              daterange={daterange}
              setDaterange={setDaterange}
              displayProperty={isFiltersVisible ? "block" : "none"}
            />
          
        </div>

        <QuickFilter
          setSelectedQuickFilter={setSelectedQuickFilter}
          selectedQuickFilter={selectedQuickFilter}
          isQuickFilterDropdownVisible={isQuickFilterDropdownVisible}
          setIsQuickFilterDropdownVisible={setIsQuickFilterDropdownVisible}
        />
       {/*  <div
            onClick={() => setIsAddProjectModalVisible(true)}
            className="relative cursor-pointer group"
          >
            <img 
            src={IMAGES.AddP}
            alt="Add Project"
            />
            <div className="tooltiptext absolute invisible text-sm top-[125%] z-20 -left-10 bg-white text-[#6F6B6B] drop-shadow-xl text-center p-1 w-24 rounded group-hover:visible  ">
              Add Master
            </div>
        </div> */}
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
        {/* <img
          onClick={() => {
            selectedQuickFilter === "ladder"
              ? setIsAddLadderModalVisible(true)
              : selectedQuickFilter === "kicker"
              ? setIsAddKickerModalVisible(true)
              : setIsEIModalVisible(true);
          }}
          src={IMAGES.PlusIcon}
          alt="plus icon"
          className="ml-auto cursor-pointer"
        /> */}
      </div>

    {/*   {isAddLadderModalVisible && (
        <AddLadderModal
          fetchLader={fetchLader}
          projectData={projectData}
          onClose={setIsAddLadderModalVisible}
        />
      )}
      {isAddKickerModalVisible && (
        <AddKickerModal
          fetchKicker={fetchKicker}
          projectData={projectData}
          onClose={setIsAddKickerModalVisible}
        />
      )}
      {isEIModalVisible && (
        <AddEIModal
          fetchEI={fetchEI}
          projectData={projectData}
          onClose={setIsEIModalVisible}
        />
      )} */}
      {/* {isAddProjectModalVisible && (
        <AddProjectModal onClose={() => setIsAddProjectModalVisible(false)}  />
      )} */}
    </>
  );
};

export default ActionBar;
