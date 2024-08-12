import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../common/Sidebar";
import { AppContext } from "../../context/AppContext";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";
import Select from 'react-select';
import DateRangePicker from "./DateRangePicker";


const OrderForm = () => {
    const [userID, setUserID] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { activeUserData } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('allOrders');
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [editId, setEditId] = useState(null); 
    const [partyNames, setPartyNames] = useState([]);
    const [selectedParty, setSelectedParty] = useState(null);
    const [showAddParty, setShowAddParty] = useState(false);
    const [newPartyName, setNewPartyName] = useState('');
    const [fabricNames, setFabricNames] = useState([]);
    const [selectedFabric, setSelectedFabric] = useState(null);
    const [showAddFabric, setShowAddFabric] = useState(false);
    const [newFabricName, setNewFabricName] = useState('');
    const [filterDateRange , setFilterDateRange] = useState(null);
    const [filterJson , setFilterJson] = useState(null);
    const [isFilterVisible, setFilterVisible] = useState(false);

    const toggleFilterVisibility = () => {
        setFilterVisible(!isFilterVisible);
      };

    const [formState, setFormState] = useState({
        formNo: '',
        dateRange: null,
        selectedParties: [],
        selectedFabrics: []
      });

      useEffect(() => {
        setFormState((prevState) => ({
          ...prevState,
          dateRange: filterDateRange
        }));
      }, [filterDateRange]);

      const handleFilterInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
          ...prevState,
          [name]: value
        }));
      };

      const handleFilterSelectChange = (selectedOptions, action) => {
        setFormState((prevState) => ({
          ...prevState,
          [action.name]: selectedOptions
        }));
      };

    const getTrimmedUserId = (userId) => {
        return userId.replace(/^LNUSR/, '');
    };

    useEffect(() => {
        if (activeUserData?.user_id) {
            setUserID(getTrimmedUserId(activeUserData.user_id));
        }
    }, [activeUserData]);

    const fetchOrders = (page) => {
        setIsLoading(true);
        apiInstance(`/getOrders.php?page=${page}`, "GET")
            .then((responseData) => {
                if (responseData.status === 200) {
                    setOrders(responseData.data.data);
                    setTotalPages(Math.ceil(responseData.data.total_count / 10)); // Assuming 10 orders per page
                }
            })
            .catch((error) => {
                toast.error("Error fetching orders");
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const fetchPartyNames = () => {
        apiInstance("https://deepsparkle.net/api/getParticulars.php", "GET")
            .then(response => {
                const formattedParties = response.data.map(party => ({
                    value: party.id,
                    label: party.name
                }));
                setPartyNames(formattedParties);
            })
            .catch(error => {
              
                console.error(error);
            });
    };

    const addPartyName = (e) => {
        if(newPartyName !== ''){
            apiInstance("https://deepsparkle.net/api/getParticulars.php", "PUT", { name: newPartyName })
            .then(response => {
                fetchPartyNames(); // Refetch party names to update the dropdown
                setShowAddParty(false); // Hide the add input
                setNewPartyName(''); // Reset the input field
                toast.success("Party name added successfully");
            })
            .catch(error => {
                toast.error("Failed to add party name");
                console.error(error);
            });
        } else {
            toast.error("Please enter a party name");
        }
        
    };

    useEffect(() => {
        fetchPartyNames();
    }, []);

    const handleNewPartyChange = (e) => {
        setNewPartyName(e.target.value);
        setData({
            PartyName: selectedParty?.value,
        });
    };

    const handleAddPartyClick = () => {
        setShowAddParty(true);
    };

    const handleSelectChange = selectedOption => {
        setSelectedParty(selectedOption);
        setData(prevData => ({
            ...prevData,
            PartyName: selectedOption.value 
        }));
    };

    const fetchFabricNames = () => {
        apiInstance("/getFabric.php", "GET")
            .then(response => {
                const formattedFabrics = response.data.map(fabric => ({
                    value: fabric.id,
                    label: fabric.name
                }));
                setFabricNames(formattedFabrics);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchPartyNames();
        fetchFabricNames();
    }, []);

    const addFabricName = (e) => {
        e.preventDefault();
        if (newFabricName !== '') {
            apiInstance("/getFabric.php", "PUT", { name: newFabricName })
                .then(response => {
                    fetchFabricNames(); // Refetch fabric names to update the dropdown
                    setShowAddFabric(false); // Hide the add input
                    setNewFabricName(''); // Reset the input field
                    toast.success("Fabric name added successfully");
                })
                .catch(error => {
                    toast.error("Failed to add fabric name");
                    console.error(error);
                });
        } else {
            toast.error("Please enter a fabric name");
        }
    };

    const handleNewFabricChange = (e) => {
        setNewFabricName(e.target.value);
    };

    const handleAddFabricClick = () => {
        setShowAddFabric(true);
    };

    const handleFabricSelectChange = selectedOption => {
        setSelectedFabric(selectedOption);
        setData(prevData => ({
            ...prevData,
            Fabric: selectedOption.value
        }));
    };

    const initialFormData = {
        FormNo: '',
        Date: '',
        PartyName: '',
        Particulars: '',
        Fabric: '',
        Quantity: '',
        Rate: '',
        Design: '',
        Total: '',
        GrandTotal: '',
        Paid: '',
        Balance: '',
        added_by: userID,
    };

    const [data, setData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...data, [name]: value };
    
        if ( data.Rate !== '' && data.Quantity !== '') {
            updatedData.Total = Number(updatedData.Rate) * Number(updatedData.Quantity);
        }
    
        setData(updatedData);
    };

    const validate = () => {
        let tempErrors = {};
        if (!data.FormNo) tempErrors.FormNo = 'This field is required.';
        if (!data.Date) tempErrors.Date = 'This field is required.';
        if (!data.PartyName) tempErrors.PartyName = 'This field is required.';
        if (!data.Particulars) tempErrors.Particulars = 'This field is required.';
        if (!data.Fabric) tempErrors.Fabric = 'This field is required.';
        if (!data.Quantity) tempErrors.Quantity = 'This field is required.';
        if (!data.Rate) tempErrors.Rate = 'This field is required.';
        if (!data.Design) tempErrors.Design = 'This field is required.';
        if (!data.Total) tempErrors.Total = 'This field is required.';
        if (!data.GrandTotal) tempErrors.GrandTotal = 'This field is required.';
        if (!data.Paid) tempErrors.Paid = 'This field is required.';
        if (!data.Balance) tempErrors.Balance = 'This field is required.';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const method = isEditing ? "PATCH" : "PUT";
            const url = isEditing ? `/Orders.php?id=${editId}` : "/Orders.php";
            apiInstance(url, method, data)
                .then((responseData) => {
                    if (responseData.status === 200) {
                        toast.success(isEditing ? "Order Updated" : "Order Added");
                        setData(initialFormData);
                        setIsEditing(false);
                        setEditId(null);
                        fetchOrders(currentPage);
                    }
                })
                .catch((error) => {
                    toast.error(isEditing ? "Error updating order" : "Error adding order");
                    console.error(error);
                });
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === 'addOrder') {
            setData(initialFormData);
            setIsEditing(false);
            setEditId(null);
        }
    };

    const handleEdit = (order) => {
        setData({
            ...order,
            added_by: userID,
        });
        setSelectedFabric(fabricNames.find(option => option.value === order.Fabric));
        setSelectedParty(partyNames.find(option => option.value === order.PartyName));
        setEditId(order.id); 
        setIsEditing(true);
        setActiveTab('addOrder'); 
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        const filterJson = {
          form_no: formState.formNo || '',
          start_date: formState.dateRange?.startDate || '',
          end_date: formState.dateRange?.endDate || '',
          fabrics: formState.selectedFabrics.map(fabric => fabric.value).join(",") || '',
          parties: formState.selectedParties.map(party => party.value).join(",") || ''
        };
    
        const allFieldsFilled = filterJson.form_no && filterJson.start_date && filterJson.end_date && filterJson.fabrics && filterJson.parties;
    
        if (allFieldsFilled) {
          setFilterJson(filterJson);
        }
    }, [formState]);

    const clearFilter = () => {
        setFormState({
            formNo: '',
            dateRange: null,
            selectedFabrics: [],
            selectedParties: [],
        });
        setFilterDateRange(null);
    };

    return (
        <>
            <main className="flex flex-row select-none">
                <Sidebar
                    isSidebarVisible={isSidebarVisible}
                    setIsSidebarVisible={setIsSidebarVisible}
                />
                <div className="flex w-full mt-6 justify-center bg-gray-100">
                    <div className="w-full mb-4 p-8 bg-white shadow-md rounded-lg mx-4">
                        <div className="flex text-sm mx-[500px] rounded-lg mb-6">
                            <button
                                onClick={() => handleTabClick('allOrders')}
                                className={`w-1/2 py-3 ${activeTab === 'allOrders' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tl-md focus:outline-none`}
                            >
                                All Orders
                            </button>
                            <button
                                onClick={() => handleTabClick('addOrder')}
                                className={`w-1/2 py-3 ${activeTab === 'addOrder' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tr-md focus:outline-none`}
                            >
                                Add Order
                            </button>
                        </div>

                        {activeTab === 'allOrders' ? (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 cursor-pointer">All Orders <i className="fa-solid fa-filter"
                                onClick={toggleFilterVisibility}
                                ></i></h2>
                               {isFilterVisible && (
                                                <div className='border border-blue-400 w-full mb-4 rounded-lg shadow-md'>
                                                  <div className='flex p-2'>
                                                    <div className='flex flex-col mr-2'>
                                                      <label>Form No:</label>
                                                      <input
                                                        type='number'
                                                        name='formNo'
                                                        value={formState.formNo}
                                                        onChange={handleFilterInputChange}
                                                        className='border px-2 py-1 rounded-md'
                                                        placeholder='Form No'
                                                      />
                                                    </div>
                                                    <div className='flex flex-col mr-2'>
                                                      <label>Date Range:</label>
                                                      <DateRangePicker value={filterDateRange} setValue={setFilterDateRange} />
                                                    </div>
                                                    <div className='flex flex-col mr-2'>
                                                      <label>Party Name:</label>
                                                      <Select
                                                        name='selectedParties'
                                                        options={partyNames}
                                                        isMulti
                                                        value={formState.selectedParties}
                                                        onChange={handleFilterSelectChange}
                                                        className='border'
                                                      />
                                                    </div>
                                                    <div className='flex flex-col mr-2'>
                                                      <label>Fabric:</label>
                                                      <Select
                                                        name='selectedFabrics'
                                                        options={fabricNames}
                                                        isMulti
                                                        value={formState.selectedFabrics}
                                                        onChange={handleFilterSelectChange}
                                                        className='border'
                                                      />
                                                    </div>
                                                    <div className='flex flex-row gap-2 mr-2'>
                                                      <button className='h-9 p-1 mt-6 bg-green-500 text-white rounded-md border'>Search</button>
                                                      <button className='h-9 p-1 mt-6 bg-black text-white rounded-md border' onClick={clearFilter}>Clear</button>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                {isLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <>
                                        <table className="min-w-full border rounded-lg bg-white">
                                            <thead className='bg-gray-100'>
                                                <tr className='text-sm'>
                                                    <th className="py-2 px-4 border-b">Form No</th>
                                                    <th className="py-2 px-4 border-b">Date</th>
                                                    <th className="py-2 px-4 border-b">Party Name</th>
                                                    <th className="py-2 px-4 border-b">Particulars</th>
                                                    <th className="py-2 px-4 border-b">Fabric</th>
                                                    <th className="py-2 px-4 border-b">Quantity</th>
                                                    <th className="py-2 px-4 border-b">Rate</th>
                                                    <th className="py-2 px-4 border-b">Design</th>
                                                    <th className="py-2 px-4 border-b">Total</th>
                                                    <th className="py-2 px-4 border-b">Grand Total</th>
                                                    <th className="py-2 px-4 border-b">Paid</th>
                                                    <th className="py-2 px-4 border-b">Balance</th>
                                                    <th className="py-2 px-4 border-b">Added By</th>
                                                    <th className="py-2 px-4 border-b">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.length > 0 ? (
                                                    orders.map((order, index) => (
                                                        <tr key={index} className='text-xs text-center h-8'>
                                                            <td className="py-2 px-4 border-b">{order.FormNo}</td>
                                                            <td className="py-2 px-4 border-b">{order.Date}</td>
                                                            <td className="py-2 px-4 border-b">{partyNames.find(option => option.value === order.PartyName)?.label}</td>
                                                            <td className="py-2 px-4 border-b">{order.Particulars}</td>
                                                            <td className="py-2 px-4 border-b">{fabricNames.find(option => option.value === order.Fabric)?.label}</td>
                                                            <td className="py-2 px-4 border-b">{order.Quantity}</td>
                                                            <td className="py-2 px-4 border-b">{order.Rate}</td>
                                                            <td className="py-2 px-4 border-b">{order.Design}</td>
                                                            <td className="py-2 px-4 border-b">{order.Total}</td>
                                                            <td className="py-2 px-4 border-b">{order.GrandTotal}</td>
                                                            <td className="py-2 px-4 border-b">{order.Paid}</td>
                                                            <td className="py-2 px-4 border-b">{order.Balance}</td>
                                                            <td className="py-2 px-4 border-b">{order.user_full_name}</td>
                                                            <td className="py-2 px-4 border-b">
                                                            {order.added_by === userID ? (
                                                                      <button
                                                                        onClick={() => handleEdit(order)}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                      >
                                                                        Edit
                                                                      </button>
                                                                    ) : (
                                                                      <span>No Access</span> // You can replace this with any placeholder or leave it empty
                                                                    )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="13" className="py-4 text-center">No Orders Found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="mt-4 flex justify-between items-center">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                className="px-4 py-2 bg-gray-300 rounded-lg"
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                className="px-4 py-2 bg-gray-300 rounded-lg"
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Add Order</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label htmlFor="FormNo" className="block text-sm font-medium text-gray-700">FORM NO</label>
                                            <input
                                                type="text"
                                                id="FormNo"
                                                name="FormNo"
                                                value={data.FormNo}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.FormNo && <p className="text-red-500 text-xs mt-1">{errors.FormNo}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Date" className="block text-sm font-medium text-gray-700">DATE</label>
                                            <input
                                                type="date"
                                                id="Date"
                                                name="Date"
                                                value={data.Date}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.Date && <p className="text-red-500 text-xs mt-1">{errors.Date}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="PartyName" className="block text-sm font-medium text-gray-700">
                                                PARTY NAME
                                                <i className="fa fa-plus cursor-pointer ml-2 border p-1" onClick={handleAddPartyClick}></i>
                                            </label>
                                            {showAddParty && (
                                                <div className='flex gap-3 mb-2'>
                                                    <input
                                                        type="text"
                                                        value={newPartyName}
                                                        onChange={handleNewPartyChange}
                                                        className="mt-1 p-2 border rounded-lg w-full"
                                                        placeholder='enter party name'
                                                    />
                                                    <button onClick={(e) => addPartyName(e)} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg">Add</button>
                                                </div>
                                            )}
                                            <Select
                                                id="PartyName"
                                                value={selectedParty}
                                                onChange={handleSelectChange}
                                                options={partyNames}
                                                className="mt-1"
                                            />
                                            {errors.PartyName && <p className="text-red-500 text-xs mt-1">{errors.PartyName}</p>}
                                            
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Particulars" className="block text-sm font-medium text-gray-700">PARTICULARS</label>
                                            <input
                                                type="text"
                                                id="Particulars"
                                                name="Particulars"
                                                value={data.Particulars}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.Particulars && <p className="text-red-500 text-xs mt-1">{errors.Particulars}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="PartyName" className="block text-sm font-medium text-gray-700">
                                                FABRIC NAME 
                                                <i className="fa fa-plus cursor-pointer ml-2 border p-1" onClick={handleAddFabricClick}></i>
                                            </label>
                                            {showAddFabric && (
                                                <div className='flex gap-3 mb-2'>
                                                    <input
                                                        type="text"
                                                        value={newFabricName}
                                                        onChange={handleNewFabricChange}
                                                        className="mt-1 p-2 border rounded-lg w-full"
                                                        placeholder='enter Fabric name'
                                                    />
                                                    <button onClick={(e) => addFabricName(e)} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg">Add</button>
                                                </div>
                                            )}
                                            <Select
                                                id="FabricName"
                                                value={selectedFabric}
                                                onChange={handleFabricSelectChange}
                                                options={fabricNames}
                                                className="mt-1"
                                            />
                                            {errors.Fabric && <p className="text-red-500 text-xs mt-1">{errors.Fabric}</p>}
                                            
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Quantity" className="block text-sm font-medium text-gray-700">QUANTITY</label>
                                            <input
                                                type="number"
                                                id="Quantity"
                                                name="Quantity"
                                                value={data.Quantity}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.Quantity && <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Rate" className="block text-sm font-medium text-gray-700">RATE</label>
                                            <input
                                                type="number"
                                                id="Rate"
                                                name="Rate"
                                                value={data.Rate}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.Rate && <p className="text-red-500 text-xs mt-1">{errors.Rate}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Design" className="block text-sm font-medium text-gray-700">DESIGN</label>
                                            <input
                                                type="text"
                                                id="Design"
                                                name="Design"
                                                value={data.Design}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.Design && <p className="text-red-500 text-xs mt-1">{errors.Design}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Total" className="block text-sm font-medium text-gray-700">TOTAL</label>
                                            <input
                                                  type="number"
                                                  id="Total"
                                                  name="Total"
                                                  value={data.Total}
                                                  onChange={handleChange}
                                                  className="mt-1 p-2 border rounded-lg w-full"
                                                />
                                            {errors.Total && <p className="text-red-500 text-xs mt-1">{errors.Total}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="GrandTotal" className="block text-sm font-medium text-gray-700">GRAND TOTAL</label>
                                            <input
                                                type="number"
                                                id="GrandTotal"
                                                name="GrandTotal"
                                                value={data.GrandTotal}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.GrandTotal && <p className="text-red-500 text-xs mt-1">{errors.GrandTotal}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Paid" className="block text-sm font-medium text-gray-700">PAID</label>
                                            <input
                                                type="number"
                                                id="Paid"
                                                name="Paid"
                                                value={data.Paid}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.Paid && <p className="text-red-500 text-xs mt-1">{errors.Paid}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Balance" className="block text-sm font-medium text-gray-700">BALANCE</label>
                                            <input
                                                type="number"
                                                id="Balance"
                                                name="Balance"
                                                value={data.Balance}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-lg w-full"
                                            />
                                            {errors.Balance && <p className="text-red-500 text-xs mt-1">{errors.Balance}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-black text-white rounded-lg"
                                            disabled={isLoading}
                                        >
                                            {isEditing ? 'Update Order' : 'Add Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default OrderForm;
