import React, { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import IMAGES from "../images";
import { Chart } from "react-google-charts";
import useStore from '../store/index.jsx';
import { toast } from "react-toastify";
import FilterContainer from "../components/filters/CancellationReportFilter.jsx";

export const CommonChart = React.memo((Data , Name) => {
    let data = [
      [Name, 'Net Revenue'],
      ...Object.values(Data).flat().map(item => [item.name, Number(item.net_revenue)])
    ];
  
    data = data.sort((a, b) => b[1] - a[1]);
  
    const options = {
      legend: {
        position: 'right',
        alignment: 'center',
        textStyle: {
          fontSize: 13
        }
      },
      chartArea: {
        left: 0,
        top: 0,
        width: '100%',
        height: '90%'
      },
      hAxis: {
        textStyle: {
          fontSize: 13
        }
      },
      colors: ['red', '#ff7f7f', '#ff4c4c', '#ff0000', '#cc0000'] // Add your desired red color combination here
    };
     
    return <Chart
    chartType="PieChart"
    width="100%"
    height="300px"
    data={data}
    options={options}
  />;
});

const CancellationReportPage = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [IsActionBarVisible, setIsActionBarVisible] = useState(true);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [data, setData] = useState(null);
    const [empData , setEmpData] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Employee');
    const { CancellationReportRequestBody } = useStore();

    const formatNumber = (number) => {
        if (number >= 10000000) {
          return Math.floor(number / 10000000 * 10) / 10 + " Cr";
        } else if (number >= 100000) {
          return Math.floor(number / 100000 * 10) / 10 + " L";
        } else if (number >= 1000) {
          return Math.floor(number / 1000 * 10) / 10 + " K";
        } else {
          return number?.toString();
        }
    };      

    const fetchData = async () => {
        try {
          const res = await axios.post(
            `https://aarnainfra.com/ladder2/client/cancellationReport/table.php` , CancellationReportRequestBody
          );
          setData(res?.data);
          setEmpData(res?.data?.Employee);
        } catch (err) {
        }
      };
      
      // UseEffect for initial data fetching
      useEffect(() => {
        fetchData();
      }, [CancellationReportRequestBody]);

      function calculateTwoPercent(number , p) {
        number  = Number(number);
        p = Number(p);
        // Convert percentage to decimal
        const percent = p / 100;
      
        // Calculate 2 percent of the given number
        const result = number * percent;
      
        return result;
      }

      function calculatePartPercentage(whole, part) {
        if (whole === 0 || whole === null || whole === undefined || part === null || part === undefined) {
          return 0;
      }
        return (part / whole) * 100;
    }

      //console.log(data?.Employee)

    function splitData(empData) {
      const result = [];
  
      empData.forEach(item => {
          const totalCan = parseFloat(item.total_can) / 2;
          const av = parseFloat(item.Av) / 2;
          const brokerage = parseFloat(item.Brokerage) / 2;
  
          // First split object
          const firstSplit = {
              total_can: totalCan.toString(),
              Name: item.sourced_by,
              client_name: item.client_name,
              Av: av.toString(),
              Brokerage: brokerage.toString()
          };
  
          // Second split object
          const secondSplit = {
              total_can: totalCan.toString(),
              Name: item.closed_by,
              client_name: item.client_name,
              Av: av.toString(),
              Brokerage: brokerage.toString()
          };
  
          result.push(firstSplit, secondSplit);
      });
  
      return result;
    }

    function combineData(empData) {
      // Initialize an object to hold aggregated data for each employee
      const employeeData = {};
  
      empData.forEach(item => {
          const name = item.Name;
          const total_can = parseFloat(item.total_can);
          const av = parseFloat(item.Av);
          const brokerage = parseFloat(item.Brokerage);
  
          // If the employee name is not yet in the aggregated data, initialize it
          if (!employeeData[name]) {
              employeeData[name] = {
                  total_can: 0,
                  Av: 0,
                  Brokerage: 0
              };
          }
  
          // Aggregate data for each employee
          employeeData[name].total_can += total_can;
          employeeData[name].Av += av;
          employeeData[name].Brokerage += brokerage;
      });
  
      // Convert the aggregated data object into an array of objects
      const result = Object.entries(employeeData).map(([name, data]) => ({
          Name: name,
          total_can: data.total_can.toString(),
          Av: data.Av.toString(),
          Brokerage: data.Brokerage.toString()
      }));
  
      return result;
  }
  
    const empDataSplit = splitData(empData);
    const empDataCombined = combineData(empDataSplit);
    console.log("Calculation Data" , empDataCombined)
      

  return (
    <>
     <Header />
      <main className="flex gap-5 select-none">
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 mr-6 relative mt-4">
          <img
            onClick={() => setIsActionBarVisible(!IsActionBarVisible)}
            src={IMAGES.YellowToggleIcon}
            alt="toggle icon"
            className={`${
              IsActionBarVisible ? "rotate-180" : ""
            } absolute -right-6 top-10 cursor-pointer`}
          />
          {IsActionBarVisible && (
            <>
              <div className="py-3 pl-4 border-b border-b-black relative flex gap-4   flex-1">
                <img
                  className="cursor-pointer"
                  onClick={(e) => {
                    //console.log(1);
                    e.stopPropagation();
                    setIsFiltersVisible(!isFiltersVisible);
                  }}
                  src={IMAGES.FilterIcon}
                  alt="filter icon"
                />

                <FilterContainer
                  displayProperty={isFiltersVisible ? "block" : "none"}
                />

              </div>
            </>
            )}

            {/* Cards div start  */}
            <div className="flex flex-row w-full gap-3 mt-2 h-[132px]">
                <div className="w-1/3 border rounded-lg bg-white shadow-xl ">
                    <p className=" text-center mt-1 border-b  font-medium">No. of Units Cancelled</p>     
                    <p className="flex mt-5 text-center text-[35px] text-red-500 justify-center">{data?.Overall_cancelled[0]?.total_can || 0}<span className="text-red-700 font-bold text-sm mt-6 ml-3">({calculatePartPercentage(data?.Overall_bookings[0]?.total_booking , data?.Overall_cancelled[0]?.total_can).toFixed(2)  + " %" })</span> </p>           
                    <p className="    font-medium  text-sm text-center">Units in total</p> 
                 </div>

                <div className="w-1/3 border rounded-lg bg-white shadow-xl">
                    <p className=" text-center mt-1 border-b  font-medium">Sales Volume Affected (AV)</p>  
                    <p className="flex justify-center mt-5 text-center text-[35px]  text-red-500">₹ {formatNumber(data?.Overall_cancelled[0]?.Av) || 0} <span className="text-red-700 font-bold text-sm mt-6 ml-3">({calculatePartPercentage(data?.Overall_bookings[0]?.total_av , data?.Overall_cancelled[0]?.Av).toFixed(2)  + " %" })</span><span className=" mt-5 ml-2"><img src={IMAGES.GraphDown} alt="" /></span></p>  
                    <p className="   font-medium  text-sm text-center">value in total</p> 
                </div>

                <div className="w-1/3 border rounded-lg bg-white shadow-xl">
                    <p className=" text-center mt-1 border-b  font-medium">LN Revenue Lost</p>             
                    <p className="flex justify-center mt-5 text-center text-[35px]  text-red-500">₹ {formatNumber(calculateTwoPercent(data?.Overall_cancelled[0]?.Av , data?.Overall_cancelled[0]?.Brokerage)) || 0} <span className=" mt-5 ml-2"><img src={IMAGES.GraphDown} alt="" /></span></p>   
                    <p className="    font-medium  text-sm text-center">value in total</p> 
                </div>

            </div>
            {/* Cards div end  */}

            {/* Table div start  */}
            <div className=" h-fit max-h-fit border mt-5 ml-3">

            {/* Category Nav start  */}
            <div className="flex-row flex gap-4 w-full mb-2">
              <p
                className={`cursor-pointer text-sm ${
                  activeCategory === 'Employee' ? 'underline underline-offset-8 text-[#9A55FF]' : ''
                }`}
                onClick={() => setActiveCategory('Employee')}
              >
                Employee
              </p>
              <p
                className={`cursor-pointer text-sm ${
                  activeCategory === 'Developer' ? 'underline underline-offset-8 text-[#9A55FF]' : ''
                }`}
                onClick={() => setActiveCategory('Developer')}
              >
                Developer
              </p>
              <p
                className={`cursor-pointer text-sm ${
                  activeCategory === 'Location' ? 'underline underline-offset-8 text-[#9A55FF]' : ''
                }`}
                onClick={() => setActiveCategory('Location')}
              >
                Location
              </p>
              <p
                className={`cursor-pointer text-sm ${
                  activeCategory === 'Company' ? 'underline underline-offset-8 text-[#9A55FF]' : ''
                }`}
                onClick={() => setActiveCategory('Company')}
              >
                Company
              </p>
              <p
                className={`cursor-pointer text-sm ${
                  activeCategory === 'Project' ? 'underline underline-offset-8 text-[#9A55FF]' : ''
                }`}
                onClick={() => setActiveCategory('Project')}
              >
                Project
              </p>
            </div>
            {/* Category Nav End  */}

                {/*Employee Table start  */}
            <div className={`flex flex-col rounded-lg  mt-3 w-full ${activeCategory == 'Employee' ? 'block' : 'hidden'}`}>
            
              
                {empDataCombined?.length > 0 ? (
                  <table>
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm ">
                    <tr>
                      <th className="">Name</th>
                      <th className="">Total Units Affected</th>
                      <th className="">Total Av Affected</th>
                      <th className="">Net Rev Affected</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[#595959]">
                  {empDataCombined?.map((item, index) => (
                    <tr className="border-b text-center" key={index}>
                      <td className="text-left pl-2 border-r border-black">{item.Name}</td>
                      <td className="border-r border-black">{item.total_can} Unit</td>
                      <td className="border-r border-black">{"₹ " + formatNumber(item.Av)}</td>
                      <td className=" text-red-500">{"₹ " +formatNumber(calculateTwoPercent(item.Av , item.Brokerage))}</td>
                    </tr>
                  ))}
                  </tbody>
                  </table>
                ) : (
                  <>
                  <table>
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm ">
                    <tr>
                      <th className=" border-r border-black">Sourced By</th>
                      <th className=" border-r border-black">Closed By</th>
                      <th className=" border-r border-black">Total Units Affected</th>
                      <th className=" border-r border-black">Total Av Affected</th>
                      <th className=" border-r border-black">Net Rev Affected</th>
                    </tr>
                  </thead>
                  </table>
                  <div className="flex justify-center ">
                  <img src={IMAGES.NoData} alt="" className="h-[70px] w-[50px] mt-4"  title="No Specific Data found"/>
                  </div>
                  </>
                  
                )}
              
           
            </div>

                {/*Developer Table start  */}
            <div className={`flex flex-col rounded-lg  mt-3 w-full ${activeCategory == 'Developer' ? 'block' : 'hidden'}`}>
           
              {data?.Developer?.length > 0 ? (
                 <table>
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm ">
                   <tr className=" border-b text-center">
                     <th className="">Developer Name</th>
                     <th className="">Units Cancelled</th>
                     <th className="">Unit Value</th>
                     <th className="">Net Rev Affected</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white text-[#595959]">
                  {data?.Developer?.map((item, index) => (
                    <tr className="border-b text-center" key={index}>
                      <td className="text-left pl-2 border-r border-black">{item.developer_name}</td>
                      <td className="border-r border-black">{item.total_can} Unit</td>
                      <td className="border-r border-black">₹ {formatNumber(item.Av)}</td>
                      <td className=" text-red-500">₹ {formatNumber(calculateTwoPercent(item.Av , item.Brokerage))}</td>
                    </tr>
                  ))}
                  </tbody>
                  </table>
                ) : (
                  <>
                  <table>
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm ">
                   <tr className=" border-b text-center">
                     <th className="">Developer Name</th>
                     <th className="">Units Cancelled</th>
                     <th className="">Unit Value</th>
                     <th className="">Net Rev Affected</th>
                   </tr>
                 </thead></table>
                  <div className="flex justify-center mt-4">
                  <img src={IMAGES.NoData} alt="" className="h-[70px] w-[50px]" title="No Specific Data found" />
                  </div>
                  </>
                  
                )}
                
            
            </div>

                {/*Location Table start  */}
            <div className={`flex flex-col rounded-lg  mt-3 w-full ${activeCategory == 'Location' ? 'block' : 'hidden'}`}>         
                {data?.Location?.length > 0 ? (
                  <table>
                   <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm ">
                    <tr>
                      <th className="">Location Name</th>
                      <th className="">Units Cancelled</th>
                      <th className="">Unit Value</th>
                      <th className="">Net Rev Affected</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[#595959]">
                  {data?.Location?.map((item, index) => (
                    <tr className="border-b text-center" key={index}>
                      <td className="text-left pl-2 border-r border-black">{item.location_name}</td>
                      <td className="border-r border-black">{item.total_can} Unit</td>
                      <td className="border-r border-black">₹ {formatNumber(item.Av)}</td>
                      <td className=" text-red-500">₹ {formatNumber(calculateTwoPercent(item.Av , item.Brokerage))}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                ) : (
                  <>
                  <table>
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm ">
                    <tr>
                      <th className="">Location Name</th>
                      <th className="">Units Cancelled</th>
                      <th className="">Unit Value</th>
                      <th className="">Net Rev Affected</th>
                    </tr>
                  </thead></table>
                  <div className="flex justify-center mt-4">
                  <img src={IMAGES.NoData} alt="" className="h-[70px] w-[50px]" title="No Specific Data found" />
                  </div>
                  </>
                  
                )}
                
            </div>

                {/*Company Table start  */}
            <div className={`flex flex-col rounded-lg  mt-3 w-full ${activeCategory == 'Company' ? 'block' : 'hidden'}`}>           
                {data?.Company?.length > 0 ? (
                  <table>
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm">
                    <tr>
                      <th className="">Company Name</th>
                      <th className="">Units Cancelled</th>
                      <th className="">Unit Value</th>
                      <th className="">Net Rev Affected</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[#595959]">
                  {data?.Company?.map((item, index) => (
                    <tr className="border-b text-center" key={index}>
                    <td className=" text-left border-r border-black">{item.company_name}</td>
                    <td className=" text-center border-r border-black">{item.total_can} Unit</td>
                    <td className=" text-center border-r border-black">₹ {formatNumber(item.Av)}</td>
                    <td className=" text-center text-red-500">₹ {formatNumber(calculateTwoPercent(item.Av , item.Brokerage))}</td>
                  </tr>
                  ))}
                   </tbody>
                  </table>
                ) : (
                  <>
                  <table>
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm">
                    <tr>
                      <th className="">Company Name</th>
                      <th className="">Units Cancelled</th>
                      <th className="">Unit Value</th>
                      <th className="">Net Rev Affected</th>
                    </tr>
                  </thead></table>
                  <div className="flex justify-center mt-4">
                  <img src={IMAGES.NoData} alt="" className="h-[70px] w-[50px]" title="No Specific Data found" />
                  </div>
                  </>
                )}
                 
            </div>

                {/*Project Table start  */}
            <div className={`flex flex-col rounded-lg  mt-3 w-full ${activeCategory == 'Project' ? 'block' : 'hidden'}`}>
            
                {data?.Project?.length > 0 ? (
                  <table className="">
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm">
                    <tr>
                      <th className=" ">Project Name</th>
                      <th className=" ">Units Cancelled</th>
                      <th className=" ">Unit Value</th>
                      <th className=" ">Net Rev Affected</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[#595959]">
                  {data?.Project?.map((item, index) => (
                    <tr className="border-b text-center" key={index}>
                    <td className="pl-2 text-left border-r border-black">{item.project_name}</td>
                    <td className=" text-center border-r border-black">{item.total_can} Unit</td>
                    <td className=" text-center border-r border-black">₹ {formatNumber(item.Av)}</td>
                    <td className=" text-center text-red-500">₹ {formatNumber(calculateTwoPercent(item.Av , item.Brokerage))}</td>
                  </tr>
                  ))}
                  </tbody>
            </table>
                ) : (
                  <>
                  <table className="">
                  <thead className="border-b border-b-[#979494] h-12 bg-[#F7F8FF] rounded-t-lg text-[#9A55FF] font-medium text-sm">
                    <tr>
                      <th className=" ">Project Name</th>
                      <th className=" ">Units Cancelled</th>
                      <th className=" ">Unit Value</th>
                      <th className=" ">Net Rev Affected</th>
                    </tr>
                  </thead></table>
                  <div className="flex justify-center mt-4">
                  <img src={IMAGES.NoData} alt="" className="h-[70px] w-[50px]" title="No Specific Data found" />
                  </div>
                  </>
                )}
                
            </div>

            </div>
            {/* Table div start  */}            


        </section>
        </main>
    </>
  )
}

export default CancellationReportPage