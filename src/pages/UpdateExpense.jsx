import React, { useEffect, useState , useRef } from 'react';
import IMAGES from "../images";
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';



const UpdateExpense = ({onClose  , expenseData}) => {
  console.log(expenseData)

  const [isEditable, setIsEditable] = useState(true);

  const [data, setFormData] = useState({
    Type: '',
    Category: '',
    SubCategory: '',
    Merchant: '',
    Transaction: '',
    Date: '',
    Purpose: '',
    Amount: '',
    Start_location: '',
    End_location: '',
    Distance: '',
    Receipt: null,
    Applied_by: '',
    location: '',
    is_approved: false,
  })


  const [merchantsOptions, setMerchantsOptions] = useState([]);
  const [TransactionsOptions, setTransactionsOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [appliedByOptions, setAppliedByOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [filteredCategoriesOptions, setFilteredCategoriesOptions] = useState([]);

  const [SubCategoriesOptions, setSubCategoriesOptions] = useState([]);
  const [filteredSubCategoriesOptions, setFilteredSubCategoriesOptions] = useState([]);
  const [updateEvent , setUpdateEvent] = useState(false); 
  const [addReceiptEvent , setAddReceiptEvent] = useState(false);

  const url = 'https://aarnainfra.com/ladder2/client/office_expense/main.php';

  // Code to populate the dropdowns 
  const getDropdownData = async () => {
    try {
        const response = await axios.get(url); // Ensure 'url' is defined
        if (response?.data?.category) {
            setCategoriesOptions(response?.data?.category);
            setSubCategoriesOptions(response?.data?.sub_category);
            setMerchantsOptions(response?.data?.merchant);
            setTransactionsOptions(response?.data?.transaction);
            setTypeOptions(response?.data?.type);
            setLocationOptions(response?.data?.location);
            setAppliedByOptions(response?.data?.employee);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  // Call getDropdownData on component mount
  useEffect(() => {
      getDropdownData();
  }, []);


  const handleDownload = async (id) => {
    try {
      // Make a POST request to the PHP endpoint with the ID
      const formData = new FormData();
      formData.append('expense_id', id);
      formData.append('operation', 'download_file');
      const response = await fetch(url, {
          method: 'POST',
          body: formData
      });
      
      // Check if the request was successful
      if(response.ok) {
          // Convert blob data to a downloadable file
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          // Create a link element and trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `receipt_${id}.jpg`); 
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
      } else {
          // Handle error response
          const data = await response.text();
          console.error(data);
      }
  }catch(error) {
        console.error('Error:', error);
        setErrorMessage('An error occurred while downloading the file.');
    }
  };


  const handleFileUpdate = async (id) => {
    try {
        const AddingformData = new FormData();
        AddingformData.append('expense_id', id);
        AddingformData.append('operation', 'update_file');
        AddingformData.append("file", data.Receipt);
        const response = await fetch(url, {
            method: 'POST',
            body: AddingformData
        });

    } catch (error) {
        console.error('Error:', error);
        setErrorMessage('An error occurred while updating the file.');
    }
  };
  

/*   if(data.Type !== '' && typeOptions.find(option => option.value === data.Type) !== typeOptions.find(option => option.label === expenseData.type)){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
  }

  if(data.Category !== '' && data.Category !== '' && categoriesOptions.find(option => option.value === data.Category) !== categoriesOptions.find(option => option.label === expenseData.Category)){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

 if(data.SubCategory  !== '' && data.SubCategory !== '' && SubCategoriesOptions.find(option => option.value === data.SubCategory) !== SubCategoriesOptions.find(option => option.label === expenseData.Sub_Category)){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Merchant !== '' && data.Merchant !== '' && merchantsOptions.find(option => option.value === data.Merchant) !== merchantsOptions.find(option => option.label === expenseData.Merchant)){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Applied_by !== '' && data.Applied_by !== '' && appliedByOptions.find(option => option.value === data.Applied_by) !== appliedByOptions.find(option => option.label === expenseData.Applied_By)){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Transaction !== '' && data.Transaction !== '' && TransactionsOptions.find(option => option.value === data.Transaction) !== TransactionsOptions.find(option => option.label === expenseData.Transaction)){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.location !== '' && data.location !== '' && locationOptions.find(option => option.value === data.location) !== locationOptions.find(option => option.label === expenseData.Location)){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Date !== '' && expenseData.Date !== data.Date){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Amount !== '' && expenseData.Amount !== data.Amount){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Purpose !== '' && expenseData.Purpose !== data.Purpose){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}  */


function checkAndUpdate(property, options) {
  if(data[property] !== '' && options.find(option => option.value === data[property]) !== options.find(option => option.label === expenseData[property])){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
  }
}

const propertiesToCheck = ['Type', 'Category', 'SubCategory', 'Merchant', 'Applied_by', 'Transaction', 'location'];
const optionsObjects = [typeOptions, categoriesOptions, SubCategoriesOptions, merchantsOptions, appliedByOptions, TransactionsOptions, locationOptions];

propertiesToCheck.forEach((property, index) => {
  checkAndUpdate(property, optionsObjects[index]);
});

if(data.Date !== '' && expenseData.Date !== data.Date){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Amount !== '' && expenseData.Amount !== data.Amount){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

if(data.Purpose !== '' && expenseData.Purpose !== data.Purpose){
    if (!updateEvent) {
      setUpdateEvent(true);
    }
}

useEffect(() => {
  if(expenseData.Receipt == null) {
    if(data && data.Receipt !== null){
      if (data && data.Receipt && data.Receipt.type.startsWith('image/')) {
        if (data.Receipt.size < 2 * 1024 * 1024) {
            setAddReceiptEvent(true);
        } else {
            toast.error('File size exceeds 2 MB');
            setAddReceiptEvent(false);
        }
    } else {
        toast.error('File must be an image');
        setAddReceiptEvent(false);
      }
    }
  }
 
}, [data , expenseData]); 

  

const handlePutRequest = () => {

  /* if((data.Type !== '' && typeOptions.find(option => option.value === data.Type) == typeOptions.find(option => option.label === expenseData.type)) || 
     (data.Category !== '' && data.Category !== '' && categoriesOptions.find(option => option.value === data.Category) == categoriesOptions.find(option => option.label === expenseData.Category)) ||
    ){

  } */



  const url = 'https://aarnainfra.com/ladder2/client/office_expense/updateExpense.php';
     // Create FormData object
     const formDataToSend = new FormData();

     const keys = [
      "Type", "Category", "SubCategory", "Merchant", 
      "Transaction", "Date", "Purpose", "Amount", 
      "Start_Location", "End_Location", "Distance", 
      "Applied_by", "location"
    ];
    
    keys.forEach(key => {
      const value = data[key] || '';
      if (value !== '') {
        formDataToSend.append(key, value);
      }
    });
    formDataToSend.append('id', expenseData.id);

     // Perform POST request with Axios
     axios
       .post(url, formDataToSend, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       })
       .then((response) => {
         console.log('POST request successful:', response.data);
         if (response.status === 200) {
          toast.success('Record updated successfully');
        }
       })
       .catch((error) => {
         console.error('Error making POST request:', error);
       });
};

  return (
    <div className="fixed inset-0 z-[100]  flex items-start mt-0 justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
    <div className="modal mx-auto max-h-[300vh] h-[65vh] w-[950px] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none handle">
        {/* Header div  */}
        <div className="sticky top-0 z-50 flex items-center justify-between py-5 bg-white h-fit border-b border-black">
          <div className="flex items-center">
            <span className="text-sm mr-3 font-semibold text-black">Update Expense</span>
            <span className="text-sm mr-3 font-semibold text-black cursor-pointer" onClick={() => setIsEditable((prev) => !prev)}>
              <img src={IMAGES.EditIcon} alt="" className=' w-6' title='Edit' />
            </span>
          </div>
            <img
                onClick={() => onClose((prev) => !prev)}
                className="cursor-pointer"
                src={IMAGES.CloseIcon}
                alt="close icon"
                
            />
        </div>
        
        {/* Form div start */}

        {/* Row 1  */}
        <div className="flex flex-row gap-x-4 mt-3">

            <div>
            <p className='mb-1'>Type</p>
                <Select
                  className="basic-single"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select Type"
                  name="Type"
                  isDisabled={isEditable}
                  options={typeOptions}
                  value = {data.Type && data.Type !== '' ? typeOptions.find(option => option.value === data.Type) : (expenseData.type ? typeOptions.find(option => option.label === expenseData.type) : null)}                 
                  onChange={(selectedOption) => {
                    setFormData(prevState => ({
                      ...prevState,
                      Type: selectedOption ? selectedOption.value : ''
                    }));
                  }} 
                />
            </div>

            <div>
            <p className='mb-1'>Category</p>
              <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              isDisabled={isEditable}
              placeholder="Category"
              name="Type"
              value = {data.Category && data.Category !== '' ? categoriesOptions.find(option => option.value === data.Category) : (expenseData.Category ? categoriesOptions.find(option => option.label === expenseData.Category) : null)}
                options={categoriesOptions}
               onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                Category: selectedOption ? selectedOption.value : ''
              }))} 
            />
            </div>

            <div>
            <p className='mb-1'>Sub Category</p>
              <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              isDisabled={isEditable}
              placeholder="Sub Category"
              name="Type"
              value = {data.SubCategory && data.SubCategory !== '' ? SubCategoriesOptions.find(option => option.value === data.SubCategory) : (expenseData.Sub_Category ? SubCategoriesOptions.find(option => option.label === expenseData.Sub_Category) : null)}
              options={SubCategoriesOptions}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                SubCategory: selectedOption ? selectedOption.value : ''
              }))} 
            />
            </div>

            <div>
            <p className='mb-1'>Vendor</p>
              <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              isDisabled={isEditable}
              placeholder="Merchant"
              name="Type"
              value = {data.Merchant && data.Merchant !== '' ? merchantsOptions.find(option => option.value === data.Merchant) : (expenseData.Merchant ? merchantsOptions.find(option => option.label === expenseData.Merchant) : null)}
              options={merchantsOptions}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                Merchant: selectedOption ? selectedOption.value : ''
              }))} 
            />
            </div>

            <div>
            <p className='mb-1'>Applied By</p>
              <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              isDisabled={isEditable}
              placeholder="Applied By"
              name="Type"
              value = {data.Applied_by && data.Applied_by !== '' ? appliedByOptions.find(option => option.value === data.Applied_by) : (expenseData.Applied_By ? appliedByOptions.find(option => option.label === expenseData.Applied_By) : null)}
              options={appliedByOptions}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                 Applied_by: selectedOption ? selectedOption.value : ''
              }))} 
            />
            </div>
        </div>

        {/* Row 2  */}
        <div className="flex flex-row gap-x-4 mt-3">
          <div>
          <p className='mb-1'>Transiction Type</p>
              <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              isDisabled={isEditable}
              placeholder="Transiction Type"
              name="Type"
              value = {data.Transaction && data.Transaction !== '' ? TransactionsOptions.find(option => option.value === data.Transaction) : (expenseData.Transaction ? TransactionsOptions.find(option => option.label === expenseData.Transaction) : null)}
              options={TransactionsOptions}
               onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                Transaction: selectedOption ? selectedOption.value : ''
              }))} 
            />
          </div>

          <div>
          <p className='mb-1'>Location</p>
              <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              isDisabled={isEditable}
              placeholder="Location"
              name="Type"
              value = {data.location && data.location !== '' ? locationOptions.find(option => option.value === data.location) : (expenseData.Location ? locationOptions.find(option => option.label === expenseData.Location) : null)}
              options={locationOptions}
               onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                location: selectedOption ? selectedOption.value : ''
              }))} 
            />
          </div>

          <div>
          <p className='mb-1'>Date</p>
            <input 
              type="date" 
              className="h-9 p-2 w-full border rounded-sm border-gray-400" 
              placeholder="Date" 
              disabled={isEditable}
              name="Date" 
             value={data.Date == '' ? expenseData.Date : data.Date}
             onChange={(e) => setFormData(prevState => ({...prevState, Date: e.target.value}))} 
            />
          </div>

          <div>
          <p className='mb-1'>Amount</p>
            <input 
              type="number" 
              className="h-9 p-2 w-full border rounded-sm border-gray-400" 
              placeholder="Amount" 
              disabled={isEditable}
              name="Amount" 
              value={data.Amount == '' ? expenseData.Amount : data.Amount}
              onChange={(e) => setFormData(prevState => ({...prevState, Amount: e.target.value}))} 
            />
          </div>
        </div>

        {/* Row 3  */}
        <div className="flex flex-row gap-x-4 mt-3">
          <div>
          <p className='mb-1'>Purpose</p>
              <textarea 
                className='h-16 p-1 w-[525px] border border-gray-500 rounded-sm' 
                placeholder="Purpose" 
                name="Purpose" 
                disabled={isEditable}
                value={data.Purpose == '' ? expenseData.Purpose : data.Purpose}
                onChange={(e) => setFormData(prevState => ({...prevState, Purpose: e.target.value}))} 
              />
          </div>

            {expenseData.Receipt !== null && (
              <div>
                <button 
                className=' mt-8 ml-4 border p-3 rounded-lg cursor-pointer shadow-xl text-white bg-[#9555FF]'
                onClick={() => handleDownload(expenseData.id)}>
                  Check Receipt
                </button>
              </div>
            )} {expenseData.Receipt == null && (
              <div>
                <p>Add Receipt</p>
                <input 
                type="file" 
                  className='h-12 p-1 mt-2 w-[150px] border border-gray-500 rounded-sm' 
                placeholder="Receipt" 
                name="Receipt" 
                onChange={(e) => setFormData(prevState => ({...prevState, Receipt: e.target.files[0]}))} 
                />
              </div>
            )}
          
        
        </div>


        {/* Row 4 */}
        
            <div className="flex flex-row mt-12 justify-center">
            {updateEvent && (
            <div>
              <button className=' w-32 h-8 bg-[#9A55FF] text-white rounded-lg shadow-2xl' title='Update' onClick={() => handlePutRequest()}> Update </button>
            </div>
            )}
            {addReceiptEvent  && (
            <div>
              <button className=' w-32 h-8 bg-[#9A55FF] text-white rounded-lg ' title='Add Receipt' onClick={() => handleFileUpdate(expenseData.id)}> Add Receipt </button>
            </div>
            )}
            </div>
        
        

    </div>
    </div>
  )
}

export default UpdateExpense