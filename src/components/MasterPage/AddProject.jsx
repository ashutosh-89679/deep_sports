import IMAGES from "../../images";
import { useState , useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CustomSelect from "./CustomSingleSelectComp";
import InputWithLabel from "../common/InputWithLabel";


const AddProjectModal = ({ onClose }) => {
  const [companyId , setcompanyId] = useState(null);
  const [data , setData] = useState(null);
  const [projectName , setProjectName] = useState("");
  const [locationId , setlocationId] = useState(null);
  const [localityId , setlocalityId] = useState(null);
  const [developerId , setdeveloperId] = useState(null);
  const [titleId , settitleId] = useState(null);
  const [developerName , setDeveloperName] = useState("");
  const [locationName , setlocationName] = useState("");
  const [localityName , setlocalityName] = useState("");
  const [companyName , setcompanyName] = useState("");
  const [companyAddress , setcompanyAddress] = useState("");
  const [companyGst , setcompanyGst] = useState("");
  const [clearAllSelects, setClearAllSelects] = useState(false);
  const [titleName , settitleName] = useState("");
  const [titleEmail , settitleEmail] = useState("");
  const [titleNumber , settitleNumber] = useState("");


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };
  
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  
  const addData = async (type) => {
    if (type == null) {
      toast.error("Please mention a type");
      return;
    }
  
    let requestData = null;
  
    if (type === "location_name") {
      if(locationName === ""){
        toast.error("Please enter location name");
      }
      requestData = {
        name: locationName,
        type: 'location',
      };
    }

    else if (type === "locality_name") {
      if(localityName === "" || locationId === null){
        toast.error("Select Both location and locality name");
      }
      requestData = {
        name: localityName,
        refrence_id: locationId,
        type: 'locality',
      };
    }

    else if (type === "developer_name") {
      if(developerName ===""){
        toast.error("Entre  Developer Name");
      }
      requestData = {
        name: developerName,
        type: 'developer',
      };
    }
    
    else if (type === "company_name") {
      if(companyName ==="" || developerId === null || companyAddress === "" || companyGst === "" || titleId === null || titleEmail === "" || titleName === "" || titleNumber === ""){
      } else if (!validateEmail(titleEmail)) {
        toast.error("Not a valid email ID");
      } else if (!validatePhoneNumber(titleNumber)) {
        toast.error("Not a valid 10-digit phone number");
      } else if (!validateName(titleName)) {
        toast.error("Name contains invalid characters");
      } else{
        requestData = {
          name: companyName,
          refrence_id: developerId,
          address: companyAddress,
          gst: companyGst,
          title: titleId,
          titleEmail: titleEmail,
          titleNumber: titleNumber,
          titleName: titleName,
          type: 'company',
        };
      }
      
    }

    else if (type === "project_name") {
      if(projectName ==="" || companyId === null || localityId === null){
        toast.error("Select All The Feilds To Add Project");
      }
      requestData = {
        name: projectName,
        refrence_id: companyId,
        refrence_id2: localityId,
        type: 'project',
      };
    }

    if(requestData !== null){
      axios
      .post(`https://aarnainfra.com/ladder2/addFlow.php`, requestData)
      .then((res) => {
        console.log(res);
        if (res?.data?.success) {
          toast.success("Added Successfully");
          setClearAllSelects(true);
        } else{
          toast.error("Empty Or Duplicate Data Not Allowed");
        }
        setProjectName('');
        setlocationId(null);
        setlocalityId('');
        setdeveloperId('');
        setDeveloperName('');
        setlocationName('');
        setlocalityName('');
        setcompanyName('');
        setcompanyGst('');
        settitleId(null);
        setcompanyId(''); 
        fetchDataFunction();
        setcompanyAddress('');  
        settitleEmail('');
        settitleName('');
        settitleNumber('');
      })
      .catch((err) => toast.error("Something went wrong"));
    }
   
  };

  const fetchDataFunction = async () => {
    try {
      // Make a GET request to the API
      const response = await axios.get("https://aarnainfra.com/ladder2/client/bookingdd.php");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const title = [
    { id: 'sourcing', name: 'sourcing' },
    { id: 'crm', name: 'crm' },
    { id: 'account', name: 'Account' },
  ];
  
  useEffect(() => {
    fetchDataFunction();
  }, []);



  return (
    <div className="fixed  inset-0 z-[100] flex items-start justify-center  overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto h-[80vh] w-[700px] overflow-y-scroll rounded-xl bg-white pb-4   pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between pt-5 pb-4 bg-white border-b-[#9A55FF] border-b-2 h-fit">
          <span className="text-lg font-semibold text-[#9A55FF] ">ADD Master</span>
          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
            />
        </div>

          {/* ADD LOCATION */}
           <div className="px-4 mt-8  flex flex-1 gap-3">
            <InputWithLabel
            value={locationName}
            setValue={setlocationName}
            type={"text"}
            name={"Location Name"}
            />
              <button
                onClick={() => addData("location_name")} className="outline-none block mx-auto  bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
              >
                Add
              </button>
            </div>

          {/* ADD LOCALITY */}
           <div className="px-4 mt-6  flex flex-1 gap-3 border-t-2 border-b-[#5B5B5B]">
            <div className="mt-5  flex flex-1 gap-3">
            <InputWithLabel
            value={localityName}
            setValue={setlocalityName}
            type={"text"}
            name={"Locality Name"}
            />
            <CustomSelect
              setChange={setlocationId}
              name={"Select Location"}
              values={data?.location}
              placeholder={"Select Location"}
              clearAll={clearAllSelects}
            /> 

              <button
               onClick={() => addData("locality_name")}
                className="outline-none block mx-auto  bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
              >
                Add
              </button>
              </div>
            </div>

          {/* ADD DEVELOPER */}
          <div className="px-4 mt-6  flex flex-1 gap-3 border-t-2 border-b-[#5B5B5B]">
            <div className="mt-5  flex flex-1 gap-3">
            <InputWithLabel
            value={developerName}
            setValue={setDeveloperName}
            type={"text"}
            name={"Developer Name"}
            />
              <button
                onClick={() => addData("developer_name")}
                className="outline-none block mx-auto  bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
              >
                Add
              </button>
              </div>
          </div>

           {/*   ADD COMPANY */}
           <div className="px-4 mt-5 gap-2 border-t-2 border-b-[#5B5B5B]">
            {/* Row  */}
              <div className="mt-5 flex flex-1 gap-2">
            <InputWithLabel
            value={companyName}
            setValue={setcompanyName}
            type={"text"}
            name={"Company Name"}
            />
            <InputWithLabel
            value={titleEmail}
            setValue={settitleEmail}
            type="email"
            name={"Company Email"}
            />
              <CustomSelect
              setChange={setdeveloperId}
              name={"Select Developer"}
              values={data?.developer}
              placeholder={"Select Developer"}
              clearAll={clearAllSelects}
            />
            
            </div>

            {/* Row 2 */}
            <div className="flex flex-1 gap-2 mt-3">
            <InputWithLabel
            value={titleName}
            setValue={settitleName}
            type={"text"}
            name={"Name"}
            />
             <InputWithLabel
            value={titleNumber}
            setValue={settitleNumber}
            type="number"
            name={"Number"}
            />
            <CustomSelect
              setChange={settitleId}
              name={"Select Title"}
              values={title}
              placeholder={"Select Title"}
              clearAll={clearAllSelects}
            />
            </div>

            <div className="flex flex-1 gap-2 mt-3">
            <InputWithLabel
            value={companyAddress}
            setValue={setcompanyAddress}
            type={"text"}
            placeholder={"Enter Company Address"}
            name={"Company Address"}
            className=" w-full border rounded"
            />
            <InputWithLabel
            value={companyGst}
            setValue={setcompanyGst}
            type={"text"}
            placeholder={"Enter Company GST No"}
            name={"Company GST"}
            className=" w-full border rounded"
            />
            <button
              onClick={() => addData("company_name")}
              className="outline-none block mx-auto  bg-[#9A55FF] text-white rounded text-xs font-semibold  py-1 px-4"
            >
              Add
            </button>
            </div>
            </div>

          {/*   ADD PROJECT */}
            <div className=" mt-6 px-4 flex flex-1 gap-3 pb-5  border-t-2 border-b-[#5B5B5B]">
            <div className="mt-5  flex flex-1 gap-4">
            <InputWithLabel
            value={projectName}
            setValue={setProjectName}
            type={"text"}
            name={"Project Name"}
            />
            <CustomSelect
              setChange={setcompanyId}
              name={"Company"}
              values={data?.company}
              placeholder={"Company"}
              position={"top"}
              clearAll={clearAllSelects}
            /> 
              <CustomSelect
              setChange={setlocalityId}
              name={"Locality"}
              values={data?.locality}
              placeholder={"Locality"}
              position={"top"}
              clearAll={clearAllSelects}
            /> 
              <button
                onClick={() => addData("project_name")}
                className="outline-none block mx-auto  bg-[#9A55FF] text-white rounded text-xs font-semibold  py-2 px-4"
              >
                Add
              </button>
              </div>
            </div>
        
      </div>
    </div>
  );
};

export default AddProjectModal;
