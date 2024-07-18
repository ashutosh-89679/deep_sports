import React, { useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import ActionBar from "../components/FinancePage/ActionBar";
import TableContainer from "../components/FinancePage/TableContainer";
import IMAGES from "../images";
import { useFilterContext } from "../context/FilterContext";


const FinanacePage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [IsActionBarVisible, setIsActionBarVisible] = useState(true);

  const [tableFilter, setTableFilter] = useState({
    invoice_status: false,
    number: false,
    company_name: false,
  });

  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 my-4 ml-4 mr-7 p-3 pr-0 rounded bg-white">
          {IsActionBarVisible && (
            <ActionBar
              tableFilter={tableFilter}
              setTableFilter={setTableFilter}
            />
          )}

          <div className="relative">
            <img
              onClick={() => setIsActionBarVisible(!IsActionBarVisible)}
              src={IMAGES.YellowToggleIcon}
              alt="yellow toggle icon"
              className={`${
                IsActionBarVisible ? "rotate-180" : ""
              } absolute top-4 -right-6 cursor-pointer z-50`}
            />
            <TableContainer
              isSidebarVisible={isSidebarVisible}
              tableFilter={tableFilter}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default FinanacePage;
