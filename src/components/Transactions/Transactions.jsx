import React from 'react'
import Sidebar from "../common/Sidebar";
import { AppContext } from "../../context/AppContext";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";


const Transactions = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <>
    <main className="flex flex-row">
                <Sidebar
                    isSidebarVisible={isSidebarVisible}
                    setIsSidebarVisible={setIsSidebarVisible}
                />
                <p>under development</p>
                </main>
    </>
  )
}

export default Transactions