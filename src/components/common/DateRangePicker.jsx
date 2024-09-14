import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Datepicker from "react-tailwindcss-datepicker";

const DateRangePicker = ({ value, setValue, ddName }) => {
  const { setFiltersSelectedData } = useContext(AppContext);

  useEffect(() => {
    setFiltersSelectedData((prevData) => ({
      ...prevData,
      [ddName]: [value?.startDate, value?.endDate],
    }));
  }, [value]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  function getCurrentFinancialYear() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Fiscal year starts from April
    if (currentMonth < 3) {
        return currentYear - 1; 
    } else {
        return currentYear; 
    }
  }


const currentYear = getCurrentFinancialYear();


function getFinancialQuarterDates(year, quarter) {
  let startMonth, endMonth;

  switch (quarter) {
      case 1:
          startMonth = 3; // April (0-indexed)
          endMonth = 5; // June (0-indexed)
          break;
      case 2:
          startMonth = 6; // July (0-indexed)
          endMonth = 8; // September (0-indexed)
          break;
      case 3:
          startMonth = 9; // October (0-indexed)
          endMonth = 11; // December (0-indexed)
          break;
      case 4:
          startMonth = 0; // January (0-indexed)
          endMonth = 2; // March (0-indexed)
          year++; // Increment year for Q4
          break;
      default:
          return null; // Invalid quarter
  }

  const startDate = new Date(Date.UTC(year, startMonth, 1)); // Start of the month
  const endDate = new Date(Date.UTC(year, endMonth + 1, 0)); // End of the month

  return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
  };
}



  return (
    <Datepicker
    configs={{
      shortcuts: {
        FYQ1: {
          text: "FY Q1",
          period: getFinancialQuarterDates(currentYear, 1)
      },
      FYQ2: {
          text: "FY Q2",
          period: getFinancialQuarterDates(currentYear, 2)
      },
      FYQ3: {
          text: "FY Q3",
          period: getFinancialQuarterDates(currentYear, 3)
      },
      FYQ4: {
          text: "FY Q4",
          period: getFinancialQuarterDates(currentYear , 4) 
      },
      CurrentYear: {
        text: "Current Year",
        period: getFinancialQuarterDates(currentYear, 4) 
      },
        currentMonth: `This month`,
        pastMonth: `Last month`,
        },
    }}
      useRange={false}
      showShortcuts={true}
      toggleClassName="absolute text-[#9A55FF] fill-[#9A55FF] stroke-[#9A55FF] path-[#9A55FF] rounded-r-lg text-xs right-2 h-full "
      placeholder={"Enter Date"}
      inputClassName={
        "border pl-1 text-[9px] border-[#E0E0E0] w-[99%] text-sm h-8 rounded outline-none text-[#6F6B6B]  "
      }
      value={value}
      onChange={handleValueChange}
    />
  );
};
export default DateRangePicker;
