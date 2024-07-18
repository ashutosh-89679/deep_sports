import IMAGES from "../../images";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { getLocalStorage } from "../../utils/getLocalStorage";
import axiosInstance from "../../api/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const Header = () => {
  // getting the active user from context
  const { activeUserData, setActiveUserData } = useContext(AppContext);

  // getting the active user name
  const username = activeUserData?.user_name;

  function storeActivity(userId, activityName, userName) {
    // Retrieve existing activity data from localStorage
    const existingActivities = localStorage.getItem('userActivities');
  
    // Parse existing data or initialize as an empty array if it doesn't exist yet
    const activities = existingActivities ? JSON.parse(existingActivities) : [];
  
    // Get the current date and time
    const currentDate = new Date();
    const timing = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
  
    // Create a new activity object
    const newActivity = {
      userId: userId,
      userName: userName,
      activityName: activityName,
      timing: timing
    };
  
    // Add the new activity to the activities array
    activities.push(newActivity);
  
    // Convert activities array to JSON string
    const activitiesJson = JSON.stringify(activities);
  
    // Store the JSON string in localStorage
    localStorage.setItem('userActivities', activitiesJson);
  }


  

  // handle logout function
  const handleLogout = async () => {
    try {
      if (!getLocalStorage()) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
    }

    const lsData = getLocalStorage();

    axiosInstance(
      "/session/logout/" + lsData.session_id,
      "DELETE",
      {},
      lsData.access_token
    ).finally(() => {
      secureLocalStorage.clear("data");
      setActiveUserData(null);
      window.location.href = "/login";
    });
  };

  return (
    <header className="sticky top-0 left-0 z-50 flex items-center justify-between px-8 py-2 bg-white shadow-md ">
      {/* Link to the home page */}
      <Link to="/">
        <img src={IMAGES.LivnestLogo} className="h-[50px] w-[50px]" alt="livNest Logo" onClick={storeActivity(activeUserData?.user_id , 'header-click' , activeUserData?.user_name)} />
      </Link>

      <div className="group  relative flex  cursor-pointer items-center  rounded-[40px] border border-solid border-gray-200 py-[1px] pl-[4px] shadow-md">
        <img src={IMAGES.UserIcon} alt="user icon" className="mr-2" />
        <span className="text-base text-[#4A5157] ">{username}</span>
        <img
          src={IMAGES.ArrowIcon}
          alt="down arrow"
          className="ml-4 mr-3 rotate-180"
        />

        {/* This div should be visible when I hover on the parent div */}
        <div className="invisible absolute right-2 top-12 w-36 rounded-md border border-[#E9E9E9] bg-white py-1 pl-3  shadow-md  transition-all ease-in-out group-hover:visible">
          <button className="text-sm " onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
