import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../common/Sidebar";
import { AppContext } from "../../context/AppContext";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";
import Select from 'react-select';
import DataTable from 'react-data-table-component';


const OrderForm = () => {
    const [userID, setUserID] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const { activeUserData } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('allOrders');
    const [orders, setOrders] = useState([]);
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
    const [filteredOrders, setFilteredOrders] = useState([]);

    const getTrimmedUserId = (userId) => {
        return userId.replace(/^LNUSR/, '');
    };

    useEffect(() => {
        if (activeUserData?.user_id) {
            setUserID(getTrimmedUserId(activeUserData.user_id));
        }
    }, [activeUserData]);

    const fetchOrders = () => {
        setIsLoading(true);
        apiInstance('/getOrders.php', "GET")
            .then((responseData) => {
                if (responseData.status === 200) {
                    setOrders(responseData.data.data);
                    setFilteredOrders(responseData.data.data);
                }
            })
            .catch((error) => {
                alert("Error fetching orders");
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
        fetchPartyNames();
        fetchFabricNames();
    }, []);

    const fetchPartyNames = () => {
        apiInstance("/getParticulars.php", "GET")
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
        e.preventDefault();
        if(newPartyName !== ''){
            apiInstance("/getParticulars.php", "PUT", { name: newPartyName })
            .then(response => {
                fetchPartyNames();
                setShowAddParty(false);
                setNewPartyName('');
                alert("Party name added successfully");
            })
            .catch(error => {
                alert("Failed to add party name");
                console.error(error);
            });
        } else {
            alert("Please enter a party name");
        }
    };

    const handleNewPartyChange = (e) => {
        setNewPartyName(e.target.value);
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

    const addFabricName = (e) => {
        e.preventDefault();
        if (newFabricName !== '') {
            apiInstance("/getFabric.php", "PUT", { name: newFabricName })
                .then(response => {
                    fetchFabricNames();
                    setShowAddFabric(false);
                    setNewFabricName('');
                    alert("Fabric name added successfully");
                })
                .catch(error => {
                    alert("Failed to add fabric name");
                    console.error(error);
                });
        } else {
            alert("Please enter a fabric name");
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
    
        if (data.Rate !== '' && data.Quantity !== '') {
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
                        alert(isEditing ? "Order Updated" : "Order Added");
                        setData(initialFormData);
                        setIsEditing(false);
                        setEditId(null);
                        fetchOrders();
                    }
                })
                .catch((error) => {
                    alert(isEditing ? "Error updating order" : "Error adding order");
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


    const columns = [
        {
            name: 'Form No',
            selector: row => row.FormNo,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.Date,
            sortable: true,
        },
        {
            name: 'Party Name',
            selector: row => partyNames.find(option => option.value === row.PartyName)?.label,
            sortable: true,
        },
        {
            name: 'Particulars',
            selector: row => row.Particulars,
            sortable: true,
        },
        {
            name: 'Fabric',
            selector: row => fabricNames.find(option => option.value === row.Fabric)?.label,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.Quantity,
            sortable: true,
        },
        {
            name: 'Rate',
            selector: row => row.Rate,
            sortable: true,
        },
        {
            name: 'Design',
            selector: row => row.Design,
            sortable: true,
        },
        {
            name: 'Total',
            selector: row => row.Total,
            sortable: true,
        },
        {
            name: 'Grand Total',
            selector: row => row.GrandTotal,
            sortable: true,
        },
        {
            name: 'Paid',
            selector: row => row.Paid,
            sortable: true,
        },
        {
            name: 'Balance',
            selector: row => row.Balance,
            sortable: true,
        },
        {
            name: 'Added By',
            selector: row =>row.user_full_name,
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                row.added_by === userID ? (
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Edit
                    </button>
                ) : (
                    <span>No Access</span>
                )
            ),
        },
    ];

    

    const handleFilter = (e) => {
        const value = e.target.value.toLowerCase();
        const newData = orders.filter(row => {
            return row.FormNo.toLowerCase().includes(value) ||
                   row.Date.toLowerCase().includes(value) ||
                   partyNames.find(option => option.value === row.PartyName)?.label.toLowerCase().includes(value) ||
                   row.Particulars.toLowerCase().includes(value);
        });
        setFilteredOrders(newData);
    };


    return (
        <>
            <main className="flex flex-row select-none">
                <Sidebar
                    isSidebarVisible={isSidebarVisible}
                    setIsSidebarVisible={setIsSidebarVisible}
                />
                <div className="flex w-full p-6 mt-2 justify-center bg-gray-100">
                    <div className="w-full mb-2 p-8 bg-white shadow-md rounded-lg mx-4">
                        <div className="flex text-xs text-wrap mx-[500px] rounded-lg">
                            <button
                                onClick={() => handleTabClick('allOrders')}
                                className={`w-1/2 text-xs px-2 py-2 ${activeTab === 'allOrders' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tl-md focus:outline-none`}
                            >
                                All Orders
                            </button>
                            <button
                                onClick={() => handleTabClick('addOrder')}
                                className={`w-1/2 text-xs  py-2 px-2 ${activeTab === 'addOrder' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tr-md focus:outline-none`}
                            >
                                Add Order
                            </button>
                        </div>

                        
                        {activeTab === 'allOrders' ? (
                            <div className=''>
                                <div className='flex justify-between'>
                                    <h2 className="text-2xl font-semibold mb-4 cursor-pointer">All Orders </h2>

                                        <div className='flex gap-3 text-xs  '>
                                            <button className='p-2 border h-8 rounded-md bg-gray-400 text-white'  >Export</button>
                                        <input
                                                type="text"
                                                placeholder="Filter records"
                                                onChange={handleFilter}
                                                className="p-2 mb-4 border rounded"
                                            />
                                        </div>
                                            
                                </div>
                                <div className='w-[1150px]'>
                                    <DataTable
                                                columns={columns}
                                                data={filteredOrders}
                                                pagination
                                                paginationPerPage={10}
                                                paginationRowsPerPageOptions={[10, 20, 30]}
                                                highlightOnHover
                                                pointerOnHover
                                                sortable
                                                fixedHeader={true}
                                            />
                                </div>
                                    
                                        
                                    
                                
                            </div>
                        ): (
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
