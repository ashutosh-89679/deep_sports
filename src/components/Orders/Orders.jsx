import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../common/Sidebar";
import { AppContext } from "../../context/AppContext";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";

const OrderForm = () => {
    const [userID, setUserID] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { activeUserData } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('allOrders');
    const [orders, setOrders] = useState([]);

    const getTrimmedUserId = (userId) => {
        return userId.replace(/^LNUSR/, '');
    };

    useEffect(() => {
        if (activeUserData?.user_id) {
            setUserID(getTrimmedUserId(activeUserData.user_id));
        }
    }, [activeUserData]);

    useEffect(() => {
        // Fetch orders when the component mounts
        apiInstance("/Orders.php", "POST")
            .then((responseData) => {
                if (responseData.status === 200) {
                    setOrders(responseData.data);
                }
            })
            .catch((error) => {
                toast.error("Error fetching orders");
                console.error(error);
            });
    }, []);

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
        setData({
            ...data,
            [name]: value
        });
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
            console.log(JSON.stringify(data));
            apiInstance("/Orders.php", "PUT", data)
                .then((responseData) => {
                    console.log(responseData);
                    if (responseData.status === 200) {
                        toast.success("Order Added");
                        setData(initialFormData);
                    }
                })
                .catch((error) => {
                    toast.error("Error adding order");
                    console.error(error);
                });
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
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
                                <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
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
                                                    <td className="py-2 px-4 border-b">{order.PartyName}</td>
                                                    <td className="py-2 px-4 border-b">{order.Particulars}</td>
                                                    <td className="py-2 px-4 border-b">{order.Fabric}</td>
                                                    <td className="py-2 px-4 border-b">{order.Quantity}</td>
                                                    <td className="py-2 px-4 border-b">{order.Rate}</td>
                                                    <td className="py-2 px-4 border-b">{order.Design}</td>
                                                    <td className="py-2 px-4 border-b">{order.Total}</td>
                                                    <td className="py-2 px-4 border-b">{order.GrandTotal}</td>
                                                    <td className="py-2 px-4 border-b">{order.Paid}</td>
                                                    <td className="py-2 px-4 border-b">{order.Balance}</td>
                                                    <td className="py-2 px-4 border-b">{order.added_by}</td>
                                                    <td className='cursor-pointer'><i class="fa-solid fa-pen"></i></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="14" className="py-2 px-4 border-b text-center">No orders found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Form No:</label>
                                        <input
                                            type="text"
                                            name="FormNo"
                                            value={data.FormNo}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.FormNo && <p className="text-red-500 text-xs mt-1">{errors.FormNo}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Date:</label>
                                        <input
                                            type="date"
                                            name="Date"
                                            value={data.Date}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Date && <p className="text-red-500 text-xs mt-1">{errors.Date}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Party Name:</label>
                                        <input
                                            type="text"
                                            name="PartyName"
                                            value={data.PartyName}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.PartyName && <p className="text-red-500 text-xs mt-1">{errors.PartyName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Particulars:</label>
                                        <input
                                            type="text"
                                            name="Particulars"
                                            value={data.Particulars}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Particulars && <p className="text-red-500 text-xs mt-1">{errors.Particulars}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Fabric:</label>
                                        <input
                                            type="text"
                                            name="Fabric"
                                            value={data.Fabric}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Fabric && <p className="text-red-500 text-xs mt-1">{errors.Fabric}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Quantity:</label>
                                        <input
                                            type="number"
                                            name="Quantity"
                                            value={data.Quantity}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Quantity && <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Rate:</label>
                                        <input
                                            type="number"
                                            name="Rate"
                                            value={data.Rate}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Rate && <p className="text-red-500 text-xs mt-1">{errors.Rate}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Design:</label>
                                        <input
                                            type="text"
                                            name="Design"
                                            value={data.Design}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Design && <p className="text-red-500 text-xs mt-1">{errors.Design}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Total:</label>
                                        <input
                                            type="number"
                                            name="Total"
                                            value={data.Total}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Total && <p className="text-red-500 text-xs mt-1">{errors.Total}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Grand Total:</label>
                                        <input
                                            type="number"
                                            name="GrandTotal"
                                            value={data.GrandTotal}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.GrandTotal && <p className="text-red-500 text-xs mt-1">{errors.GrandTotal}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Paid:</label>
                                        <input
                                            type="number"
                                            name="Paid"
                                            value={data.Paid}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Paid && <p className="text-red-500 text-xs mt-1">{errors.Paid}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium">Balance:</label>
                                        <input
                                            type="number"
                                            name="Balance"
                                            value={data.Balance}
                                            onChange={handleChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.Balance && <p className="text-red-500 text-xs mt-1">{errors.Balance}</p>}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-black text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Add Order
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default OrderForm;
