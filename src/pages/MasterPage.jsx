import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import ActionBar from "../components/MasterPage/ActionBar";
import Item from "../components/MasterPage/Item";
import axios from "axios";
import LadderModal from "../components/MasterPage/LadderModal";
import KickerModal from "../components/MasterPage/KickerModal";
import EIModal from "../components/MasterPage/EIModal";
import Loader from "../components/common/Loader";
import { toast } from "react-toastify";

const MasterPage = () => {
  // Sidebar State
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // ladder data state
  const [ladderData, setLadderData] = useState([]);

  // Kicker data state
  const [kickerData, setKickerData] = useState([]);

  // EIData state
  const [eIData, setEIData] = useState([]);

  // Ladder Modal State
  const [isLadderModalVisible, setIsLadderModalVisible] = useState(false);

  // Kicker Modal State
  const [isKickerModalVisible, setIsKickerModalVisible] = useState(false);

  // EI Modal State
  const [isEIModalVisible, setIsEIModalVisible] = useState(false);

  //  Ladder / kicker / ei all  Modal State
  const [modalData, setModalData] = useState([]);

  // Quick Filter State
  const [selectedQuickFilter, setSelectedQuickFilter] = useState("ladder");

  // daterange state for the filters
  const [daterange, setDaterange] = useState();

  // project data for the filters & all add modals
  const [projectData, setProjectData] = useState([]);

  const [loading, setLoading] = useState(true);

  const getFilteredLadderData = async (id, startDate, endDate) => {
    try {
      const response = await axios.post(`https://aarnainfra.com/ladder2/fetchLadder.php`, {
        search_start_date: startDate,
        search_end_date: endDate,
        search_project_id: id.join(","),
      });
  
      if (response.data.length === 0) {
        toast.info("No Specific Ladder Data Found");
      } else {
        setLadderData(response.data);
      }
    } catch (error) {
      toast.error("Error in fetching ladder data");
    }
  };

  // function to get the filtered kicker data (from filters)
  const getFilteredKickerData = async (id) => {
    try {
      const response = await axios.post(`https://aarnainfra.com/ladder2/fetchKicker.php`, {
        search_start_date: daterange?.startDate,
        search_end_date: daterange?.endDate,
        search_project_id: id.join(","),
      });
  
      if (response.data.length === 0) {
        toast.info("No Specific Kicker Data Found");
      } else {
        setKickerData(response.data);
      }
    } catch (error) {
      toast.error("Error in fetching Kicker data");
    }
  };

  const getFilteredEiData = async (id) => {
    try {
      const response = await axios.post(`https://aarnainfra.com/ladder2/fetchEi.php`, {
        search_start_date: daterange?.startDate,
        search_end_date: daterange?.endDate,
        search_project_id: id.join(","),
      });
  
      if (response.data.length === 0) {
        toast.info("No Specific EI Data Found");
        console.log("1111");
      } else {
        setEIData(response.data);
      }
    } catch (error) {
      toast.error("Error in fetching EI data");
    }
  };

  // function to fetch the ladder data
  const fetchLader = async () => {
    axios
      .get(`https://aarnainfra.com/ladder2/fetchLadder.php`)
      .then((res) => setLadderData(res?.data))
      .catch((err) => toast.error("Error in fetching ladder data"));
  };

  // function to fetch the Kicker data
  const fetchKicker = async () => {
    axios
      .get(`https://aarnainfra.com/ladder2/fetchKicker.php`)
      .then((res) => setKickerData(res?.data))
      .catch((err) => toast.error("Error in fetching Kicker data"));
  };

  // function to  fetch EI data
  const fetchEI = async () => {
    axios
      .get(`https://aarnainfra.com/ladder2/fetchEi.php`)
      .then((res) => setEIData(res?.data))
      .catch((err) => toast.error("Error in fetching EI data"));
  };

  // function to fetch the project data
  const fetchProject = async () => {
    axios
      .get(`https://aarnainfra.com/ladder2/projectapi.php`)
      .then((res) => {
        setProjectData(res?.data);
        setLoading(false);
      })
      .catch((err) => toast.error("Error in fetching project data"));
  };

  // calling all the api's on initial load
  useEffect(() => {
    fetchLader();
    fetchKicker();
    fetchEI();
    fetchProject();
  }, []);



  if (loading) return <Loader />;
  return (
    <>
      <Header />
      <main className="flex">
        {/* Sidebar Container */}
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 my-4 ml-4 mr-7">
          {/* Action Bar */}
          <ActionBar
            projectData={projectData}
            getFilteredLadderData={getFilteredLadderData}
            getFilteredKickerData={getFilteredKickerData}
            getFilteredEiData={getFilteredEiData}
            daterange={daterange}
            setDaterange={setDaterange}
            fetchKicker={fetchKicker}
            fetchEI={fetchEI}
            fetchLader={fetchLader}
            setSelectedQuickFilter={setSelectedQuickFilter}
            selectedQuickFilter={selectedQuickFilter}
          />
          <div className="flex flex-wrap gap-x-5">
            {selectedQuickFilter === "ladder" &&
              ladderData.map((item) => (
                <Item
                  key={item?.uid}
                  data={item}
                  setModalData={setModalData}
                  setIsModalVisible={setIsLadderModalVisible}
                />
              ))}

            {selectedQuickFilter === "kicker" &&
              kickerData.map((item) => (
                <Item
                  key={item?.uid}
                  data={item}
                  setModalData={setModalData}
                  setIsModalVisible={setIsKickerModalVisible}
                />
              ))}

            {selectedQuickFilter === "ei" &&
              eIData.map((item) => (
                <Item
                  key={item?.uid}
                  data={item}
                  setModalData={setModalData}
                  setIsModalVisible={setIsEIModalVisible}
                />
              ))}
          </div>
        </section>
      </main>

      {isLadderModalVisible && (
        <LadderModal
          fetchLader={fetchLader}
          onClose={setIsLadderModalVisible}
          modalData={modalData}
        />
      )}
      {isKickerModalVisible && (
        <KickerModal
          fetchKicker={fetchKicker}
          onClose={setIsKickerModalVisible}
          modalData={modalData}
        />
      )}
      {isEIModalVisible && (
        <EIModal
          fetchEI={fetchEI}
          onClose={setIsEIModalVisible}
          modalData={modalData}
        />
      )}
    </>
  );
};

export default MasterPage;
