import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../common/Sidebar";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { AppContext } from "../../context/AppContext";


const TransactionForm = () => {
    const { isSidebarVisible, setIsSidebarVisible } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('allTransactions');
    const { activeUserData } = useContext(AppContext);
    const [transactions, setTransactions] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [userID, setUserID] = useState('');


    const getTrimmedUserId = (userId) => {
        return userId.replace(/^LNUSR/, '');
    };

    useEffect(() => {
        if (activeUserData?.user_id) {
            setUserID(getTrimmedUserId(activeUserData.user_id));
        }
    }, [activeUserData]);

    const [formData, setFormData] = useState({
        date: '',
        trans_type: '',
        type: '',
        trans_acc: '',
        description: '',
        amount: '',
        added_by: userID
    });
    const [editingTransactionId, setEditingTransactionId] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('https://deepsparkle.net/api/transactions.php');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            alert('Failed to fetch transactions');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTransactionId) {
                const response = await axios.put(`https://deepsparkle.net/api/transactions.php?id=${editingTransactionId}`, formData);
                alert('Transaction updated successfully');
            } else {
                const response = await axios.put('https://deepsparkle.net/api/transactions.php', formData);
                alert('Transaction added successfully');
            }
            fetchTransactions();
            resetForm();
        } catch (error) {
            console.error('Error submitting transaction:', error);
            alert('Failed to submit transaction');
        }
    };

    const handleEdit = (transaction) => {
        setFormData(transaction);
        setEditingTransactionId(transaction.id);
        setActiveTab('addTransaction');
    };

    const resetForm = () => {
        setFormData({
            date: '',
            trans_type: '',
            type: '',
            trans_acc: '',
            description: '',
            amount: '',
        });
        setEditingTransactionId(null);
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const filteredTransactions = transactions.filter(
        transaction => 
            transaction.date.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.transid.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.trans_type.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.type.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.trans_acc.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.description.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.amount.toString().includes(filterText)
    );

    const columns = [
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Transaction ID',
            selector: row => row.transid,
            sortable: true,
        },
        {
            name: 'Transaction Type',
            selector: row => row.trans_type,
            sortable: true,
        },
        {
            name: 'Payment Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Account Name',
            selector: row => row.trans_acc,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            cell: row => `₹ ${row.amount}`,
        },
        {
            name: 'Action',
            cell: row => (
                <i
                    className="fa-solid fa-pen cursor-pointer"
                    onClick={() => handleEdit(row)}
                ></i>
            ),
        },
    ];

    return (
        <>
            <main className="flex flex-row">
                <Sidebar
                    isSidebarVisible={isSidebarVisible}
                    setIsSidebarVisible={setIsSidebarVisible}
                />
                <div className="flex w-full mt-6 justify-center bg-gray-100">
                    <div className="w-full mb-4 p-8 bg-white shadow-md rounded-lg mx-4">
                        <div className="mb-4">
                            <button
                                className={`mr-4 ${activeTab === 'allTransactions' ? 'text-blue-500 font-bold' : ''}`}
                                onClick={() => setActiveTab('allTransactions')}
                            >
                                All Transactions
                            </button>
                            <button
                                className={`${activeTab === 'addTransaction' ? 'text-blue-500 font-bold' : ''}`}
                                onClick={() => setActiveTab('addTransaction')}
                            >
                                Add Transaction
                            </button>
                        </div>

                        {activeTab === 'allTransactions' ? (
                            <div>
                                
                                <div className="mb-1 flex justify-between">
                                <h2 className="text-xl font-semibold mb-4 cursor-pointer">All Transactions </h2>
                                    <input
                                        type="text"
                                        placeholder="Filter transactions..."
                                        value={filterText}
                                        onChange={handleFilterChange}
                                        className="w-[400px] text-sm justify-end p-2 border rounded"
                                    />
                                </div>
                                <DataTable
                                    columns={columns}
                                    data={filteredTransactions}
                                    pagination
                                    paginationPerPage={10}
                                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                                    sortable
                                />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="date" className="block mb-1">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="trans_type" className="block mb-1">Transaction Type</label>
                                    <select
                                        id="trans_type"
                                        name="trans_type"
                                        value={formData.trans_type}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="type" className="block mb-1">Payment Type</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Select Payment Type</option>
                                        <option value="ac">A/C</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="trans_acc" className="block mb-1">Account Name</label>
                                    <input
                                        type="text"
                                        id="trans_acc"
                                        name="trans_acc"
                                        value={formData.trans_acc}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="amount" className="block mb-1">Amount</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="description" className="block mb-1">Description / Particulars</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                ></textarea>
                            </div>
                            
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                {editingTransactionId ? 'Update Transaction' : 'Add Transaction'}
                            </button>
                        </form>
                        
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default TransactionForm;
