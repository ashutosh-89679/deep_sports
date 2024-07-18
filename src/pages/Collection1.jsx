import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import IMAGES from "../images";
import axios from "axios";
import FilterContainer from "../components/filters/collection1Filter.jsx";
import useStore from "../store/index.jsx";

const Collection1 = () => {
  const [state, setState] = useState({
    isSidebarVisible: true,
    data: [],
    isFiltersVisible: false,
    totalAgreementValue: 0,
  });

  const { fetchCollection1Data, collectionData, resetAndFetchData } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchCollection1Data();
    };

    fetchData();
  }, [fetchCollection1Data]);

  useEffect(() => {
    if (collectionData !== null) {
      setState((prevState) => ({
        ...prevState,
        data: collectionData,
        totalAgreementValue: collectionData?.data?.[0]?.total_agreement_value || 0,
      }));
    }
  }, [collectionData]);


  const toggleFilters = () => {
    setState((prevState) => ({
      ...prevState,
      isFiltersVisible: !prevState.isFiltersVisible,
    }));
  };

  function calculatePercentage(value, percentage) {
    // Convert percentage to decimal
    var decimalPercentage = percentage / 100;
    
    // Calculate the result
    var result = value * decimalPercentage;
    
    return result;
}


  function formatAmountInCrore(number) {
    if (number >= 10000000) {
      return Math.floor(number / 10000000 * 10) / 10 + "Cr";
    } else if (number >= 100000) {
      return Math.floor(number / 100000 * 10) / 10 + "L";
    } else if (number >= 1000) {
      return Math.floor(number / 1000 * 10) / 10 + "K";
    } else {
      return number?.toString();
    }
  };


  return (
    <>
      <Header />
      <main className="flex gap-5">
        <Sidebar
          isSidebarVisible={state.isSidebarVisible}
          setIsSidebarVisible={(isVisible) =>
            setState((prevState) => ({ ...prevState, isSidebarVisible: isVisible }))
          }
        />
        <section className="flex-1 mr-6 relative mt-4">
          <div className="mb-5 flex gap-3">
            <img
              src={IMAGES.FilterIcon}
              alt="filter icon"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleFilters();
              }}
            />

            <FilterContainer displayProperty={state.isFiltersVisible ? "block" : "none"} />

            <div className="bg-white pl-6 py-2 flex-1 flex items-center gap-4">
              <p className="text-[#5F6C72] text-sm font-bold">Collection 1 Report</p>
            </div>
          </div>

          {/* Displaying various data */}
          <div className="flex gap-5">
            {/* Sales */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Sales</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {formatAmountInCrore(state.totalAgreementValue)}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Total Sales</p>
            </div>

            {/* Sales Unit */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Sales Unit</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.total_booking || 0} Units
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Total Sold Units</p>
            </div>

            {/* Avg. Brokerage */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Avg. Brokerage</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.average_brokerage || 0} %
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Calculated Average Brokerage</p>
            </div>

            {/* Gross Revenue */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Gross Revenue</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {formatAmountInCrore(calculatePercentage(Number(state.totalAgreementValue) , Number(state.data?.data?.[0]?.average_brokerage))) || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Overall Gross Amount</p>
            </div>
          </div>

          <div className="flex gap-5 my-5">
            {/* Net Revenue */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Net Revenue</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {formatAmountInCrore(state.data?.data?.[0]?.net_revenue) || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Total Net Revenue</p>
            </div>
                      
            {/* Invoice Raised */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Invoice Raised</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.total_invoice_raised || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Total Invoices Raised</p>
            </div>
                      
            {/* Invoice Not Raised */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Invoice Not Submitted</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.total_invoice_pending || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Invoices Not Submitted</p>
            </div>
                      
            {/* Outstanding Invoice */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Outstanding Invoice</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.total_outstanding || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Invoices Not Received</p>
            </div>
          </div>
                      
          <div className="flex gap-5">
            {/* Invoice Received */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Invoice Received</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.total_invoice_received || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Received Invoices</p>
            </div>
                      
            {/* Cancellation */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Cancellation</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.total_can || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Total Invoice Cancelled</p>
            </div>
                      
            {/* Cancellation Unit */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Cancellation Unit</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {state.data?.data?.[0]?.total_cancel || 0} {state.data?.data?.[0]?.total_cancel > 1 ? 'Units' : 'Unit'}
                </p>
              <p className="text-[#7E8299] text-sm mt-2">Total Units Cancelled</p>
            </div>
                      
            {/* Total Cashback */}
            <div className="rounded-[10px] bg-white py-3 px-[18px] text-center flex-1">
              <div className="bg-[#158CB0] text-white rounded py-2 text-center">Total Cashback</div>
              <p className="text-[#172B4C] text-[28px] mt-5 border-b border-b-[#F4F4F4] pb-2">
                {formatAmountInCrore(state.data?.data?.[0]?.total_cashback_amount) || 0}
              </p>
              <p className="text-[#7E8299] text-sm mt-2">Total Cashback</p>
            </div>
          </div>

        </section>
      </main>
    </>
  );
};

export default Collection1;


