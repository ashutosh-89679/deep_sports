import axios from "axios";
import IMAGES from "../../images";
import SingleDatePicker from "../common/SingleDatePicker";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const KickerModal = ({ fetchKicker, onClose, modalData }) => {

  //console.log(modalData);

  const [isExtended, setIsExtended] = useState(
    modalData?.extended_date !== null
  );

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [extendedDate, setExtendedDate] = useState(null);

  const [targetAmt, setTargetAmt] = useState(null);

  const [targetUnit, setTargetUnit] = useState(null);

  const [percentage, setPercentage] = useState(null);

  const [kickerValue , setKickerValue] = useState();

  const [condition , setCondtionType] = useState('');

  const [file, setFile] = useState(null);

  const [extendedFile, setExtendedFile] = useState(null);

  useEffect(() => {
    setStartDate({
      startDate: modalData?.start_date,
      endDate: modalData?.start_date,
    });
    setEndDate({
      startDate: modalData?.end_date,
      endDate: modalData?.end_date,
    });
    setExtendedDate({
      startDate: modalData?.extended_date,
      endDate: modalData?.extended_date,
    });

    setTargetAmt(modalData?.target_amount);

    setTargetUnit(modalData?.target_unit);

    setCondtionType(modalData?.kicker_condition);

    setPercentage(modalData?.target_percent);

    setKickerValue(modalData?.kicker_value);
  }, []);

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

  const updateKicker = async () => {
    if (!(targetAmt || targetUnit) && !percentage ) {
      toast.error("Please fill all the value");
      return;
    }

    if (
      isExtended &&
      new Date(extendedDate.startDate) < new Date(endDate.startDate)
    ) {
      toast.error("Extended date should not be less than end date");
      return;
    }


if(condition == "OR" && targetAmt == 0 || targetAmt == null && targetUnit == 0 || targetUnit == null){
    toast.error("Any one value should be filled In Or condition");
}
else if(condition == "AND" && targetAmt == 0 || targetAmt == null || targetUnit == 0 || targetUnit == null){
    toast.error("Both value should be filled In And condition");
}
  else{
    axios
      .post("https://aarnainfra.com/ladder2/updateKicker.php", {
        start_date: startDate.startDate,
        end_date: endDate.startDate,
        target_amount: targetAmt,
        target_unit: targetUnit,
        kicker_condition: condition,
        target_percent: percentage,
        kicker_value: kickerValue,
        unique_id: modalData?.kicker_id,
        extended_date: isExtended ? extendedDate?.startDate : null,
      })
      .then((res) => {
        if (file) uploadFreshFile();
        if (extendedFile) uploadExtendedFile();
        toast.success(`${modalData.project_name} Updated Successfully`);
        fetchKicker();
        hitCron();
        onClose((prev) => !prev);
      })
      .catch((err) => toast.error("Error occured in updating Kicker"));
    }
  };

  const uploadFreshFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", "fresh");
    formData.append("unique_id", modalData?.kicker_id);
    axios
      .post(`https://aarnainfra.com/ladder2/upload.php`, formData)
      .then((res) => {
        // toast.success("Fresh File Uploaded Successfully");
        hitCron();
      });
  };

  const uploadExtendedFile = async () => {
    const formData = new FormData();
    formData.append("file", extendedFile);
    formData.append("file_type", "extended");
    formData.append("unique_id", modalData?.kicker_id);
    axios
      .post(`https://aarnainfra.com/ladder2/upload.php`, formData)
      .then((res) => {
        // toast.success("Extended File Uploaded Successfully");
        hitCron();
      });
  };

  //console.log(modalData.target_percent);

  return (
    <div className="fixed  inset-0 z-[100] flex items-start justify-center  overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto max-h-[80vh] w-[800px] overflow-y-scroll rounded-xl bg-white pb-4   pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between pt-5 pb-4 bg-white border-b-[#9A55FF] border-b-2 h-fit">
          <span className="text-lg font-semibold text-[#9A55FF] ">
           Update Kicker For {modalData?.project_name}
          </span>
          <img
            onClick={() => onClose(false)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>
        <div className="px-4 mt-5  pb-5">
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

          </div>

          <div className="flex gap-8 mt-3">
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Target Unit
              </p>
              <input
                onChange={(e) => setTargetUnit(e.target.value)}
                value={targetUnit > 0 ? targetUnit : ''}
                placeholder="Target Unit"
                type="number"
                className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]  "
              />
            </div>

            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Condition
              </p>
              <select
                  defaultValue="Select Condition"
                  onChange={(e) => setCondtionType(e.target.value)}
                  className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]  "
                  value={condition}
                >
                  <option hidden disabled value="">
                    Select Condition
                  </option>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
            </div>

            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Target Amount
              </p>
              <input
                onChange={(e) => setTargetAmt(e.target.value)}
                value={targetAmt > 0 ? targetAmt : ''}
                placeholder="Target Amount"
                type="number"
                className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]  "
              />
            </div>

            
          </div>

          <div className="flex gap-8 mt-3">
          <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Percentage
              </p>
              <input
                onChange={(e) => setPercentage(Math.min(e.target.value, 100))}
                value={percentage} 
                placeholder="Percentage"
                type="number"
                max={100}
                disabled={modalData?.target_percent == "0" || modalData?.target_percent == null}
                className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D] file:mr-4 file:mt-[3px]     file:h-6 file:w-20 file:rounded-md file:border-0 file:bg-[#9A55FF]   file:text-xs file:text-white "
              />
            </div>


            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Kicker Value
              </p>
              <input
                onChange={(e) => setKickerValue(e.target.value)}
                value={kickerValue}
                placeholder="Kicker Value"
                type="number"
                disabled={modalData.kicker_value == null || modalData.kicker_value == "0"}
                className="outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2 text-xs text-[#9D9D9D]"
              />
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
                onChange={(e) => setIsExtended(e.target.checked)}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-7 h-[14px] bg-gray-200 peer-focus:outline-none  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[10px] after:w-[14px] after:transition-all  peer-checked:bg-[#9A55FF]"></div>
            </label>

            <a
              target="_blank"
              href={`https://aarnainfra.com/ladder2/download2.php?file_type=fresh&master_type=kicker&unique_id=${modalData?.kicker_id}`}
              className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
            >
              Download Creative
            </a>
            <a
              target="_blank"
              href={`https://aarnainfra.com/ladder2/view.php?file_type=fresh&unique_id=${modalData?.kicker_id}`}
              className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
            >
              view Creative
            </a>
            {modalData?.extended_date !== null && (
              <>
                <a
                  target="_blank"
                  href={`https://aarnainfra.com/ladder2/download2.php?file_type=extended&master_type=kicker&unique_id=${modalData?.kicker_id}`}
                  className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
                >
                  Download Ext. Creative
                </a>
                <a
                  target="_blank"
                  href={`https://aarnainfra.com/ladder2/view.php?file_type=extended&unique_id=${modalData?.kicker_id}`}
                  className="bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
                >
                  View Ext. Creative
                </a>
              </>
            )}
          </div>
        </div>
        <button
          onClick={updateKicker}
          className="block mx-auto mt-3 bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default KickerModal;
