import axios from "axios";
import IMAGES from "../../images";
import SingleDatePicker from "../common/SingleDatePicker";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LadderModal = ({ fetchLader, onClose, modalData }) => {

  console.log(modalData);

  // setting the state if is extended
  const [isExtended, setIsExtended] = useState(
    modalData?.extended_date !== null
  );

  // start date
  const [startDate, setStartDate] = useState(null);

  // end date
  const [endDate, setEndDate] = useState(null);

  // extended date
  const [extendedDate, setExtendedDate] = useState(null);

  // table data
  const [tableData, setTableData] = useState([]);

  // to handle the state to edit the table
  const [isEdit, setIsEdit] = useState(false);

  const [file, setFile] = useState(null);

  const [extendedFile, setExtendedFile] = useState(null);

  const [ladderType, setLadderType] = useState(modalData?.ladder_type);

  function hitCron() {
    fetch('https://aarnainfra.com/ladder2/client/ladderCronjob.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.ok ? console.log('POST request was successful.') : console.error('POST request failed with status:', response.status))
    .catch(error => console.error('Error:', error));
  }


  // fetch the table data from the api
  const fetchTableData = async () => {
    axios
      .post(`https://aarnainfra.com/ladder2/fetchLadderTable.php`, {
        ladder_id: modalData?.ladder_id,
      })
      .then((res) => setTableData(res?.data))
      .catch((err) => toast.error("Error in fetching table data"));
  };
  useEffect(() => {
    // setting the start date on load
    setStartDate({
      startDate: modalData?.start_date,
      endDate: modalData?.start_date,
    });

    // setting the end date on load
    setEndDate({
      startDate: modalData?.end_date,
      endDate: modalData?.end_date,
    });
    // setting the extended date on load
    setExtendedDate({
      startDate: modalData?.extended_date,
      endDate: modalData?.extended_date,
    });

    // fetching the table data
    fetchTableData();
  }, []);

  // updating single ladder api call
  // this created a new ladder id
  const updateSingleLadder = async () => {
    if (
      isExtended &&
      new Date(extendedDate.startDate) < new Date(endDate.startDate)
    ) {
      toast.error("Extended date should not be less than end date");
      return;
    }
    axios
      .post(`https://aarnainfra.com/ladder2/updateLadder.php`, tableData, {
        headers: {
          http_start_date: startDate.startDate,
          http_end_date: endDate.startDate,
          http_extended_date: isExtended ? extendedDate?.startDate : null,

          http_operation_type: "single",
          http_project_id: modalData?.project_id,
          http_single_unique_id: modalData?.ladder_id,
          http_ladder_type: ladderType,
        },
      })
      .then((res) => {
        if (file) uploadFreshFile(res?.data?.uniqueId);
        if (extendedFile) uploadExtendedFile(res?.data?.uniqueId);
        toast.success("Ladder Updated Successfully");
        onClose(false);
        fetchLader();
        hitCron();
      });
  };

  // updating mutliple ladder
  // this updates all the projects the the given ladder id
  const updateMultipleLadder = async () => {

    if (
      isExtended &&
      new Date(extendedDate.startDate) < new Date(endDate.startDate)
    ) {
      toast.error("Extended date should not be less than end date");
      return;
    }

    else if(isExtended &&!extendedFile &&   modalData?.extended_date == null){
      toast.error("Extended file is required");
    } else {

    

    axios
      .post(`https://aarnainfra.com/ladder2/updateLadder.php`, tableData, {
        headers: {
          http_start_date: startDate.startDate,
          http_end_date: endDate.startDate,
          http_unique_id: modalData?.ladder_id,
          http_extended_date: isExtended ? extendedDate?.startDate : null,
          http_operation_type: "multiple",
          http_ladder_type: ladderType,
        },
      })
      .then((res) => {
        if (file) uploadFreshFile();
        if (extendedFile) uploadExtendedFile();
        toast.success(`${modalData.project_name} Updated Successfully`);
        fetchLader();
        hitCron();
        onClose((prev) => !prev);
      });
    }
  };

  // function to handle the input in the table
  const handleInputChange = (index, fieldName, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][fieldName] = value;
    setTableData(updatedTableData);
  };
  // upload creative api call
  const uploadFreshFile = async (id) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", "fresh");
    formData.append("unique_id", id || modalData?.ladder_id);
    axios
      .post(`https://aarnainfra.com/ladder2/upload.php`, formData)
      .then((res) => {
        toast.success("Fresh File Uploaded Successfully");
        hitCron();
      })
      .catch((err) => {
        toast.error("Error in uploading fresh file");
      });
  };

  const uploadExtendedFile = async (id) => {
    const formData = new FormData();
    formData.append("file", extendedFile);
    formData.append("file_type", "extended");
    formData.append("unique_id", id || modalData?.ladder_id);
    axios
      .post(`https://aarnainfra.com/ladder2/upload.php`, formData)
      .then((res) => {
        toast.success("Extended File Uploaded Successfully");
        hitCron();
      });
  };
  return (
    <div className="fixed  inset-0 z-[100] flex items-start justify-center  overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto max-h-[80vh] w-[800px] overflow-y-scroll rounded-xl bg-white pb-4   pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between pt-5 pb-4 bg-white border-b-[#9A55FF] border-b-2 h-fit">
          <span className="text-lg font-semibold text-[#9A55FF] ">
           Update Ladder For {modalData?.project_name}
          </span>
          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>
        <div className="px-4 mt-5 border-b-2 border-b-[#9A55FF] pb-5">
          <div className="flex gap-8">
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Start Date
              </p>
              <SingleDatePicker
                isDisabled={true}
                value={startDate}
                setValue={setStartDate}
              />
            </div>
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                End Date
              </p>
              <SingleDatePicker
                isDisabled={true}
                value={endDate}
                setValue={setEndDate}
              />
            </div>
          </div>

          <div className="flex gap-8 mt-3">
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Creatives
              </p>
              <input
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0].size > 2000000) {
                    toast.error("File size should be less than 2mb");
                  } else {
                    setFile(e.target.files[0]);
                  }
                }}
                type="file"
                className=" h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D] file:mr-4 file:mt-[3px]     file:h-6 file:w-20 file:rounded-md file:border-0 file:bg-[#9A55FF]   file:text-xs file:text-white "
              />
            </div>
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Ladder Type
              </p>
              <div className="relative h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]">
                <select
                  onChange={(e) => setLadderType(e.target.value)}
                  className="w-full appearance-none outline-none h-full"
                  defaultValue={modalData?.type}
                >
                  <option value="introspective">Introspective</option>
                  <option value="retrospective">Retrospective</option>
                </select>
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="absolute top-[40%] user-select-none left-[92%] rotate-180"
                />
              </div>
            </div>
          </div>

          {isExtended && (
            <div className="flex gap-8 mt-3">
              <div className="flex-1">
                <p className="text-[#696969] text-xs font-medium mb-2">
                  Extended Date
                </p>
                <SingleDatePicker
                  value={extendedDate}
                  setValue={setExtendedDate}
                />
              </div>

              <div className="flex-1">
                <p className="text-[#696969] text-xs font-medium mb-2">
                  Extended Creatives
                </p>
                <input
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0].size > 2000000) {
                      toast.error("File size should be less than 2mb");
                    } else {
                      setExtendedFile(e.target.files[0]);
                    }
                  }}
                  type="file"
                  className=" h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D] file:mr-4 file:mt-[3px]     file:h-6 file:w-20 file:rounded-md file:border-0 file:bg-[#9A55FF]   file:text-xs file:text-white "
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 justify-center mt-6">
            <label className="relative inline-flex items-center cursor-pointer ">
              <span className="mr-2 text-sm font-semibold text-[#9A55FF] leading-none">
                Extended
              </span>

              <input
                checked={isExtended}
                onChange={(e) => {
                  setIsExtended(e.target.checked);
                  if (!e.target.checked) {
                    setExtendedDate(null);
                  }
                }}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-7 h-[14px] bg-gray-200 peer-focus:outline-none  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[10px] after:w-[14px] after:transition-all  peer-checked:bg-[#9A55FF]"></div>
            </label>

            <a
              target="_blank"
              href={`https://aarnainfra.com/ladder2/download2.php?file_type=fresh&master_type=ladder&unique_id=${modalData?.ladder_id}`}
              className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
            >
              Download Creative
            </a>
            <a
              target="_blank"
              href={`https://aarnainfra.com/ladder2/view.php?file_type=fresh&unique_id=${modalData?.ladder_id}`}
              className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
            >
              View Creative
            </a>
            {modalData?.extended_date !== null && (
              <>
              <a
                href={`https://aarnainfra.com/ladder2/download2.php?file_type=extended&master_type=ladder&unique_id=${modalData?.ladder_id}`}
                className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
              >
                Download Ext. Creative
              </a>
              <a
               target="_blank"
                href={`https://aarnainfra.com/ladder2/view.php?file_type=extended&unique_id=${modalData?.ladder_id}`}
                className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
              >
                View Ext. Creative
              </a>
              </>
            )}
          </div>
        </div>

        {/* Table Container */}

        <div className="relative">
          <img
            onClick={() => setIsEdit(true)}
            className="absolute right-2 top-2"
            src={IMAGES.EditIconNew}
            alt="edit icon"
          />
          <table className="w-full">
            <thead>
              <tr className="text-center h-10">
                <th className="font-medium text-[#9A55FF] text-base ">
                  Min Unit
                </th>
                <th className="font-medium text-[#9A55FF] text-base ">
                  Max Unit
                </th>
                <th className="font-medium text-[#9A55FF] text-base ">
                  Percentage Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((data, index) => (
                <tr
                  key={data?.stage}
                  className={`text-center  ${
                    index % 2 === 0 ? "bg-[#F4F4F4]" : ""
                  }  text-[#595959] font-medium  text-base h-10`}
                >
                  <td>
                    <input
                      className=" text-center   outline-none w-20 placeholder:text-xs text-sm text-[#595959]"
                      type="number"
                      onChange={(e) =>
                        handleInputChange(index, "min", e.target.value)
                      }
                      value={data?.min}
                      disabled={!isEdit}
                    />
                  </td>
                  <td>
                    <input
                      className=" text-center   outline-none w-20 placeholder:text-xs text-sm text-[#595959]"
                      type="number"
                      onChange={(e) =>
                        handleInputChange(index, "max", e.target.value)
                      }
                      value={data?.max}
                      disabled={!isEdit}
                    />
                  </td>
                  <td>
                    <input
                      className=" text-center   outline-none w-20 placeholder:text-xs text-sm text-[#595959]"
                      type="number"
                      onChange={(e) =>
                        handleInputChange(index, "percent", e.target.value)
                      }
                      value={data?.percent}
                      disabled={!isEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    {/* Update Button */} 
   
        <div className="flex justify-center gap-4">
        {modalData?.link == "multiple" && (
          <button
          onClick={updateSingleLadder}
          className=" mt-6 bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
          >
          Update Associated Ladder
          </button>
              )}
          <button
            onClick={updateMultipleLadder}
            className="mt-6 bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
          >
            Update  Ladder
          </button>
        </div>
      </div>
    </div>
  );
};

export default LadderModal;
