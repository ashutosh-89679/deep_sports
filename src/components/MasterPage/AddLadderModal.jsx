import IMAGES from "../../images";
import SingleDatePicker from "../common/SingleDatePicker";
import { useState , useEffect } from "react";
import CustomMultiSelect from "./CustomMultiSelect";
import axios from "axios";
import { toast } from "react-toastify";

const AddLadderModal = ({ fetchLader, onClose, projectData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [ladderType, setLadderType] = useState();
  const [project_Data, setProject_Data] = useState([]);

  const [tableData, setTableData] = useState([
    { minUnit: "", maxUnit: "", percentageUnit: "" },
  ]);


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

  const [file, setFile] = useState(null);

  // to add the table row
  const addRow = () => {
    setTableData([
      ...tableData,
      { minUnit: "", maxUnit: "", percentageUnit: "" },
    ]);
  };

  // fuction to handle the input in the table
  const handleInputChange = (index, fieldName, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][fieldName] = value;
    setTableData(updatedTableData);
  };

  // api call to add the ladder
  const addLadder = async () => {
    if (new Date(startDate.startDate) > new Date(endDate.startDate)) {
      toast.error("Start date should be less than end date");
      return;
    }
    
    console.log(tableData.length);

    if (
      selectedProjectId &&
      startDate?.startDate &&
      endDate?.startDate &&
      ladderType &&
      file &&
      tableData.length > 1
    ) {
      let body = [];
      for (let i = 1; i <= tableData.length; i++) {
        const data = {
          stage: "stage" + i,
          minValue: tableData[i - 1].minUnit,
          maxValue: tableData[i - 1].maxUnit,
          percentValue: tableData[i - 1].percentageUnit,
        };
        body.push(data);
      }
      axios
        .post(`https://aarnainfra.com/ladder2/addLadderApi.php`, body, {
          headers: {
            http_start_date: startDate?.startDate,
            http_end_date: endDate?.startDate,
            http_ladder_type: ladderType,
            http_project_id: selectedProjectId,
          },
        })
        .then((res) => {
          uploadFile(res?.data?.uniqueId);
          toast.success("Ladder Created Successfully");
          onClose((prev) => !prev);
          fetchLader();
          hitCron();
        });
    } else {
      toast.error("Please fill all the fields");
      return;
    }
  };

  // upload creative api call
  const uploadFile = async (id) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", "fresh");
    formData.append("unique_id", id);
    axios
      .post(`https://aarnainfra.com/ladder2/upload.php`, formData)
      .then((res) => {
        toast.success("File Uploaded Successfully");
        hitCron();
      });
  };

  return (
    <div className="fixed  inset-0 z-[100] flex items-start justify-center  overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto max-h-[80vh] w-[560px] overflow-y-scroll rounded-xl bg-white pb-4   pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between pt-5 pb-4 bg-white border-b-[#9A55FF] border-b-2 h-fit">
          <span className="text-lg font-semibold text-[#9A55FF] ">
            Add Ladder
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
            <div className="flex-1">
              <p className="text-[#696969] text-xs font-medium mb-2">
                Ladder Type
              </p>
              <div className="relative h-8 w-full rounded border border-[#E0E0E0] pl-2  text-xs text-[#9D9D9D]">
                <select
                  defaultValue="Select Type"
                  onChange={(e) => setLadderType(e.target.value)}
                  className="w-full appearance-none outline-none h-full"
                >
                  <option hidden disabled value="Select Type">
                    Select Type
                  </option>
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
        </div>

        {/* Table Container */}
        <div className="relative mt-1">
          <img
            onClick={addRow}
            className=" cursor-pointer absolute right-2 top-2"
            src={IMAGES.PlusIcon}
            alt="plus icon"
          />

          <table border="1" className="border border-black w-full">
            <thead>
              <tr className="border border-black text-center h-10">
                <th className="font-medium text-[#9A55FF] text-base">
                  Min Unit
                </th>
                <th className="border border-black font-medium text-[#9A55FF] text-base">
                  Max Unit
                </th>
                <th className="border border-black font-medium text-[#9A55FF] text-base">
                  Percentage Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="border border-black text-center  text-[#595959] font-medium text-base h-10"
                >
                  <td className="border border-black">
                    <input
                      type="number"
                      placeholder="min unit"
                      className=" text-center   outline-none w-20 placeholder:text-xs text-sm text-[#595959]"
                      value={row.minUnit}
                      onChange={(e) =>
                        handleInputChange(index, "minUnit", e.target.value)
                      }
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      placeholder="max unit"
                      className="text-center   outline-none w-20 placeholder:text-xs text-sm text-[#595959]"
                      value={row.maxUnit}
                      onChange={(e) =>
                        handleInputChange(index, "maxUnit", e.target.value)
                      }
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      placeholder="% Unit"
                      className=" text-center   outline-none w-20 placeholder:text-xs text-sm text-[#595959]"
                      value={row.percentageUnit}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "percentageUnit",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addLadder}
          className="outline-none block mx-auto mt-6 bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddLadderModal;
