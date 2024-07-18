import IMAGES from "../../images";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddInvoiceModal } from "./AddInvoiceModal";

 
const InvoiceModal = ({ clientID, onClose }) => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [type, setType] = useState();
  const [givenDate , setDate] = useState();
  const [isUpdateArrayVisible, setUpdateArrayVisibility] = useState(false);
  const [isAddInvoiceModalOpen, setAddInvoiceModalOpen] = useState(false);

  const openAddInvoiceModal = () => {
    setAddInvoiceModalOpen(true);
  };

  const closeAddInvoiceModal = () => {
    setAddInvoiceModalOpen(false);
  };

  const getData = async () => {
    try {
      const res = await axios.post(
        `https://aarnainfra.com/ladder2/client/getInvoiceDetails.php`,
        { client_id: clientID }
      );
      setInvoiceData(res?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateData = async (client_id, invoice_no) => {
    let requestBody = {
      client_id: client_id,
      invoice_number: invoice_no,
      post_status_id: type,
    };

    // Conditionally add properties based on the type
    if (type === '2') {
      requestBody.submit_date = givenDate;
    } else if (type === '3') {
      requestBody.received_date = givenDate;
    } else if (type === '4') {
      requestBody.cancel_date = givenDate;
    }

    try {
      const res = await axios.post(
        'https://aarnainfra.com/ladder2/client/invoice.php',
        requestBody
      );

      console.log(res);
      if(res.status === 200) {
        toast.success("Invoice Updated Successfully");  
      }
      //console.log(requestBody);
      getData();
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error("Error updating data");
    }
  };
  

  useEffect(() => {
    getData();
  }, [clientID]);

  const toggleUpdateArrayVisibility = () => {
    setUpdateArrayVisibility((prev) => !prev);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
        <div className="modal mx-auto max-h-[80vh] w-[45vw] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none">
          <div className="border-b-2 border-b-[#5B5B5B] sticky top-0 z-10 flex items-center justify-between pb-3 pt-5 bg-white h-fit">
            <span className="text-lg font-semibold">Client</span>
            <button className="bg-[#9A55FF] text-white text-xs flex h-6 w-32 rounded items-center justify-center gap-2 ml-auto mr-3"
            onClick={openAddInvoiceModal}>
              Add New Invoice
              <img src={IMAGES.AddIconWhite} alt="icon" />
            </button>
            {isAddInvoiceModalOpen && (
            <AddInvoiceModal clientID={clientID} onClose={closeAddInvoiceModal} />
             )}
            <img
              onClick={() => onClose((prev) => !prev)}
              className="cursor-pointer"
              src={IMAGES.CloseIcon}
              alt="close icon"
            />
          </div>

          {/* main div */}
          <div className="bg-[#F7F7F7] p-4">
            {invoiceData.data &&
              invoiceData.data.length > 0 &&
              invoiceData.data.map((item, index) => (
                /* start div */
                <div
                  key={index}
                  className="bg-white py-3 px-4 rounded-xl shadow-xl mb-4"
                >
                  <div className="flex items-center border-b border-b-[#F4F4F4] pb-3 justify-between gap-2">
                    <img src={IMAGES.InvoiceYellow} alt="invoice yellow" />
                    <div>
                      <p className="text-xs">Invoice No:</p>
                      <p className="text-[#172B4C] text-xs mt-1">
                        {item.invoice_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">Company Name:</p>
                      <p className="text-[#172B4C] text-xs mt-1">
                        {item.company_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">Invoice Value:</p>
                      <p className="text-[#172B4C] text-xs mt-1">
                        {item.invoice_value}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-5 ml-2">
                    <div className="relative flex flex-col justify-center  flex-1 ">
                      <div
                        className={`z-5 bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center ${
                          item.submit_date !== null || item.received_date !== null
                            ? "bg-[#9A55FF]"
                            : "bg-[#d8c0fb]"
                        }`}
                      >
                        <img src={IMAGES.TickWhite} alt="tick white " className="z-10"/>
                      </div>
                      <div
                        className={`absolute top-[10px]  w-full   h-[2px] ${
                          item.submit_date !== null || item.received_date !== null
                            ? "bg-[#9A55FF]"
                            : "bg-[#d8c0fb]"
                        }`}
                      ></div>

                      <p className="mt-2 text-[#9A55FF] text-xs font-medium">
                        Raised
                      </p>
                    </div>

                    <div className="relative flex flex-1 flex-col justify-center ">
                      <div
                        className={`z-5 bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center ${
                          item.submit_date !== null || item.received_date !== null
                            ? "bg-[#9A55FF]"
                            : "bg-[#d8c0fb]"
                        }`}
                      >
                        <img src={IMAGES.TickWhite} alt="tick white " className="z-10"/>
                      </div>

                      <div
                        className={`absolute top-[10px]  w-full   h-[2px] ${
                          item.submit_date !== null && item.received_date !== null
                            ? "bg-[#9A55FF]"
                            : "bg-[#d8c0fb]"
                        }`}
                      ></div>

                      <p className="mt-2 text-[#9A55FF] text-xs font-medium">
                        Submitted
                      </p>
                    </div>

                    <div className="relative flex flex-1 flex-col justify-center w-3">
                      <div
                        className={`z-5 bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center ${
                          item.submit_date !== null || item.received_date !== null
                            ? "bg-[#9A55FF]"
                            : "bg-[#d8c0fb]"
                        }`}
                      >
                        <img src={IMAGES.TickWhite} alt="tick white " className="z-10" />
                      </div>

                      <p className="mt-2 text-[#9A55FF] text-xs font-medium">
                        Received
                      </p>
                    </div>

                    <div className="flex z-0 justify-center items-center ml-px">
                    <button
                        onClick={toggleUpdateArrayVisibility}
                        className="bg-[#9A55FF] z-0 text-white text-xs flex h-6 w-32 rounded items-center justify-center gap-2 ml-auto mr-3"
                      >
                        Change Status
                    </button>
                    </div>
                  </div>

                  {/* update array */}
                  {isUpdateArrayVisible && (
                    <div className="border-t-2 border-b-[#5B5B5B] w-full mt-4">
                      <div className="bg-grey flex flex-row gap-4 mt-4">
                        {/* Status */}
                        <div className="flex-1">
                        <p className="text-[#696969] font-medium text-sm mb-1">
                          Status
                        </p>
                          <select
                            onChange={(e) => setType(e.target.value)}
                            className="border border-[#CFCFCF] rounded w-full text-[#323030] text-xs pl-2 outline-none h-[30px]"
                          >
                            <option selected hidden>
                              Select Here
                            </option>
                            <option value="2" hidden={item.submit_date !== null && item.received_date !== null} >Submitted</option>
                            <option value="3" hidden={item.received_date !== null}>Received</option>
                            <option value="4" hidden={item.cancellation_date !== null}>Cancelled</option>
                          </select>
                        </div>


                        {/* Submit Date */}
                        <div className="flex-1">
                        <p className="text-[#696969] font-medium text-sm mb-1">
                            {type === "2" ? "Submit Date" : type === "3" ? "Received Date" : type === "4" ? "Cancel Date" : "Select Date"}
                          </p>
                          <input
                            onChange={(e) => {setDate(e.target.value)}}
                            type="date"
                            className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
                          />
                        </div>

                        {/* Expected Date */}
                        <div className="flex-1">
                          <p className="text-[#696969] font-medium text-sm mb-1">
                            Expected Date
                          </p>
                          <input
                            onChange={(e) => setexpectedDate(e.target.value)}
                            type="date"
                            className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-center align-middle mt-4">
                      <button
                          className="bg-[#9A55FF] text-white text-xs flex h-7 w-32 rounded items-center justify-center gap-2  mr-3"
                          onClick={() => updateData(item.client_id, item.invoice_number)}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
              ))}
          </div>
          
        </div>
        
      </div>
      
    </>
  );
};

export default InvoiceModal;


//table container OG
import axios from "axios";
import React, { useEffect, useState , useContext} from "react";
import Loader from "../common/Loader";
import FollowUpModal from "./FollowUpModal";
import TableSeeMore from "./TableSeeMore";
import DetailsModal from "./DetailsModal";
import InvoiceModal from "./InvoiceModal";
import { useFilterContext } from '../../context/FilterContext';


const TableContainer = ({ isSidebarVisible, tableFilter }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);

  const [detailsData, setDetailsData] = useState({});

  const [selectedBookingID, setSelectedBookingID] = useState();

  const [selectedClientId, setSelectedClientID] = useState();

  const { filterData } = useFilterContext();


  if(filterData) {
    console.log(filterData);
    setTableData(filterData);
  }
  



  const fetchTableData = async () => {
    axios
      .get(` https://aarnainfra.com/ladder/client/fetch.php`)
      .then((res) => {
        setTableData(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(tableData);
  useEffect(() => {
    fetchTableData();
  }, []);

  const obStatusStyles = {
    sdr: "text-[#04B900] font-medium text-sm",
    ba_2: "text-[#F5BD1E] font-medium text-sm",
  };


  const configurationIdMapping = {
    1: "1 BHK",
    2: "1.5 BHK",
    3: "2 BHK",
    4: "2.5 BHK",
    5: "3 BHK",
    6: "3.5 BHK",
    7: "4 BHK",
    8: "4.5 BHK",
    9: "5 BHK",
    10: "5.5 BHK",
    11: "MORE THAN 6",
    12: "COMMERCIAL",
    13: "PLOT",
    14: "VILLA",
  };

  const obStatusMapping = {
    1: "BA1",
    2: "BA2",
    3: "SDR",
    4: "BA3",
  };

  const convertAmount = (number) => {
    if (isNaN(number)) {
      return;
    }

    if (number < 100000) {
      return number.toString();
    }

    if (number >= 100000 && number < 10000000) {
      const lakhs = Math.round(number / 100000);
      return `~ ${lakhs} Lacs`;
    }

    if (number >= 10000000) {
      const crores = Math.round(number / 10000000);
      return `~ ${crores} Crore`;
    }
  };

  if (loading) return <Loader />;
  console.log(tableData);
  return (
    <>
      <div
        id="table-container"
        className={`border-t border-t-[#F6F6F6] mx-1  ${
          isSidebarVisible ? " max-w-[78.7vw]" : "max-w-[91vw]"
        } max-h-[75vh] overflow-y-scroll overflow-x-scroll`}
      >
        <table className="w-full">
          <thead className="h-14 bg-[#F7F8FF] ">
            <tr>
              <th className="text-[#9A55FF] font-medium text-base text-start pl-3 min-w-[8vw] ">
                Name
              </th>
              <th className="text-[#9A55FF] font-medium text-base min-w-[13vw] ">
                Project
              </th>
              <th className="text-[#9A55FF] font-medium text-base min-w-[8vw] ">
                Unit <br /> Details
              </th>

              <th className="text-[#9A55FF] font-medium text-base  min-w-[8vw] ">
                Brokerage %
              </th>
              <th className="text-[#9A55FF] font-medium text-base  min-w-[7.8vw] ">
                Ladder %
              </th>
              <th className="text-[#9A55FF] font-medium text-base  min-w-[9vw] ">
                Agreement <br /> Value
              </th>
              <th className="text-[#9A55FF] font-medium text-base  min-w-[7vw] ">
                OB <br /> Status
              </th>
              <th className="text-[#9A55FF] font-medium text-base min-w-[9vw]  ">
                Closure <br /> Date
              </th>
              {tableFilter?.invoice_status && (
                <th className="text-[#9A55FF] font-medium text-base  min-w-[7vw] ">
                  Invoice <br /> Status
                </th>
              )}
              {tableFilter?.number && (
                <th className="text-[#9A55FF] font-medium text-base  min-w-[7vw] ">
                  Contact Number
                </th>
              )}
              {tableFilter?.company_name && (
                <th className="text-[#9A55FF] font-medium text-base  min-w-[7vw] ">
                  Company Name
                </th>
              )}
              <th className="text-[#9A55FF] font-bold text-left text-xl min-w-[2vw]  ">
                ⁝
              </th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((item) => (
              <tr
                className={`h-14 ${
                  item?.invoice_details?.post_raise_id == 4
                    ? "bg-[#ECECEC]"
                    : ""
                }`}
              >
                <td className="pl-3   font-medium text-base text-[#595959]">
                  {item?.generic_details?.name.slice(0, 8)}
                  {item?.generic_details?.name.length > 8 && "..."}
                </td>
                <td className="text-center   text-[#595959] text-sm font-medium">
                  {item?.generic_details?.project_name}
                </td>
                <td className="text-center   text-[#8C8989] text-sm ">
                  {
                    configurationIdMapping[
                      item?.generic_details?.configuration_id
                    ]
                  }
                </td>
                <td className="text-center text-[#8C8989] text-sm ">
                  {item?.fetched_brokerage_percent}
                </td>
                <td className="text-center text-[#8C8989] text-sm ">
                  {item?.fetched_brokerage_percent ===
                  item?.fetched_ladder_percent
                    ? 0
                    : item?.fetched_ladder_percent}
                </td>
                <td className="text-center text-[#8C8989] text-sm ">
                  {convertAmount(+item?.generic_details?.agreement_value)}
                </td>
                <td className={`  text-center text-sm `}>
                  {obStatusMapping[item?.ob_status_details?.status_id]}
                </td>
                <td className="text-center text-sm  text-[#8C8989]">
                  {new Date(
                    item?.generic_details?.closure_date
                  ).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                {tableFilter?.invoice_status && (
                  <td className="text-center text-[#8C8989] text-sm ">
                    Invoice Status
                  </td>
                )}
                {tableFilter?.number && (
                  <td className="text-center text-[#8C8989] text-sm ">
                    {item?.generic_details?.number}
                  </td>
                )}
                {tableFilter?.company_name && (
                  <td className="text-center text-[#8C8989] text-sm ">Dosti</td>
                )}
                <td>
                  <TableSeeMore
                    setSelectedBookingID={setSelectedBookingID}
                    setSelectedClientID = {setSelectedClientID}
                    data={item}
                    setDetailsData={setDetailsData}
                    followUp={setIsFollowUpModalVisible}
                    details={setIsDetailsModalVisible}
                    invoice={setIsInvoiceModalVisible}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      

      {isFollowUpModalVisible && (
        <FollowUpModal
          bookingID={selectedBookingID}
          onClose={setIsFollowUpModalVisible}
        />
      )}
      {isDetailsModalVisible && (
        <DetailsModal
          detailsData={detailsData}
          onClose={setIsDetailsModalVisible}
        />
      )}
      {isInvoiceModalVisible && (
        <InvoiceModal
        clientID={selectedClientId} 
        onClose={setIsInvoiceModalVisible} />
      )}
    </>
  );
};

export default TableContainer;

