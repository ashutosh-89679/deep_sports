import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import IMAGES from "../../images";

const CustomSelect = ({ name, values, setChange, currentVal, placeholder, clearAll, position }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(null); // State to manage selected option

  const filteredValues = values ? values.filter(value =>
    value.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const options = filteredValues.map(value => ({
    value: value.id,
    label: value.name,
    name: value.name
  }));

  useEffect(() => {
    // Update selected option when currentVal changes
    const option = options.find(option => option.value === currentVal);
    setSelectedOption(option);
  }, [currentVal, options]);

  useEffect(() => {
    // Clear selected option when clearAllSelects becomes true
    if (clearAll) {
      setSelectedOption(null);
    }
  }, [clearAll]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px',
      height: 'auto'
    }),
    option: (provided) => ({
      ...provided,
      fontSize: '12px' // Adjust the font size as needed
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '12px' // Adjust the font size as needed
    }),
  };

  return (
    <div className="relative mt-5 lg:mt-0">
      <Select
        value={selectedOption}
        onChange={(selectedOption) => {
          setSelectedOption(selectedOption);
          setChange(selectedOption ? selectedOption.value : null);
        }}
        options={options}
        isClearable={true}
        isSearchable={true}
        placeholder={placeholder}
        styles={customStyles}
        menuPlacement={position}
      />
    </div>
  );
};

export default CustomSelect;
