import IMAGES from "../../images";
import { useLocation, Link } from "react-router-dom";
import { useState, useContext , useEffect} from "react";
import { AppContext } from "../../context/AppContext";
import useStore from "../../store";
import { getLocalStorage } from "../../utils/getLocalStorage";
import axiosInstance from "../../api/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const Sidebar = ({ isSidebarVisible, setIsSidebarVisible }) => {
  const { pathname } = useLocation();
  const { updateUserDetails } = useStore();
  const { activeUserData, setActiveUserData } = useContext(AppContext);



  useEffect(() => {
    // This function will run only once when the component is mounted
    updateUserDetails(activeUserData);
  }, []); 

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
  <aside
    className={` ${
      isSidebarVisible ? "min-w-[16vw]" : "w-fit"
    } bg-[#000000] h-screen pt-4 sticky shadow-2xl select-none  z-[100] flex flex-col justify-between`}
  >
    <div>
      <img
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        src={IMAGES.SidebarToggleIcon}
        alt="sidebar toggle"
        className={`${
          isSidebarVisible ? "" : "rotate-180"
        } absolute -right-3 top-6 cursor-pointer`}
      />

      <div className="flex  cursor-pointer  text-sm items-center px-1 py-1 mb-4 bg-[#007FFF] rounded-lg shadow-lg">
        <img
          src={IMAGES.LivnestLogo}
          className="h-[30px] w-[40px] mr-2 bg-white rounded-lg"
          alt="livNest Logo"
        />
        {isSidebarVisible && (
          <p className="font-bold font-sans text-white text-[19px] ml-2">
            DEEP SPORTS 
          </p>
        )}
      </div>

      <div>

        {/* Dashboard */}
        <Link to={"/"}>
          <div
            className={`flex pl-2 shadow-lg  square-box items-center gap-4 py-2 group hover:bg-[#090909] ${
              pathname === "/" ? "bg-[#007FFF]" : ""
            }`}
            title="Dashboard"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 17 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${!isSidebarVisible ? "ml-0" : ""}`}
            >
              <path
                className={`${
                  pathname === "/" ? "fill-white" : ""
                } group-hover:fill-white`}
                d="M6.65014 14.0994V9.59622H10.3458V14.0994C10.3458 14.5947 10.7615 15 11.2697 15H14.0414C14.5495 15 14.9653 14.5947 14.9653 14.0994V7.79496H16.5359C16.9609 7.79496 17.1642 7.2816 16.8408 7.01141L9.11696 0.229661C8.76588 -0.0765536 8.23001 -0.0765536 7.87893 0.229661L0.155079 7.01141C-0.159049 7.2816 0.0349716 7.79496 0.459968 7.79496H2.03061V14.0994C2.03061 14.5947 2.44637 15 2.95451 15H5.72623C6.23438 15 6.65014 14.5947 6.65014 14.0994Z"
                fill="#8A8A8A"
              />
            </svg>

            {isSidebarVisible && (
              <p
                className={`text-[#6F6B6B] group-hover:text-white ${
                  pathname === "/" && "text-white"
                }`}
              >
                Dashboard
              </p>
            )}
          </div>
        </Link>

        {/* Credit */}
        <Link to={"/credit"}>
            <div
              className={`flex pl-2 mb-2  square-box items-center gap-4 mt-2 py-2 group hover:shadow-lg hover:bg-[#090909] ${
                pathname === "/credit" ? "bg-[#007FFF]" : ""
              }`}
              title="Add Credit"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${!isSidebarVisible ? "ml-0" : ""}`}
              >
                <path
                  className={`${
                    pathname === "/credit" ? "fill-white" : ""
                  } group-hover:fill-white`}
                  d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8ZM6 14H8V16H6V14ZM10 14H14V16H10V14Z"
                  fill="#8A8A8A"
                />
              </svg>
                
              {isSidebarVisible && (
                <p
                  className={`text-[#6F6B6B] group-hover:text-white ${
                    pathname === "/credit" && "text-white"
                  }`}
                >
                  Credit
                </p>
              )}
            </div>
          </Link>     
            
        {/* Order */}
        <Link to={"/order"}>
        <div
              className={`flex pl-2 mb-2  square-box items-center gap-4 mt-2 py-2 hover:shadow-lg group hover:bg-[#090909] ${
                pathname === "/order" ? "bg-[#007FFF]" : ""
              }`}
              title="Add Order"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${!isSidebarVisible ? "ml-0" : ""}`}
              >
                <path
                  className={`${
                    pathname === "/order" ? "fill-white" : ""
                  } group-hover:fill-white`}
                  d="M7 4H2V6H4L7.68 13.39L6.24 16.04C6.09 16.33 6 16.66 6 17C6 18.1 6.9 19 8 19H19V17H8.42C8.28 17 8.19 16.89 8.22 16.75L8.54 15H17.55C18.3 15 18.96 14.58 19.3 13.94L21.88 9.27C22.06 8.94 21.94 8.53 21.61 8.35C21.28 8.16 20.87 8.28 20.69 8.61L18.32 13H9.1L8.43 11H19C19.55 11 20 10.55 20 10C20 9.45 19.55 9 19 9H7.1L6.2 7H4V4ZM7 18C5.9 18 5 18.9 5 20C5 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM16 18C14.9 18 14 18.9 14 20C14 21.1 14.9 22 16 22C17.1 22 18 21.1 18 20C18 18.9 17.1 18 16 18Z"
                  fill="#8A8A8A"
                />
              </svg>
                
              {isSidebarVisible && (
                <p
                  className={`text-[#6F6B6B] group-hover:text-white ${
                    pathname === "/order" && "text-white"
                  }`}
                >
                  Orders
                </p>
              )}
            </div>


        </Link>

        {/* Account */}
        <Link to={"/account"}>
        <div
              className={`flex pl-2 mb-2 hover:shadow-lg square-box items-center gap-4 mt-2 py-2 group hover:bg-[#090909] ${
                pathname === "/account" ? "bg-[#007FFF]" : ""
              }`}
              title="Account Book"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${!isSidebarVisible ? "ml-0" : ""}`}
              >
                <path
                  className={`${
                    pathname === "/account" ? "fill-white" : ""
                  } group-hover:fill-white`}
                  d="M10 2L2 6V8H4V20H6V10H18V20H20V8H22V6L14 2H10ZM4 8.59L10.59 5.17L12 5.83L17.41 8.59H4ZM9 13V18H7V13H9ZM13 13V18H11V13H13ZM17 13V18H15V13H17Z"
                  fill="#8A8A8A"
                />
              </svg>

                
              {isSidebarVisible && (
                <p
                  className={`text-[#6F6B6B] group-hover:text-white ${
                    pathname === "/account" && "text-white"
                  }`}
                >
                  Account Book
                </p>
              )}
            </div>


        </Link>

      </div>
    </div>

    {/* Logout Button */}
    <div className="flex items-center justify-center p-1 bg-[#1a1a1a] cursor-pointer hover:bg-[#090909]"
    title="Logout"
    onClick={(e) => handleLogout()}
    >
      <img
        src={IMAGES.Logout}
        alt="Logout Icon"
        className="h-[20px] w-[20px] mr-2 bg-white rounded-lg"
      />
      {isSidebarVisible && (
        <p className="font-semibold text-white text-[19px]">Logout</p>
      )}
    </div>

  </aside>
);

};

export default Sidebar;
