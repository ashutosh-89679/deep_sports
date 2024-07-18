import React, { useState, useEffect, useMemo, useRef } from "react";

const CustomMultiSelect = ({ options, setFilteredData }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
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
    if (selectedOptions.length === 0) {
      setFilteredData(options);
    } else {
      const filteredResults = options.filter((item) =>
        selectedOptions.includes(item?.company_name)
      );
      setFilteredData(filteredResults);
    }
  }, [selectedOptions]);

  const toggleSelectAll = () => {
    if (selectedOptions.length === filteredOptions.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(filteredOptions.map((option) => option?.company_name));
    }
  };

  const toggleClearAll = () => {
    setSelectedOptions([]);
    setSearchText("");
  };

  const handleOptionClick = (name) => {
    if (selectedOptions.includes(name)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== name));
    } else {
      setSelectedOptions([...selectedOptions, name]);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option?.company_name.toLowerCase().includes(searchText.toLowerCase())
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
    <div className="relative rounded">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="h-8 w-full rounded border border-[#E0E0E0] pl-3 text-left text-sm text-[#696969] focus:outline-none"
      >
        {selectedOptionsText}
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="absolute z-10 mt-[6px] w-full rounded border border-[#E0E0E0] bg-white">
          <div className="px-2 pt-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-[#E0E0E0] pl-2 py-1  outline-none text-sm text-[#6F6B6B]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-1">
              <button
                onClick={toggleSelectAll}
                className="text-sm font-medium text-[#9A55FF]"
              >
                SELECT ALL
              </button>
              <button
                onClick={toggleClearAll}
                className="text-sm font-medium text-[#9A55FF]"
              >
                CLEAR ALL
              </button>
            </div>
            <div className="overflow-y-scroll modal max-h-40">
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option?.company_name)}
                  className={`my-1 rounded flex cursor-pointer justify-between px-2 py-1 text-sm text-[#696969] ${
                    selectedOptions.includes(option.company_name)
                      ? "bg-[#EADCFF] after:content-['✓'] text-black"
                      : ""
                  }`}
                >
                  {option?.company_name}
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
