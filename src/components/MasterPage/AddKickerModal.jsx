import IMAGES from "../../images";
import SingleDatePicker from "../common/SingleDatePicker";
import { useState , useEffect } from "react";
import CustomMultiSelect from "./CustomMultiSelect";
import axios from "axios";
import { toast } from "react-toastify";

const AddKickerModal = ({ fetchKicker, onClose, projectData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [condition , setContionType] = useState('AND');

  const [targetAmt, setTargetAmt] = useState();

  const [targetUnit, setTargetUnit] = useState();

  const [kickerValue , setKickerValue] = useState('');

  const [percentage, setPercentage] = useState('');

  const [file, setFile] = useState(null);


  const [project_Data, setProject_Data] = useState([]);


  //console.log("file ->" , file);
  //console.log("percent" , percentage);

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

  

  const addKicker = async () => {
    if(kickerValue && percentage){
      toast.error("Any one field should be empty Kicker Value or Percentage");
    }
    else if(condition !== null && targetAmt == 0 || targetAmt == null || targetUnit == 0 || targetUnit == null){
        toast.error("Both value should be filled In And condition");
    }
    /* else if(kickerValue == null || kickerValue < 0 && percentage == null || percentage == 0){
      toast.error("Kicker Value or Percentage should be filled");
    } */
    else if (new Date(startDate.startDate) > new Date(endDate.startDate)) {
      toast.error("Start date should be less than end date");
      return;
    }
    else if (
      selectedProjectId &&
      startDate?.startDate &&
      endDate?.startDate &&
      file &&
      condition  
    )  {
      axios
        .post(`https://aarnainfra.com/ladder2/addKickerApi.php`, {
          project_id: selectedProjectId.join(","),
          start_date: startDate?.startDate,
          end_date: endDate?.startDate,
          target_amount: targetAmt || 0,
          target_unit: targetUnit || 0,
          kicker_condition: condition,
          target_percent: percentage || 0,
          kicker_value: kickerValue || 0,
        })
        .then((res) => {
          uploadFile(res?.data?.uniqueId);
          toast.success("Created Successfully");
          onClose((prev) => !prev);
          fetchKicker();
          hitCron();
        })
        .catch((err) => toast.error("Something went wrong"));
    } else {
      toast.error("Please fill all the fields");
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          'https://aarnainfra.com/ladder2/client/bookingdd.php'
        );
        const data = response.data;
       // console.log(data?.project);

        setProject_Data(data?.project);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, []);

  // upload creative api call
  const uploadFile = async (id) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", "fresh");
    formData.append("unique_id", id);
    axios
      .post(`https://aarnainfra.com/ladder2/upload.php`, formData)
      .then(() => {
        // toast.success("File Uploaded Successfully");
        hitCron()
      })
      .catch((err) => toast.error("Something went wrong"));
  };

  return (
    <div className="fixed  inset-0 z-[100] flex items-start justify-center  overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto h-[34rem] max-h-[600vh] w-[560px] overflow-y-scroll rounded-xl bg-white pb-4   pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between pt-5 pb-4 bg-white border-b-[#9A55FF] border-b-2 h-fit">
          <span className="text-lg font-semibold text-[#9A55FF] ">
            Add Kicker
          </span>
          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>
        <div className="px-4 mt-5  pb-5 ">
          <p className="text-[#696969] text-xs font-medium mb-2">
            Select Project
          </p>
          <CustomMultiSelect
            setValue={setSelectedProjectId}
            options={project_Data}
          />
          <div className="flex gap-8 mt-3">
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Start Date
              </p>
              <SingleDatePicker value={startDate} setValue={setStartDate} />
            </div>
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                End Date
              </p>
              <SingleDatePicker value={endDate} setValue={setEndDate} />
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
                  if (e.target.files[0].size > 5000000) {
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
                value={targetUnit}
                placeholder="Target Unit"
                type="number"
                min={1}
                className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]  "
              />
            </div>
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Condition
              </p>
              <select
                  value={condition}
                  defaultValue="Select Condition"
                  onChange={(e) => setContionType(e.target.value)}
                  className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]  "
                >
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
                value={targetAmt}
                placeholder="Target Amount"
                type="number"
                className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]  "
              />
            </div>
          </div>
            <div className="flex gap-8 mt-3">
              <div className="flex-1">
                <p className="text-[#696969] text-xs font-medium mb-2">
                  Kicker Percent
                </p>
                <input
                  onChange={(e) => {
                    const newValue = e.target.value !== '' ? Math.min(e.target.value, 100) : ''
                    setPercentage(newValue);
                  }}
                  value={percentage}
                  placeholder="Percentage"
                  type="number"
                   disabled={kickerValue !== '' } 
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
                  disabled={percentage !== '' && percentage !== 0}
                  className=" outline-none h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]  "
                />
              </div>
            </div>
        </div>

        <button
          onClick={addKicker}
          className="outline-none block mx-auto mt-6 bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddKickerModal;
