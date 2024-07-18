import { useState, useEffect  } from "react";
import IMAGES from "../images";
import Select from 'react-select';
import axios from 'axios';
import { toast } from "react-toastify";

const AddEmployee = ({onClose}) => {

  const [locationOptions , setLocationOptions] = useState([]);
  const [employeeOptions , setEmployeeOptions] = useState([]);
  const [isAddClicked, setClickedAdd] = useState(false);


    const [data, setFormData] = useState({
        Name: '',
        Number: '',
        Email: '',
        Salary: '',
        location: '',
        Designation: ''
     });

     const [errors, setErrors] = useState({
      Name: '',
      Number: '',
      Email: '',
      Salary: ''
     });

  const url = 'https://aarnainfra.com/ladder2/client/employee/main.php';

  const getDropdownData = async () => {
   try {
       const response = await axios.get(url); 
       if (response?.data?.location) {
           setLocationOptions(response?.data?.location);
           setEmployeeOptions(response?.data?.employee);
       }
   } catch (error) {
       console.error('Error fetching data:', error);
   }
   };

   useEffect(() => {
     getDropdownData();
   }, []);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
        case 'Name':
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                error = 'Invalid Name';
            } 
            if (employeeOptions.some(option => option.label.toLowerCase() === value.toLowerCase())) {
              error = 'Name already exists';
            }
            break;
        case 'Number':
            if (!/^\d{10}$/.test(value)) {
                error = 'Invalid Number';
            }
            break;
        case 'Email':
          if (!/^[^\s@]+@livnest\.com$/.test(value)) {
            error = 'Invalid Email';
          }
            break;
        case 'Salary':
            const salary = parseInt(value, 10);
            if (!/^(?!0$)(?!.*[^0-9]).{1,7}$/.test(value) || salary > 3000000) {
                error = 'Invalid Salary';
            }
            break;
        default:
            break;
    }

    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error
    }));
  };

  useEffect(() => {
    if (data.Name !== '') {
      validateField('Name', data.Name);
    } else if (data.Number !== '') {
      validateField('Number', data.Number);
    } else if (data.Email !== '') {
      validateField('Email', data.Email);
    } else if (data.Salary !== '') {
      validateField('Salary', data.Salary);
    }
  }, [data.Name, data.Number, data.Email, data.Salary]);

    const isEmpty = (value) => {
      return value.trim() === '';
  };

  const designations = [
    { value: 'Pre_sales_Executive', label: 'Pre-sales Executive' },
    { value: 'Sales_Executive', label: 'Sales Executive' },
    { value: 'Sales_Manager', label: 'Sales Manager' },
    { value: 'Team_Leader', label: 'Team Leader' },
    { value: 'Branch_Head', label: 'Branch Head' },
    { value: 'HR_Executive', label: 'HR Executive' },
    { value: 'Talent_Acquisition_Executive', label: 'Talent Acquisition Executive' },
    { value: 'Accounts_Executive', label: 'Accounts Executive' },
    { value: 'Sr_Specialist_CRM_Post_Sales', label: 'Sr. Specialist CRM – Post Sales' },
    { value: 'Software_Developer', label: 'Software Developer' },
    { value: 'Graphic_Designer', label: 'Graphic Designer' },
    { value: 'IT_Head', label: 'IT Head' },
    { value: 'Social_Media_Manager', label: 'Social Media Manager' },
    { value: 'Content_Creator', label: 'Content Creator' },
    { value: 'Director', label: 'Director' }
  ];

  const handlePutRequest = async () => {
    setClickedAdd(true);
    if (isEmpty(data.Name) || isEmpty(data.Number) || isEmpty(data.Email) || isEmpty(data.Salary) || isEmpty(data.location) || isEmpty(data.Designation)) {
      return;
    } else if (errors.Name || errors.Number || errors.Email || errors.Salary) {
      return;
    } else {
      // If no errors, send the POST request
    const requestBody = {
      name: data.Name,
      number: data.Number,
      email: data.Email,
      salary: data.Salary,
      location: data.location,
      designation: data.Designation,
      operation: "insert"
  };

  try {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) 
    });

    if (response.ok) {
        toast.success('Employee Added');
        clearForm();
        getDropdownData();
    } else {
        throw new Error(errorMessage);
    }
} catch (error) {
    toast.error('An unexpected error occurred');
}


    }
  }

  const clearForm = () => {
    setFormData({
      Name: '',
      LastName : '',
      Number: '',
      Email: '',
      Salary: '',
      location: '',
      Designation: ''
    });
    setErrors({
      Name: '',
      Number: '',
      Email: '',
      Salary: ''
    });
    setClickedAdd(false);
  }

  return (
    <div className="fixed inset-0 z-[100]  flex items-start mt-8 justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
    <div className="modal mx-auto max-h-[200vh] h-[55vh] w-[950px] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none handle">

      {/* Header Div  */}
        <div className="sticky top-0 z-50 flex items-center justify-between py-5 bg-white h-fit">
          <div className="font-bold">
                Add Employee
          </div>
            
            <img
                onClick={() => onClose((prev) => !prev)}
                className="cursor-pointer"
                src={IMAGES.CloseIcon}
                alt="close icon"
            />
        </div>

        {/* Form Div */}
        <div>

          {/* Row 1  */}

        <div className="flex flex-row gap-x-4">

          <div>
          <p className='mb-1'>Name <span className='text-red-500'>*</span></p>
         <input 
              type="text" 
              className={`h-9 p-2 w-full border ${isEmpty(data.Name) && isAddClicked ? 'border-red-500' : 'border-gray-500'} rounded-sm`} 
              placeholder="Name" 
              name="first_name" 
              value={data.Name}
              onChange={(e) => setFormData(prevState => ({...prevState, Name: e.target.value}))} 
            />
            {!isEmpty(data.Name) && errors.Name && <span className="text-red-500 text-sm">{errors.Name}</span>}
            {isEmpty(data.Name) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
          </div>

          <div>
              <p className='mb-1'>Email <span className='text-red-500'>*</span></p>
              <input 
                type="email" 
                className={`h-9 p-2 w-full border ${isEmpty(data.Email) && isAddClicked ? 'border-red-500' : 'border-gray-500'} rounded-sm`} 
                placeholder="Email" 
                name="last_name" 
                value={data.Email}
                onChange={(e) => setFormData(prevState => ({...prevState, Email: e.target.value}))} 
              />
              {isEmpty(data.Email) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
              {!isEmpty(data.Email) && errors.Email && <span className=" text-sm text-red-400">{errors.Email}</span>}
          </div>

          <div>
            <p className='mb-1'>Location<span className='text-red-500'>*</span></p>
            <Select
              className={`basic-single select border ${isEmpty(data.location) && isAddClicked ? 'border-red-500': ''}`}
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              placeholder="Location"
              name="Type"
              options={locationOptions}
              value={data.location ? locationOptions.find(option => option.value === data.location) : null}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                location: selectedOption ? selectedOption.value : ''
              }))}
            />
            {isEmpty(data.location) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
          </div>

          <div>
            <p className='mb-1'>Designation<span className='text-red-500'>*</span></p>
            <Select
              className={`basic-single select border ${isEmpty(data.Designation) && isAddClicked ? 'border-red-500': ''}`}
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              placeholder="Designation"
              name="Type"
              options={designations}
              value={data.Designation ? designations.find(option => option.value === data.Designation) : null}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                Designation: selectedOption ? selectedOption.value : ''
              }))}
            />
            {isEmpty(data.Designation) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
          </div>
        </div>

         {/* Row 2  */}
      
        <div className="flex flex-row gap-x-4 mt-2">

        <div>
              <p className='mb-1'>Phone <span className='text-red-500'>*</span></p>
              <input 
                type="number" 
                className={`h-9 p-2 w-full border ${isEmpty(data.Number) && isAddClicked ? 'border-red-500' : 'border-gray-500'} rounded-sm`} 
                placeholder="Phone Number" 
                name="number" 
                value={data.Number}
                onChange={(e) => setFormData(prevState => ({...prevState, Number: e.target.value}))} 
              />
              {isEmpty(data.Number) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
               {!isEmpty(data.Number) && errors.Number && <span className=" text-sm text-red-500">{errors.Number}</span>}
       </div>

        <div>
              <p className='mb-1'>Salary <span className='text-red-500'>*</span></p>
              <input 
                type="number" 
                className={`h-9 p-2 w-full border ${isEmpty(data.Salary) && isAddClicked ? 'border-red-500' : 'border-gray-500'} rounded-sm`} 
                placeholder="Salary" 
                name="number" 
                value={data.Salary}
                onChange={(e) => setFormData(prevState => ({...prevState, Salary: e.target.value}))} 
              />
              {isEmpty(data.Salary) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
              {!isEmpty(data.Salary) && errors.Salary && <span className=" text-sm text-red-500">{errors.Salary}</span>}
        </div>
        
        </div>

        </div>

        <div className=" mt-14 justify-center flex flex-row gap-x-2">
        <button className='w-16 h-10 border-0 py-2  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded' 
         onClick={handlePutRequest}>Add</button>
          <button className='w-16 h-10 border-0 py-2  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded' 
         onClick={clearForm}>Clear</button>
         </div>
    </div>
    </div>
  )
}

export default AddEmployee