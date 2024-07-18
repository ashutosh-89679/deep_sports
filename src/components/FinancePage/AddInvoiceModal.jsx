import axios from "axios";
import IMAGES from "../../images";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Draggable from 'react-draggable';



const AddInvoiceModal = ({ clientID, companyData, onClose }) => {
  //console.log("company - data" , companyData);
  const [company, setCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [type, setType] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [raiseDate, setRaiseDate] = useState('');
  const [invoiceType  , setInvoiceType] = useState('');
  const [performaInvNum , setPerformaInvNum] = useState('');
  const [tavInvNum , setTavInvNum] = useState('');
  const [advanceInvNum , setAdvanceInvNum] = useState('');
  const [mcData , setMcData] = useState([]);
  const [costDetails , setcostDetails] = useState([]);
  const [av , setAv] =  useState(null);
  const [realizedAmount , setRealizedAmount] = useState(null);

  const [isChecked, setIsChecked] = useState(false);
  const [cpDate , setcpDAte] = useState(null);

  // State to store the value based on the checkbox
  const [storageValue, setStorageValue] = useState('Full');

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); 
    setStorageValue(!isChecked ? 'Partial' : 'Full');
    console.log(storageValue); 
  };


  const currentDate = new Date().toISOString().split('T')[0];


  function calculateRealizedAmount(agreementValue, fetchedBrokeragePercent, cashbackAmount) {
    const invoiceValue = Math.round(agreementValue * (fetchedBrokeragePercent / 100));

    const GSTAmount = invoiceValue * 0.18;
  
    const totalInvoiceValue = invoiceValue + GSTAmount;
  
    const TDSAmount = invoiceValue * 0.05;
  
    const realizeAmount = Math.round(totalInvoiceValue - TDSAmount - (cashbackAmount || 0));
  
    return realizeAmount;
  }

  const clearForm = () => {
    setInvoiceType('');
    setInvoiceNumber('');
    setInvoiceValue('');
    setRaiseDate('');
  }
 
  useEffect(() => {
    if (companyData !== null) {
      setCompany(companyData[0].id);
    }
  }, [companyData]);

  useEffect(() => {
    const getCost = async () => {
      try {
        const response = await axios.post(
          'https://aarnainfra.com/ladder2/client/getCost.php',
          { client_id: clientID } 
        );
        if(response?.data){
          setcostDetails(response.data);
          setcpDAte(response.data[0]?.composite_date);
          const agreementValue = response.data[0]?.agreement_value;
          const baseBrokerage = response.data[0]?.ladder_stage !== null 
          ? Math.round(Number(response.data[0]?.ladder_stage)) 
          : Math.round(Number(response.data[0]?.base_brokerage));
          const cashbackAmount = Math.round(Number(response.data[0]?.cashback_amount)) || 0;
          let realizedAmount = Math.round(calculateRealizedAmount(agreementValue, baseBrokerage, cashbackAmount));
          setRealizedAmount(realizedAmount);
          console.log(response.data);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
  
    getCost();
  }, [clientID]);


  useEffect(() => {
    const getMicroserviceData = async () => {
      try {
        const response = await axios.get(
          'https://aarnainfra.com/ladder2/client/invmicroservice.php'
        );
        setMcData(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
  
    getMicroserviceData();
  }, []); 
  
  useEffect(() => {
    // This block will run whenever mcData is updated
    if (mcData) {
     // console.log(mcData);
  
      // Check if the arrays are defined and not empty before accessing elements
      setPerformaInvNum(mcData.performa?.[0]?.invnumber || null);
      setTavInvNum(mcData.tax?.[0]?.invnumber || null);
      setAdvanceInvNum(mcData.advance?.[0]?.invnumber || null);
    }
  }, [mcData]);
  
 useEffect(() => {
  if (invoiceType === "Proforma") {
    setInvoiceNumber(Number(performaInvNum) + 1);
  } else if (invoiceType === "Tax") {
    setInvoiceNumber(Number(tavInvNum) + 1);
  } else if (invoiceType === "Advance") {
    setInvoiceNumber(Number(advanceInvNum) + 1);
  } else {
    setInvoiceNumber(performaInvNum);
  }
}, [invoiceType, performaInvNum]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          'https://aarnainfra.com/ladder2/dropdown.php'
        );
        const data = response.data;

        const companyData = [];

        data.forEach((location) => {
          location.developers.forEach((developer) => {
            developer.companies.forEach((company) => {
              companyData.push({
                value: company.company_id,
                label: company.company_name,
              });
            });
          });
        });

        setFilteredOptions(companyData);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, []);

  const getFinancialYear = (inputDate) => {
    const date = new Date(inputDate);
  
    if (date.getMonth() < 3) {
      return `/${date.getFullYear() - 1}/${date.getFullYear() % 100}`;
    } else {
      return `/${date.getFullYear()}/${(date.getFullYear() % 100) + 1}`;
    }
  };

  const hadleToastMessage = () => {
    let tag = document.createElement('p');
    tag.innerHTML = 'Added Successfully !';
    tag.style.color = 'green';
  }

  const addData = async () => {
    try {
      if ( !invoiceNumber || !realizedAmount || !invoiceType || !raiseDate ) {
        toast.error("Please fill all the value");
        return;
      }
  
      const response = await axios.put(`https://aarnainfra.com/ladder2/client/invoice.php`, {
        client_id: clientID,
        invoice_value: storageValue === 'Full'? realizedAmount : invoiceValue,
        company_id: costDetails[0]?.company_id,
        invoice_number: invoiceNumber,
        invoice_type: invoiceType,
        raise_date: raiseDate,
      });
  
     // console.log(response);
  
      if (response.data.message === 'Data inserted successfully.') {
        //toast.success("Invoice Added Successfully");
        const message = document.createElement('p');
            message.innerHTML = 'Added Successfully!';
            message.style.color = 'green';
            message.style.fontSize = '13px';
            successDivContent.appendChild(message);
            setTimeout(() => {
              successDivContent.removeChild(message);
          }, 3000); 
        clearForm();
      }
    } catch (error) {
      console.error('Error adding data:', error);
      toast.error("Error adding data");
    }
  };
  

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto max-h-[80vh]  w-[560px] z-[100] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between py-5 bg-white h-fit">
          <span className="text-lg font-semibold text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid underline-offset-[12px]">
            Add Invoice
          </span>
          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>

        {/* FIRST ROW */}
        <div className="flex gap-8 mt-3 ">
        
          <div className="flex-1">
            <p className="text-[#696969] font-medium text-sm mb-1">Select Type</p>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
              />
              <div className="absolute inset-0 cursor-pointer">
                <select
                value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="w-full h-full appearance-none bg-transparent border-none text-[#9A9A9A] text-xs pl-2 outline-none"
                >
                   <option value="" selected hidden>
                      Select Here
                    </option>
                    <option value="Proforma" >
                    Proforma
                    </option>
                    <option value="Tax" >
                      Tax
                    </option>
                    <option value="Advance" >
                      Advance
                    </option>
                </select>
              </div>
            </div>
          </div>


          <div className="flex-1">
            <p className="text-[#696969] font-medium text-sm mb-1">
              Invoice No
            </p>
            <input
             value={invoiceNumber + getFinancialYear(raiseDate)}
             onChange={(e) => setInvoiceNumber(e.target.value.replace(getFinancialYear(raiseDate), ''))}
              type="text"
              placeholder="Invoice Number"
              disabled
              className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
            />
          </div>
        </div>

        <div className=" mt-3">
          <label className="relative inline-flex items-center cursor-pointer ">
              <span className="mr-2 text-sm font-semibold  leading-none">
                Full
              </span>

              <input
                type="checkbox"
                className="sr-only peer"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              
              <div className="w-7 h-[14px] bg-gray-200 peer-focus:outline-none  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[10px] after:w-[14px] after:transition-all  peer-checked:bg-[#9A55FF]"></div>
              <span className="ml-3 text-sm font-semibold  leading-none">
                Partial
              </span> 
            </label>
          </div>

        {/* SECOND ROW */}
        <div className="flex gap-8 mt-3">
          <div className="flex-1">
            <p className="text-[#696969] font-medium text-sm mb-1">
              Invoice Value
            </p>
            <input
              onChange={(e) => {
                  const newValue = Math.min(e.target.value, realizedAmount);
                  setInvoiceValue(newValue);
              }}
              type="number"
              placeholder="Invoice Value"
              value={storageValue === 'Full' ? Math.round(realizedAmount) : Math.round(invoiceValue)}
              max={realizedAmount}
              disabled={storageValue === 'Full'}
              className={`border border-[#CFCFCF] rounded w-full text-[#000000] text-xs pl-2 outline-none h-[30px] ${storageValue === 'Full' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
          </div>

     

          <div className="flex-1">
              <p className="text-[#696969] font-medium text-sm mb-1">
                Raise Date
              </p>
              <input
              onChange={(e) => setRaiseDate(e.target.value)}
              value={raiseDate}
              type="date"
              max={currentDate}
              min={cpDate}
              placeholder="Raise Date"
              className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
            />
            </div>
            <div className="flex-1">
           <p className="text-[#696969] font-medium text-sm mb-1">Company</p>
           
          <input
            type="text"
            value={costDetails[0]?.company_name ? costDetails[0]?.company_name : ''}
            className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
            readOnly
          />
        
        </div>


        </div>
        <div className="flex flex-1 items-center justify-center"> 
            <button
                onClick={addData}
                className="bg-[#9A55FF] text-white text-sm font-semibold h-[30px] rounded px-5 mr-2 my-6"
            >
                Generate
            </button>
            <img
                onClick={clearForm} 
                className="cursor-pointer mr-8" 
                src={IMAGES.ClearAllIcon}
                alt="clear all icon"
            />
        </div>
        <div className=" text-center" id="successDivContent"></div>

        
     
      </div>
    </div>
  );
};

export { AddInvoiceModal };
