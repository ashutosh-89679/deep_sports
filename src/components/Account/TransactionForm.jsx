import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../common/Sidebar";
import { AppContext } from "../../context/AppContext";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";

const TransactionForm = () => {
    const [userID, setUserID] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { activeUserData } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('allTransactions');
    const [transactions, setTransactions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const getTrimmedUserId = (userId) => {
        return userId.replace(/^LNUSR/, '');
    };

    useEffect(() => {
        if (activeUserData?.user_id) {
            setUserID(getTrimmedUserId(activeUserData.user_id));
        }
    }, [activeUserData]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await apiInstance("/transactions.php", "GET");
            if (response.status === 200) {
                setTransactions(response.data);
            } else {
                toast.error("Failed to fetch transactions");
            }
        } catch (error) {
            toast.error("An error occurred while fetching transactions");
        }
    };

    const initialFormData = {
        date: '',
        trans_type: 'credit',
        amount: '',
        rate: '',
        quantity: '',
        total: '',
    };

    const [data, setData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => {
            const newData = {
                ...prevData,
                [name]: value
            };
            if (name === 'rate' || name === 'quantity') {
                // Calculate total amount when rate or quantity changes
                const rate = parseFloat(newData.rate) || 0;
                const quantity = parseFloat(newData.quantity) || 0;
                newData.total = rate * quantity;
            }
            return newData;
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!data.date) tempErrors.date = 'This field is required.';
        if (!data.trans_type) tempErrors.trans_type = 'This field is required.';
        if (!data.amount) tempErrors.amount = 'This field is required.';
        if (!data.rate) tempErrors.rate = 'This field is required.';
        if (!data.quantity) tempErrors.quantity = 'This field is required.';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            if (isEditing) {
                apiInstance("/transactions.php", "POST", { ...data, id: editId })
                    .then((responseData) => {
                        if (responseData.status === 200) {
                            toast.success("Transaction Updated");
                            setData(initialFormData);
                            setIsEditing(false);
                            setEditId(null);
                            fetchTransactions(); // Refresh the transactions list
                            setActiveTab('allTransactions');
                        } else {
                            toast.error("Error Occurred");
                        }
                    })
            } else {
                apiInstance("/transactions.php", "PUT", data)
                    .then((responseData) => {
                        if (responseData.status === 200) {
                            toast.success("Transaction Added");
                            setData(initialFormData);
                            fetchTransactions(); // Refresh the transactions list
                        } else {
                            toast.error("Error Occurred");
                        }
                    })
            }
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === 'addTransaction') {
            setIsEditing(false);
            setEditId(null);
            setData(initialFormData);
        }
    };

    const handleEdit = (transaction) => {
        setData({
            date: transaction.date,
            trans_type: transaction.trans_type,
            amount: transaction.amount,
            rate: transaction.rate,
            quantity: transaction.quantity,
            total: transaction.total,
        });
        setEditId(transaction.id);
        setIsEditing(true);
        setActiveTab('addTransaction');
    };


    return (
        <>
            <main className="flex flex-row">
                <Sidebar
                    isSidebarVisible={isSidebarVisible}
                    setIsSidebarVisible={setIsSidebarVisible}
                />
                <div className="flex w-full mt-6 justify-center bg-gray-100">
                    <div className="w-full mb-4 p-8 bg-white shadow-md rounded-lg mx-4">
                        <div className="flex text-sm mx-[500px] rounded-lg mb-6">
                            <button
                                onClick={() => handleTabClick('allTransactions')}
                                className={`w-1/2 py-3 ${activeTab === 'allTransactions' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tl-md focus:outline-none`}
                            >
                                All Transactions
                            </button>
                            <button
                                onClick={() => handleTabClick('addTransaction')}
                                className={`w-1/2 py-3 ${activeTab === 'addTransaction' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tr-md focus:outline-none`}
                            >
                                Add Transaction
                            </button>
                        </div>

                        {activeTab === 'allTransactions' ? (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 cursor-pointer">All Transactions <i className="fa-solid fa-filter"></i></h2>
                                <table className="min-w-full bg-white border">
                                    <thead className='bg-gray-100 text-sm'>
                                        <tr>
                                            <th className="py-2 px-4 border-b">Date</th>
                                            <th className="py-2 px-4 border-b">Transaction ID</th>
                                            <th className="py-2 px-4 border-b">Transaction Type</th>
                                            <th className="py-2 px-4 border-b">Amount</th>
                                            <th className="py-2 px-4 border-b">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length > 0 && transactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 justify-start border-b">{transaction.date}</td>
                                                <td className="py-2 px-4 text-center border-b">{transaction.transid}</td>
                                                <td className="py-2 px-4 text-center border-b">{transaction.trans_type}</td>
                                                <td className="py-2 px-4 text-center border-b">₹ {transaction.amount}</td>
                                                <td className="py-2 px-4 text-center cursor-pointer border-b">
                                                    <i
                                                        className="fa-solid fa-pen"
                                                        onClick={() => handleEdit(transaction)}
                                                    ></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium">Date:</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={data.date}
                                            onChange={handleChange}
                                            className="mt-2 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium">Transaction Type:</label>
                                        <select
                                            name="trans_type"
                                            value={data.trans_type}
                                            onChange={handleChange}
                                            className="mt-2 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="credit">Credit</option>
                                            <option value="debit">Debit</option>
                                        </select>
                                        {errors.trans_type && <p className="text-red-500 text-sm mt-1">{errors.trans_type}</p>}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-lg font-medium">Amount:</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={data.amount}
                                        onChange={handleChange}
                                        className="mt-2 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 text-white bg-black rounded-md hover:bg-gray-800"
                                    >
                                        {isEditing ? "Update Transaction" : "Add Transaction"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default TransactionForm;
