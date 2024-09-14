import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../common/Sidebar";
import { AppContext } from "../../context/AppContext";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";

const CreditForm = () => {
    const [userID, setUserID] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { activeUserData } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('allCredits');
    const [credits, setCredits] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const creditsPerPage = 10;

    const getTrimmedUserId = (userId) => {
        return userId.replace(/^LNUSR/, '');
    };

    useEffect(() => {
        if (activeUserData?.user_id) {
            setUserID(getTrimmedUserId(activeUserData.user_id));
        }
    }, [activeUserData]);

    useEffect(() => {
        fetchCredits(currentPage);
    }, [currentPage]);

    const fetchCredits = async (page) => {
        try {
            const response = await apiInstance(`/getCredits.php?page=${page}`, "POST");
            if (response.status === 200) {
                setCredits(response.data.data);
                setTotalCredits(response.data.total_count);
            } else {
                alert("Failed to fetch credits");
            }
        } catch (error) {
            alert("An error occurred while fetching credits");
        }
    };

    const initialFormData = {
        credit_date: '',
        credit_title: '',
        credit_desc: '',
        credit_amount: '',
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
        if (!data.credit_date) tempErrors.credit_date = 'This field is required.';
        if (!data.credit_title) tempErrors.credit_title = 'This field is required.';
        if (!data.credit_desc) tempErrors.credit_desc = 'This field is required.';
        if (!data.credit_amount) tempErrors.credit_amosunt = 'This field is required.';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            if (isEditing) {
                apiInstance("/Credit.php", "PATCH", { ...data, id: editId })
                    .then((responseData) => {
                        if (responseData.status === 200) {
                            alert("Credit Updated");
                            setData(initialFormData);
                            setIsEditing(false);
                            setEditId(null);
                            fetchCredits(currentPage); // Refresh the credits list
                            setActiveTab('allCredits');
                        } else {
                            alert("Error Occurred");
                        }
                    })
            } else {
                apiInstance("/Credit.php", "PUT", data)
                    .then((responseData) => {
                        if (responseData.status === 200) {
                            alert("Credit Added");
                            setData(initialFormData);
                            fetchCredits(currentPage); // Refresh the credits list
                        } else {
                            alert("Error Occurred");
                        }
                    })
            }
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === 'addCredit') {
            setIsEditing(false);
            setEditId(null);
            setData(initialFormData);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEdit = (credit) => {
        setData({
            credit_date: credit.credit_date,
            credit_title: credit.credit_title,
            credit_desc: credit.credit_desc,
            credit_amount: credit.credit_amount,
            added_by: credit.user_id,
        });
        setEditId(credit.id);
        setIsEditing(true);
        setActiveTab('addCredit');
    };

    const totalPages = Math.ceil(totalCredits / creditsPerPage);



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
                                onClick={() => handleTabClick('allCredits')}
                                className={`w-1/2 py-3 ${activeTab === 'allCredits' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tl-md focus:outline-none`}
                            >
                                All Credits
                            </button>
                            <button
                                onClick={() => handleTabClick('addCredit')}
                                className={`w-1/2 py-3 ${activeTab === 'addCredit' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-tr-md focus:outline-none`}
                            >
                                Add Credit
                            </button>
                        </div>

                        {activeTab === 'allCredits' ? (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 cursor-pointer">All Credits <i className="fa-solid fa-filter"></i></h2>
                                <table className="min-w-full bg-white border">
                                    <thead className='bg-gray-100 text-sm'>
                                        <tr>
                                            <th className="py-2 px-4 border-b">Credit Date</th>
                                            <th className="py-2 px-4 border-b">Credit Title</th>
                                            <th className="py-2 px-4 border-b">Credit Description</th>
                                            <th className="py-2 px-4 border-b">Credit Amount</th>
                                            <th className="py-2 px-4 border-b">Added By</th>
                                            <th className="py-2 px-4 border-b">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {credits.length > 0  && credits.map((credit, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 justify-start border-b">{credit.credit_date}</td>
                                                <td className="py-2 px-4 text-center border-b">{credit.credit_title}</td>
                                                <td className="py-2 px-4 text-center border-b">{credit.credit_desc}</td>
                                                <td className="py-2 px-4 text-center border-b">₹ {credit.credit_amount}</td>
                                                <td className="py-2 px-4 text-center border-b">{credit.added_by}</td>
                                                <td className="py-2 px-4 text-center cursor-pointer border-b">
                                                  {userID === credit.user_id ? (
                                                    <i
                                                      className="fa-solid fa-pen"
                                                      onClick={() => handleEdit(credit)}
                                                    ></i>
                                                  ) : (
                                                    <span>No Access</span> 
                                                  )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-center mt-4">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`px-4 py-2 mx-1 ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium">Credit Date:</label>
                                        <input
                                            type="date"
                                            name="credit_date"
                                            value={data.credit_date}
                                            onChange={handleChange}
                                            className="mt-2 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.credit_date && <p className="text-red-500 text-sm mt-1">{errors.credit_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium">Credit Title:</label>
                                        <input
                                            type="text"
                                            name="credit_title"
                                            value={data.credit_title}
                                            onChange={handleChange}
                                            className="mt-2 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.credit_title && <p className="text-red-500 text-sm mt-1">{errors.credit_title}</p>}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-lg font-medium">Credit Description:</label>
                                    <textarea
                                        name="credit_desc"
                                        value={data.credit_desc}
                                        onChange={handleChange}
                                        className="mt-2 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.credit_desc && <p className="text-red-500 text-sm mt-1">{errors.credit_desc}</p>}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-lg font-medium">Credit Amount:</label>
                                    <input
                                        type="number"
                                        name="credit_amount"
                                        value={data.credit_amount}
                                        onChange={handleChange}
                                        className="mt-2 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.credit_amount && <p className="text-red-500 text-sm mt-1">{errors.credit_amount}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-black w-[200px] text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    {isEditing ? 'Update Credit' : 'Add Credit'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default CreditForm;
