import { useEffect, useRef } from "react";

const QuickFilter = ({
  selectedQuickFilter,
  setSelectedQuickFilter,
  isQuickFilterDropdownVisible: isDropdownVisible,
  setIsQuickFilterDropdownVisible: setDropdownVisible,
}) => {
  //   const [isDropdownVisible, setDropdownVisible] = useState(true);
  const dropdownRef = useRef(null);
  useEffect(() => {
    // Function to close the dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    // Add event listener when the dropdown is visible
    if (isDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);
  return (
    <div
      ref={dropdownRef}
      className="relative "
      onClick={() => setDropdownVisible(!isDropdownVisible)}
    >
      <div className="relative group">
        <svg
          className="cursor-pointer"
          width="24"
          height="16"
          viewBox="0 0 24 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.8 2.82353H1.2C0.88174 2.82353 0.576516 2.67479 0.351472 2.41003C0.126428 2.14528 0 1.78619 0 1.41176C0 1.03734 0.126428 0.678253 0.351472 0.413496C0.576516 0.148739 0.88174 0 1.2 0H22.8C23.1183 0 23.4235 0.148739 23.6485 0.413496C23.8736 0.678253 24 1.03734 24 1.41176C24 1.78619 23.8736 2.14528 23.6485 2.41003C23.4235 2.67479 23.1183 2.82353 22.8 2.82353ZM18.8 9.41177H5.2C4.88174 9.41177 4.57652 9.26303 4.35147 8.99827C4.12643 8.73351 4 8.37442 4 8C4 7.62558 4.12643 7.26649 4.35147 7.00173C4.57652 6.73697 4.88174 6.58824 5.2 6.58824H18.8C19.1183 6.58824 19.4235 6.73697 19.6485 7.00173C19.8736 7.26649 20 7.62558 20 8C20 8.37442 19.8736 8.73351 19.6485 8.99827C19.4235 9.26303 19.1183 9.41177 18.8 9.41177ZM14 16H10C9.68174 16 9.37652 15.8513 9.15147 15.5865C8.92643 15.3217 8.8 14.9627 8.8 14.5882C8.8 14.2138 8.92643 13.8547 9.15147 13.59C9.37652 13.3252 9.68174 13.1765 10 13.1765H14C14.3183 13.1765 14.6235 13.3252 14.8485 13.59C15.0736 13.8547 15.2 14.2138 15.2 14.5882C15.2 14.9627 15.0736 15.3217 14.8485 15.5865C14.6235 15.8513 14.3183 16 14 16Z"
            fill={` ${isDropdownVisible ? "#9A55FF" : "#1B2559"} `}
          />
        </svg>

        <div className="tooltiptext absolute invisible text-sm top-[125%] z-20   -left-8 bg-white text-[#6F6B6B] drop-shadow-xl text-center p-1 w-24 rounded group-hover:visible  ">
          Quick Filters
        </div>
      </div>

      {isDropdownVisible && (
        <div className="absolute top-7  drop-shadow-lg z-20 w-[195px] rounded  bg-white p-2 text-sm font-normal">
          <p
            onClick={() => setSelectedQuickFilter("ladder")}
            className={` ${
              selectedQuickFilter === "ladder"
                ? "bg-[#9A55FF] text-white"
                : "text-[#8B8B8B]"
            } cursor-pointer leading-none py-2  rounded pl-3  hover:bg-[#9A55FF] hover:text-white`}
          >
            Ladders
          </p>
          <p
            onClick={() => setSelectedQuickFilter("kicker")}
            className={` ${
              selectedQuickFilter === "kicker"
                ? "bg-[#9A55FF] text-white"
                : "text-[#8B8B8B]"
            } cursor-pointer leading-none py-2 my-1 rounded pl-3  hover:bg-[#9A55FF] hover:text-white`}
          >
            Kickers
          </p>
          <p
            onClick={() => setSelectedQuickFilter("ei")}
            className={` ${
              selectedQuickFilter === "ei"
                ? "bg-[#9A55FF] text-white"
                : "text-[#8B8B8B]"
            } cursor-pointer leading-none py-2  rounded pl-3  hover:bg-[#9A55FF] hover:text-white`}
          >
            Executive Incentive
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickFilter;
