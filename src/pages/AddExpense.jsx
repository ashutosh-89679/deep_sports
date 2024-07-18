import React, { useEffect, useState , useRef } from 'react';
import IMAGES from "../images";
import Select from 'react-select';
import axios from 'axios';
import { toast } from "react-toastify";
import ExportIcon from '../images/ExportIcon';


function AddExpense( {onClose}) {

  // To store selected form values
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
    });

    //visbility state
    const [categoriesOptions, setCategoriesOptions] = useState([]);
    const [filteredCategoriesOptions, setFilteredCategoriesOptions] = useState([]);

    const [SubCategoriesOptions, setSubCategoriesOptions] = useState([]);
    const [filteredSubCategoriesOptions, setFilteredSubCategoriesOptions] = useState([]);

    const [merchantsOptions, setMerchantsOptions] = useState([]);
    const [TransactionsOptions, setTransactionsOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [appliedByOptions, setAppliedByOptions] = useState([]);
    const [isAddClicked, setClickedAdd] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [showMerchantPopover, setShowMerchantPopover] = useState(false);

    const [activeSection, setActiveSection] = useState('Add Expense');  
    const popoverRef = useRef(null);
    const popMerchantRef = useRef(null);

    const [inputValue, setInputValue] = useState('');
    const [merchantInput , setMerchantInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isChecked, setIsChecked] = useState(false);


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

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Call getDropdownData on component mount
  useEffect(() => {
      getDropdownData();
  }, []);

    // Function to Clear All the feilds 
    const clearAllFields = () => {
      setClickedAdd(false);
      setFormData(prevState => ({
        ...prevState,
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
        location: ''
      }));
      setSelectedType(null);
    };

    // Function to check if a field is empty
    const isEmpty = (value) => {
        return value.trim() === '';
    };

    // To insert the data 
    const handlePutRequest = () => {
      if(data.Amount <= 0) {
        toast.error('Amount should be greater than 0');
        exit();
      }

      const emptyFields = Object.entries(data).filter(([key, value]) => {
        return (
          typeof value === 'string' &&
          value.trim() === '' &&
          key !== 'Start_location' &&
          key !== 'End_location' &&
          key !== 'Distance' &&
          key !== 'Receipt' &&
          key !== 'Purpose'
        );
      });

    
      if (emptyFields.length > 0) {
        setClickedAdd(true);
        return;
      } else {
         // Create FormData object
         const formDataToSend = new FormData();

         // Append file to FormData object
         formDataToSend.append("file", data.Receipt);

         // Append other fields to FormData object
         formDataToSend.append("operation", "expense");
         formDataToSend.append("Type", data.Type);
         formDataToSend.append("Category", data.Category);
         formDataToSend.append("Sub_Category", data.SubCategory);
         formDataToSend.append("Merchant", data.Merchant);
         formDataToSend.append("Transaction", data.Transaction);
         formDataToSend.append("Date", data.Date);
         formDataToSend.append("Purpose", data.Purpose);
         formDataToSend.append("Amount", isChecked ? addPercentage(data.Amount, 18) : data.Amount);  
         formDataToSend.append("Start_Location", data.Start_location ? data.Start_location : '');
         formDataToSend.append("End_Location", data.End_location ? data.End_location : '');
         formDataToSend.append("Distance", data.Distance ? data.Distance : '');
         formDataToSend.append("Applied_By", data.Applied_by);
         formDataToSend.append("Location", data.location);

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
              toast.success('Record added successfully');
              setClickedAdd(false);
              clearAllFields();
            }
           })
           .catch((error) => {
             console.error('Error making POST request:', error);
           });
         
      }
    
   
    };


    //change the options dynamically 
    useEffect(() => {
      if (data.Type) {
          setFilteredCategoriesOptions(categoriesOptions.filter(category => category.type_id === data.Type));
      } else {
          setFilteredCategoriesOptions([...categoriesOptions]);
      }
  }, [data.Type, categoriesOptions]);

  useEffect(() => {
    if (data.Category) {
        setFilteredSubCategoriesOptions(SubCategoriesOptions.filter(sub_category => sub_category.category_id === data.Category));
    }
     else {
        setFilteredSubCategoriesOptions([...SubCategoriesOptions]);
    }
    }, [data.Category, SubCategoriesOptions]);

    // change the div visibility 

    const handleSectionClick = (section) => {
      setActiveSection(section);
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const toggleMerchantPopover = () => {
    setShowMerchantPopover(!showMerchantPopover);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
      if (popMerchantRef.current && !popMerchantRef.current.contains(event.target)) {
        setShowMerchantPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAction = (action) => {
    if (action === 'add') {
      if (inputValue.trim() === '') {
        setErrorMessage('Please enter a name');
        return;
      }

      else if (SubCategoriesOptions.map(option => option.label).includes(inputValue)) {
        setErrorMessage('Category already exists');
        return;
      }
      
      else {        
        // Define the body of the request
        const body = {
            operation: "category",
            add_type: "sub_category",
            category_id: data.Category,
            sub_cat_name: inputValue
        };
    
        // Perform the Axios PUT request
        axios.put(url, body)
            .then(response => {
                console.log("Category added:", inputValue);
                setErrorMessage('Added');
                getDropdownData();
                // Clear input after successful request
                setInputValue('');
            })
            .catch(error => {
                console.error("Error adding category:", error);
                // Optionally, set an error message state here
            });
        }

      
    } else if (action === 'cancel') {
      // Clear input and error message
      setInputValue('');
      setErrorMessage('');
    }
  };

  const MerchantHandleAction = (action) => {
    {
      if (action === 'add') {
        if (merchantInput.trim() === '') {
          setErrorMessage('Please enter a name');
          return;
        }
  
        else if (merchantsOptions.map(option => option.label).includes(merchantInput)) {
          setErrorMessage('Category already exists');
          return;
        }
       
        
        else {        
          // Define the body of the request
          const body = {
              operation: "category",
              add_type: "merchant",
              merchant_name: merchantInput
          };
      
          // Perform the Axios PUT request
          axios.put(url, body)
              .then(response => {
                  console.log("Category added:", merchantInput);
                  setErrorMessage('Added');
                  getDropdownData();
                  // Clear input after successful request
                  setMerchantInput('');
              })
              .catch(error => {
                  console.error("Error adding category:", error);
                  // Optionally, set an error message state here
              });
          } 
  
        
      } else if (action === 'cancel') {
        // Clear input and error message
        setMerchantInput('');
        setErrorMessage('');
      }
    };
  }

  useEffect(() => {
    if (data.Category === '2') {
      setFormData(prevState => ({
        ...prevState,
        SubCategory: '3'
      }));
      setFormData(prevState => ({
        ...prevState,
        Merchant: '12'
      }));
    }
  }, [data.Category]);

  function addPercentage(base, percent) {
     base = Number(base);
     percent = Number(percent)
    const percentageValue = (percent / 100) * base;
    const result = base + percentageValue;
    return result.toFixed(2);
}

    //test feild area 
    //console.log(categoriesOptions)
  
  return (
    <div className="fixed inset-0 z-[100]  flex items-start mt-8 justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
    <div className="modal mx-auto max-h-[300vh] h-[60vh] w-[950px] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none handle">

      {/* Header Div  */}
        <div className="sticky top-0 z-50 flex items-center justify-between py-5 bg-white h-fit">
          <div>
          <span
                    className={`text-sm mr-3 font-semibold ${activeSection === 'Add Expense' ? 'text-black underline' : 'text-gray-500'} cursor-pointer`}
                    onClick={() => handleSectionClick('Add Expense')}
                >
                    Add Expense
                </span>
                
          </div>
            
            <img
                onClick={() => onClose((prev) => !prev)}
                className="cursor-pointer"
                src={IMAGES.CloseIcon}
                alt="close icon"
            />
        </div>
        
        {/* form div start  */}
        <div>

            {/* row 1 */}
            <div className="flex flex-row gap-x-4">

            <div>
                <p className='mb-1'>Type<span className='text-red-500'>*</span></p>
                <Select
                  className={`basic-single select border ${isEmpty(data.Type) && isAddClicked ? 'border-red-500' : ''}`}
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select Type"
                  name="Type"
                  options={typeOptions}
                  value={data.Type ? typeOptions.find(option => option.value === data.Type) : null}
                  onChange={(selectedOption) => {
                    setFormData(prevState => ({
                      ...prevState,
                      Type: selectedOption ? selectedOption.value : ''
                    }));
                  }}
                />
                {isEmpty(data.Type) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
            </div>

            <div>
            <p className='mb-1'>Category<span className='text-red-500'>*</span></p>
              <Select
              className={`basic-single select border ${isEmpty(data.Category) && isAddClicked ? 'border-red-500': ''}`}
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              placeholder="Category"
              name="Type"
              value={data.Category ? filteredCategoriesOptions.find(option => option.value === data.Category) : null}
              options={filteredCategoriesOptions}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                Category: selectedOption ? selectedOption.value : ''
              }))}
            />
            {isEmpty(data.Category) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
            </div>

            <div className=' relative'>
            <p className='mb-1 flex items-center'>Sub Category<span className='text-red-500'>*</span><span onClick={togglePopover}><img className='w-4 h-4 ml-2 cursor-pointer' src={IMAGES.AddIcon} alt="Add sub catergoyr" /></span></p> 
                <Select
              className={`basic-single select border ${isEmpty(data.SubCategory) && isAddClicked ? 'border-red-500': ''}`}
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              placeholder="SubCategory"
              name="Type"
              options={filteredSubCategoriesOptions}
              value={data.SubCategory ? filteredSubCategoriesOptions.find(option => option.value === data.SubCategory) : null}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                SubCategory: selectedOption ? selectedOption.value : ''
              }))}
            />
            {isEmpty(data.SubCategory) && isAddClicked && <p className="text-red-500 text-xs">required</p>}

           
            {/* add sub category div        */}
            
              <div ref={popoverRef}  className={`h-[190px] w-[250px] absolute bg-white backdrop-brightness-50 shadow-2xl left-[-21%] top-10 z-50 border border-[#000000] rounded-lg ${showPopover ? 'block' : 'hidden'}`}>
                <img src={IMAGES.WhiteCaret} alt="" className='h-8 w-8 absolute top-[-16%] right-[24%] z-50' />
                <div>
                <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Add Sub Category</h3>
                </div>
                {isEmpty(data.Category) && <p className="text-red-500 text-xs mt-1 ml-3">Select Category</p>}
                <input type="text" className='mt-2 ml-3 w-[230px] h-9 rounded-lg p-2 border border-black' 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isEmpty(data.Category)}
                />
                {errorMessage && <p className=" text-red-600 text-xs ml-5">{errorMessage}</p>} 
                <div className="flex ml-12 mt-4">
                  <button className="mr-2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded" onClick={() => handleAction('add')} disabled={isEmpty(data.Category)} >Add</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleAction('cancel')}>Cancel</button>
                </div>x
                </div>

              </div> 

            </div>

            <div className=' relative'>
                <p className='mb-1 flex items-center'>Vendor<span className='text-red-500'>*</span><span onClick={toggleMerchantPopover}><img className='w-4 h-4 ml-2 cursor-pointer' src={IMAGES.AddIcon} alt="Add sub catergoyr" /></span></p>
                <Select
                  className={`basic-single select border ${isEmpty(data.Merchant) && isAddClicked ? 'border-red-500': ''}`}
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Vendor"
                  name="Merchant"
                  options={merchantsOptions}
                  value={data.Merchant ? merchantsOptions.find(option => option.value === data.Merchant) : null}
                  onChange={(selectedOption) => setFormData(prevState => ({
                    ...prevState,
                    Merchant: selectedOption ? selectedOption.value : ''
                  }))}
                  /* styles={{
                    menu: (provided) => ({ ...provided, maxHeight: '200px' }),
                    overflow: 'auto',
                  }} */
                />
                {isEmpty(data.Merchant) && isAddClicked && <p className="text-red-500 text-xs">required</p>}

                <div ref={popMerchantRef}  className={`h-[160px] w-[250px] absolute bg-white backdrop-brightness-50 shadow-2xl left-[-50%] top-10 z-50 border border-[#000000] rounded-lg ${showMerchantPopover ? 'block' : 'hidden'}`}>
                <img src={IMAGES.WhiteCaret} alt="" className='h-8 w-8 absolute top-[-16%] right-[24%] z-50' />
                <div>
                <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Add Merchant</h3>
                </div>
                <input type="text" className='mt-2 ml-3 w-[230px] h-9 rounded-lg p-2 border border-black' 
                value={merchantInput}
                onChange={(e) => setMerchantInput(e.target.value)}
                />
                {errorMessage && <p className=" text-red-600 text-xs ml-5">{errorMessage}</p>} 
                <div className="flex ml-12 mt-4">
                  <button className="mr-2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded" onClick={() => MerchantHandleAction('add')} >Add</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded" onClick={() => MerchantHandleAction('cancel')}>Cancel</button>
                </div>
                </div>

              </div> 
            </div>
                
            <div>
              <p className='mb-1'>{data.Category && data.Category == 2 ? "Paid to" : "Applied By"}<span className='text-red-500'>*</span></p>
              <Select
                className={`basic-single select border ${isEmpty(data.Applied_by) && isAddClicked ? 'border-red-500': ''}`}
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                placeholder="Employee"
                name="Type"
                options={appliedByOptions}
                value={data.Applied_by ? appliedByOptions.find(option => option.value === data.Applied_by) : null}
                onChange={(selectedOption) => setFormData(prevState => ({
                  ...prevState,
                  Applied_by: selectedOption ? selectedOption.value : ''
                }))}
              />
               {isEmpty(data.Applied_by) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
            </div>
        
        </div>

        {/* Row 2 */}
        <div className=" mt-2 flex flex-row gap-x-4">

        <div>
            <p className='mb-1'>Transaction Type<span className='text-red-500'>*</span></p>
            <Select
               className={`basic-single select border ${isEmpty(data.Transaction) && isAddClicked ? 'border-red-500': ''}`}
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              placeholder="Payment Type"
              name="Type"
              options={TransactionsOptions}
              value={data.Transaction ? TransactionsOptions.find(option => option.value === data.Transaction) : null}
              onChange={(selectedOption) => setFormData(prevState => ({
                ...prevState,
                Transaction: selectedOption ? selectedOption.value : ''
              }))}
            />
            {isEmpty(data.Transaction) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
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
            <p className='mb-1'>Payment Date<span className='text-red-500'>*</span></p>
            <input 
              type="date" 
              className={`h-9 p-2 w-full border ${isEmpty(data.Date) && isAddClicked ? 'border-red-500' : 'border-gray-500'} rounded-sm`} 
              placeholder="Date" 
              name="Date" 
              value={data.Date || ''}
              onChange={(e) => setFormData(prevState => ({...prevState, Date: e.target.value}))} 
            />
            {isEmpty(data.Date) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
          </div>

          <div>
          <p className='mb-1'>Amount <span className='text-red-500'>*</span></p>
            <input 
              type="number" 
              className={`h-9 p-2 w-full border ${isEmpty(data.Amount) && isAddClicked ? 'border-red-500' : 'border-gray-500'} rounded-sm`} 
              placeholder="Amount" 
              name="Amount" 
              value={data.Amount || ''}
              onChange={(e) => setFormData(prevState => ({...prevState, Amount: e.target.value}))} 
            />
            {isEmpty(data.Amount) && isAddClicked && <p className="text-red-500 text-xs">required</p>}
            {!isEmpty(data.Amount) && data.Amount > 0 && isChecked && <p className="text-xs mt-1 flex">Including GST  <p className=' text-green-400 font-semibold ml-2'>{addPercentage(data.Amount, 18)}</p> </p>}
            {(data.Amount && data.Amount <= 0) && (<p className="text-red-500 text-xs">Amount should be greater than 0</p>)}

          </div>
        </div>


        {/* Row 3 */}
        {data.SubCategory == 15 && (
        <div className='mt-2 flex flex-row gap-x-4'>
        <div>
          <p className='mb-1'>Distance</p>
          <input 
            type="text" 
            className='h-9 p-1 w-full border border-gray-500 rounded-sm' 
            placeholder="eg. 15Km" 
            name="Distance" 
            onChange={(e) => setFormData(prevState => ({...prevState, Distance: e.target.value}))} 
          />
        </div>
        <div>
          <p className='mb-1'>Start Location</p>
          <input 
            type="text" 
            className='h-9 p-1 w-full border border-gray-500 rounded-sm' 
            placeholder="Thane" 
            name="StartLocation" 
            onChange={(e) => setFormData(prevState => ({...prevState, StartLocation: e.target.value}))} 
          />
        </div>
        <div>
          <p className='mb-1'>End Location</p>
          <input 
            type="text" 
            className='h-9 p-1 w-full border border-gray-500 rounded-sm' 
            placeholder="Mulund" 
            name="EndLocation" 
            onChange={(e) => setFormData(prevState => ({...prevState, EndLocation: e.target.value}))} 
          />
        </div>
      </div>
        )}

        {/* row 4 */}
        <div className=" mt-2 flex flex-row gap-x-2">
              <div>
              <p className='mb-1'>Purpose</p>
              <textarea 
                className='h-16 p-1 w-[500px] border border-gray-500 rounded-sm' 
                placeholder="Purpose" 
                name="Purpose" 
                value={data.Purpose || ''}
                onChange={(e) => setFormData(prevState => ({...prevState, Purpose: e.target.value}))} 
              />
            </div>
            <div>
              <p className='mb-1'>Receipt</p>
              <input 
                type="file" 
                className='h-12 p-1 w-full border border-gray-500 rounded-sm' 
                placeholder="Receipt" 
                name="Receipt" 
                onChange={(e) => setFormData(prevState => ({...prevState, Receipt: e.target.files[0]}))} 
              />              
            </div>
        </div>

        {/* row 5 */}

        <div className=" mt-2 flex flex-row gap-x-2">
          <p className=' text-xs'>Does this expense involves GST?</p>
          <input 
            type="checkbox" 
            className='h-4 w-4' 
            checked={isChecked} 
            onChange={handleCheckboxChange} 
          />
        </div>

        {/* row 6 */}

        <div className=" mt-14 justify-center flex flex-row gap-x-2">
        <button className='w-16 h-10 border-0 py-2  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded' 
         onClick={handlePutRequest}>Add</button>
        <button className='w-16 h-10 border-0 py-2  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'
        onClick={clearAllFields}>Clear</button>
        </div>


        </div>

        {/* Closing Div  */}
        </div>
        </div>
  )
}

export default AddExpense