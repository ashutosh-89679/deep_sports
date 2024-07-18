import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";

const AgingSlider = ({ name, onValuesChange }) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(365);

  useEffect(() => {
    if (min <= max && min >= 1 && max <= 365) {
      onValuesChange({ min, max });
    }
  }, [min, max, onValuesChange]);

  return (
    <div className="w-full rounded border border-[#E0E0E0] py-4 px-3 mt-3">
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="thumb"
        trackClassName="track"
        defaultValue={[1, 365]}
        value={[min, max]}
        min={1}
        max={365}
        onChange={(e) => {
          setMin(e[0]);
          setMax(e[1]);
        }}
        pearling
        minDistance={10}
      />
      <div className="flex justify-between mt-4">
        <input
          min={0}
          placeholder="min (Lacs)"
          type="number"
          className="border border-[#E0E0E0] pl-2 placeholder:text-xs placeholder:text-[#9D9D9D] outline-none text-[#696969] text-sm h-7 rounded-md w-[45%]"
          onChange={(e) => {
            const newValue = e.target.value;
            setMin(newValue === '' ? '' : Math.max(1, parseInt(newValue, 10) || 0));
          }}
        />
        <input
          max={365}
          type="number"
          placeholder="max (Lacs)"
          className="border border-[#E0E0E0] pl-2 placeholder:text-xs placeholder:text-[#9D9D9D] outline-none text-[#696969] text-sm h-7 rounded-md w-[45%]"
          value={max}
          onChange={(e) => {
            const newValue = e.target.value;
            setMax(newValue === '' ? '' : Math.min(365, parseInt(newValue, 10) || 365));
          }}        />
      </div>
    </div>
  );
};

export default AgingSlider;
