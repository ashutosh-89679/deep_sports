import { useState, useEffect } from "react";
import IMAGES from "../images";
import axios from 'axios';
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const NewPcfs = ({ onClose }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [tabledata , setData] = useState([]);


  const handleViewDetails = (details) => {
    // Flatten the nested objects and handle null values
    const flattenObject = (obj, parent = '', res = {}) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const propName = parent ? `${parent}_${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flattenObject(obj[key], propName, res);
                } else {
                    res[propName] = obj[key] === null ? '' : obj[key];
                }
            }
        }
        return res;
    };
    
    const flattenedDetails = flattenObject(details);
    const queryString = new URLSearchParams(flattenedDetails).toString();
    window.open(`/pcfmodal?${queryString}`, '_blank');
};

  const data = [
    {
        bookingDate: "2024-05-01",
        bookingType: "Residential",
        clientName: "John Doe",
        cpFriendly: "Yes",
        projectName: "Sunset Apartments",
        agreementValue: "₹500,000",
        brokerage: "3%",
        tokenAmount: "₹50,000"
    },
    {
        bookingDate: "2024-05-02",
        bookingType: "Commercial",
        clientName: "Jane Smith",
        cpFriendly: "No",
        projectName: "Downtown Plaza",
        agreementValue: "₹1,200,000",
        brokerage: "2.5%",
        tokenAmount: "₹120,000"
    },
    {
        bookingDate: "2024-05-03",
        bookingType: "Industrial",
        clientName: "Acme Corp",
        cpFriendly: "Yes",
        projectName: "Tech Park",
        agreementValue: "₹3,000,000",
        brokerage: "4%",
        tokenAmount: "₹300,000"
    }
  ];

  useEffect(() => {
    axios.post(
      'https://aarnainfra.com/ladder2/client/fetch.php?page=1',
      { closure_desc: "True" }
    )
    .then((response) => {
     // console.log(response.data);
     const filteredData = response?.data.filter(item => !item.count);
      setData(filteredData);
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

  //console.log("Table Data" , tabledata)



  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto select-none max-h-[200vh] h-[70vh] w-[1200px] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none handle">
        {/* Header Div */}
        <div className="sticky top-0 z-50 flex items-center justify-between py-5 bg-white h-fit border-b">
        <div className="font-bold flex items-center">
          New PCF'S 
          <p className="font-normal ml-6">Filter Date: </p>
          <div className="font-normal">
          <DatePicker
              selected={startDate}
              onChange={(update) => setDateRange(update)}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              placeholderText="Select Booking Date"
              className="ml-2 w-[220px] border "
            />
          </div>
        </div>

          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>

        {/* Body Div */}
        <div className="mt-2 w-full">
        <table className="w-full">
  <thead className="border-b text-sm bg-[#F7F8FF] text-[#9A55FF] h-8">
    <tr>
      <th className="border-r">Booking Date</th>
      <th className="border-r">Client Name</th>
      <th className="border-r">Agreement Value</th>
      <th className="border-r">Brokerage %</th>
      <th className="border-r">Number</th>
      <th className="border-r">Developer Name</th>
      <th className="border-r">CP Friendly</th>
      <th className="border-r">Project Name</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody className="text-center">
    {tabledata.map((row, index) => (
      <tr key={index} className={index % 2 === 0 ? "" : "bg-gray-100"}>
        <td className="border-r">{row?.generic_details?.closure_date}</td>
        <td className="border-r">{row?.generic_details?.name}</td>
        <td className="border-r">{row?.generic_details?.agreement_value}</td>
        <td className="border-r">{row?.fetched_brokerage_percent} %</td>
        <td className="border-r">{row?.generic_details?.number}</td>
        <td className="border-r">{row?.developer_name}</td>
        <td className="border-r">{row?.generic_details?.cp_friendly == 'Y' ? "Yes" : "No"}</td>
        <td className="border-r">{row?.generic_details?.project_name}</td>
        <td className="flex justify-center gap-1">
          <span
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleViewDetails(row)}
          >
            <i className="fa-solid fa-eye"></i>
          </span>
          <span className="w-5 h-5 cursor-pointer">
            <i className="fa-regular fa-circle-check"></i>
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>

      </div>
    </div>
  );
};

export default NewPcfs;