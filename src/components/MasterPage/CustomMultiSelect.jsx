import { useState, useEffect, useRef, useMemo } from "react";
import IMAGES from "../../images";
const CustomMultiSelect = ({ setValue, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  // To store selected option values
  const [selectedOptions, setSelectedOptions] = useState([]);

  // To store the search text
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    // Prevent the click event from propagating to the parent div

    event.stopPropagation();
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const selectedOptionsIds = selectedOptions.map((name) => {
      // Find the corresponding ID for the selected option
      const selectedOption = options.find((option) => option.name === name);
      return selectedOption ? selectedOption.id : null;
    });
    setValue(selectedOptionsIds);
  }, [selectedOptions]);

  // Function to toggle the selection of all options
  const toggleSelectAll = () => {
    if (selectedOptions.length === filteredOptions.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(filteredOptions.map((option) => option.name));
    }
  };

  // Function to clear all selections
  const toggleClearAll = () => {
    setSelectedOptions([]);
    setSearchText("");
  };

  // Function to handle a single option click
  const handleOptionClick = (name) => {
    if (selectedOptions.includes(name)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== name));
    } else {
      setSelectedOptions([...selectedOptions, name]);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);

  const selectedOptionsText = useMemo(() => {
    if (selectedOptions.length === 0) {
      return "Select Here..";
    }
    const text = selectedOptions.join(", ").substring(0, 20);
    return selectedOptions.length > 1 ? `${text}...` : text;
  }, [selectedOptions]);

  return (
    <div className="relative flex-1 rounded h-9">
      <img
        src={IMAGES.ArrowIcon}
        alt="arrow icon"
        className="absolute top-[40%] left-[93%] rotate-180"
      />

      {/* Button  */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => (prev === true ? false : true));
        }}
        className="h-9 w-full  rounded border border-[#E0E0E0]  pl-3 text-left text-xs text-[#9D9D9D] pt-[3px] focus:outline-none"
      >
        {selectedOptionsText}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-[6px]  shadow-xl  w-full rounded border border-[#E0E0E0] bg-white "
        >
          <div className="p-2">
            {/* Search input */}
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-[#E0E0E0] pl-2 py-1  outline-none text-sm text-[#6F6B6B]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-1">
              {/* Select All button */}
              <button
                onClick={toggleSelectAll}
                className="text-sm font-medium text-[#9A55FF]"
              >
                SELECT ALL
              </button>
              {/* Clear All button */}
              <button
                onClick={toggleClearAll}
                className="text-sm font-medium text-[#9A55FF]"
              >
                CLEAR ALL
              </button>
            </div>
            <div className="overflow-y-scroll modal max-h-40">
              {/* Render the filtered options */}
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option.name)}
                  className={`my-1 rounded flex cursor-pointer justify-between px-2 py-1 text-sm text-[#696969]  ${
                    selectedOptions.includes(option.name)
                      ? "bg-[#EADCFF] after:content-['✓'] text-black"
                      : ""
                  }`}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
