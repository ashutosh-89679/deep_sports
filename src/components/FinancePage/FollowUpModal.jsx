  import axios from "axios";
import IMAGES from "../../images";
import { useEffect, useState , useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import Draggable from 'react-draggable';



const FollowUpModal = ({ bookingID, onClose }) => {
  const [followUpData, setFollowUpData] = useState([]);
  const [obData , setObData] = useState([]);
  const [type, setType] = useState();
  const [followUpDate, setFollowUpDate] = useState();
  const [followUpComment, setFollowUpComment] = useState();
  const [followupFor , setFollowupFor] = useState();

  const [completedDate, setCompletedDate] = useState(null);

  const [obType , setObType]  = useState('');
  const { activeUserData } = useContext(AppContext);

 
  //console.log(bookingID);
  //console.log(type);
  //try catch

  //console.log(obData?.data[0]?.status_id);

  const getData = async () => {
    try {
      const response = await axios.patch(
        `https://aarnainfra.com/ladder2/client/followup.php`,
        {
          booking_id: bookingID,
        }
      );
      setFollowUpData(response?.data);

        //console.log(response?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error or show an error message to the user
    }
  };

  const getObData = async () => {
    try {
      const response = await axios.patch(
        `https://aarnainfra.com/ladder2/client/getObDetails.php`,
        {
          booking_id: bookingID,
        }
      );
      setObData(response?.data);
      console.log(response?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error or show an error message to the user
    }
  };
  
  const updateData = async () => {  
    try {
      if (!followUpComment || !followUpDate ) {
        toast.error('Please fill all the values');
        return;
      }

      const response = await axios.post(
        `https://aarnainfra.com/ladder2/client/followup.php`,
        {
          booking_id: bookingID,
          followup_date: followUpDate,
          followup_comment: followUpComment,
        }
      );

      console.log(response);
      toast.success('Follow Up Added Successfully');
      getData(); 

      // Reset the state values after adding the follow-up data
      setType('');
      setFollowupFor('');
      setFollowUpDate('');
      setFollowUpComment('');
    } catch (error) {
      console.error('Error updating data:', error);
      // Handle the error or show an error message to the user
    }
  };

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


  const updateOBStatus = async () => {
    try {
      if (!completedDate || !obType) {
        toast.error('Please select a status and date');
      } else if  (obType <= obData?.data[0]?.status_id){
        toast.error('Cannot set to previous status');
      } else {
        const response = await axios.patch(`https://aarnainfra.com/ladder2/client/ob.php`, {
          booking_id: bookingID,
          status_id: obType,
          completed_date: completedDate,
        });
    
        //console.log(response);
        toast.success('Successfully Updated');
        storeActivity(activeUserData?.id, activeUserData?.name,  `Updated Ob status to ${obType} and Date Set to ${completedDate} for Booking ID ${bookingID}`);
        setCompletedDate('');
        setObType('');
        getObData()
      }
     
    } catch (error) {
      console.error('Error updating OB status:', error);
      toast.error('Cannot update the Ob Status');
      // Handle the error or show an error message to the user
    }
  };
  
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getObData();
  }, []);

 // console.log(obData?.data[0]?.name);
 // console.log(followUpData);
  
  const currentDate = new Date().toISOString().split('T')[0];

  
  return (
    <div className="fixed  inset-0 z-[100] flex items-start justify-center  overflow-auto pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
        <Draggable handle=".handle">
      <div className="modal mx-auto max-h-[80vh] w-[660px] overflow-auto rounded-xl bg-white pb-4   pl-6 pr-6 outline-none followupContainer handle">
        <div className="sticky top-0 z-50 flex items-center justify-between py-5 bg-white h-fit">
          <span className="text-sm font-semibold text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid underline-offset-[12px]">
          Follow Up For - {obData?.data?.[0]?.name}
          </span>
          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>

        {/* stage div */}
                <div className="flex justify-between mt-5 ml-2">
                  <div className="relative flex flex-col justify-center  flex-1 ">
                    <div className="z-10 bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center">
                      <img src={IMAGES.TickWhite} alt="tick white " />
                    </div>
                    <div
                      className={`absolute top-[10px]  w-full ${
                        obData?.data && obData.data[0]?.status_id > 1
                          ? "bg-[#9A55FF]"
                          : "bg-[#EFE9FF]"
                      }  h-[2px]`}
                    ></div>
                    <p className="mt-2 text-[#9A55FF] text-xs font-medium">
                      BA1 <br/>
                      {obData?.data && obData.data[0]?.ba1_date || '-'}
                    </p>
                  </div>

                  <div className=" relative flex flex-1 flex-col justify-center ">
                    <div
                      className={`z-10 bg-[#9A55FF] ${
                        obData?.data && obData.data[0]?.status_id >= 2
                          ? "w-5 h-5"
                          : "w-4 h-4"
                      } rounded-full flex justify-center items-center`}
                    >
                      {obData?.data && obData.data[0]?.status_id >= 2 && (
                        <img src={IMAGES.TickWhite} alt="tick white " />
                      )}
                    </div>
                    <div
                      className={`absolute top-[10px]  w-full ${
                        obData?.data && obData.data[0]?.status_id > 2
                          ? "bg-[#9A55FF]"
                          : "bg-[#EFE9FF]"
                      }  h-[2px]`}
                    ></div>

                    <p className="mt-2 text-[#9A55FF] text-xs font-medium">
                      BA2<br/>
                      {obData?.data && obData.data[0]?.ba2_date || '-'}
                    </p>
                  </div>

                  <div className=" relative flex  flex-1 flex-col justify-center ">
                    <div
                      className={`z-10 bg-[#9A55FF] ${
                        obData?.data && obData.data[0]?.status_id >= 3
                          ? "w-5 h-5"
                          : "w-4 h-4"
                      } rounded-full flex justify-center items-center`}
                    >
                      {obData?.data && obData.data[0]?.status_id >= 3 && (
                        <img src={IMAGES.TickWhite} alt="tick white " />
                      )}
                    </div>
                    <div
                      className={`absolute top-[10px]  w-full ${
                        obData?.data && obData.data[0]?.status_id > 3
                          ? "bg-[#9A55FF]"
                          : "bg-[#EFE9FF]"
                      }  h-[2px]`}
                    ></div>

                    <p className="mt-2 text-[#9A55FF] text-xs font-medium">
                      SDR<br/>
                      {obData?.data && obData.data[0]?.sdr_date || '-'}
                    </p>
                  </div>

                   <div className="relative flex flex-col justify-center  flex-1 ">
                    <div className="z-10 bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center">
                    {obData?.data && obData.data[0]?.status_id >= 4 && (
                        <img src={IMAGES.TickWhite} alt="tick white " />
                      )}
                    </div>
                    <div
                      className={`absolute top-[10px]  w-full ${
                        obData?.data && obData.data[0]?.status_id > 4
                          ? "bg-[#9A55FF]"
                          : "bg-[#EFE9FF]"
                      }  h-[2px]`}
                    ></div>
                    <p className="mt-2 text-[#9A55FF] text-xs font-medium">
                      CP<br/>
                      {obData?.data && obData.data[0]?.composite_date || '-'}
                    </p>
                  </div>

                  <div className=" relative flex flex-col justify-center ">
                    <div
                      className={`z-10 bg-[#9A55FF] ${
                        obData?.data && obData.data[0]?.status_id >= 5
                          ? "w-5 h-5"
                          : "w-4 h-4"
                      } rounded-full flex justify-center items-center`}
                    >
                      {obData?.data && obData.data[0]?.status_id >= 5 && (
                        <img src={IMAGES.TickWhite} alt="tick white " />
                      )}
                    </div>
                    <p className="mt-2 text-[#9A55FF] text-xs font-medium text-left">
                      BA 3 <br/>
                      {obData?.data && obData.data[0]?.ba4_date || '-'}
                    </p>
                  </div>

                </div>

              {obData?.data && obData.data[0]?.status_id != 5 && (
                      <>
                      <div className="flex gap-4 mt-6">
                      <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                      <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                           Status   
                          </span>
                        <select
                          onChange={(e) => setObType(e.target.value)}
                          className="border border-[#CFCFCF] rounded w-full text-sm text-[#838383] h-9  outline-none "
                        >
                          <option selected hidden>
                                    Select Here
                                  </option>
                                  {obData?.data && obData.data[0]?.status_id >= 1 && (
                                    <option value="2" disabled={obData?.data && obData.data[0]?.status_id >= 2}>
                                      BA 2
                                    </option>
                                  )}

                                  {obData?.data && obData.data[0]?.status_id >= 2 && (
                                    <option value="3" disabled={obData?.data && obData.data[0]?.status_id >= 3}>
                                      SDR
                                    </option>
                                  )}

                                  {obData?.data && obData.data[0]?.status_id >= 3 && (
                                    <option value="4" disabled={obData?.data && obData.data[0]?.status_id >= 4}>
                                      Composite Payment
                                    </option>
                                  )}

                                  {obData?.data && obData.data[0]?.status_id >= 4 && (
                                    <option value="5" disabled={obData?.data && obData.data[0]?.status_id >= 5}>
                                      BA 3
                                    </option>
                                  )}
                        </select>
                      </div>
                                  
                      <div className="w-[48.4%] relative border border-[#E0E0E0] rounded h-9 ">
                      <input
                            onChange={(e) => setCompletedDate(e.target.value)}
                            value={completedDate}
                            type="date"
                            placeholder="Enter Here.."
                            min={
                              obData?.data &&
                              obData.data[0] &&
                              (() => {
                                switch (obData.data[0].status_id) {
                                  case 1:
                                    return obData.data[0]?.ba1_date;
                                  case 2:
                                    return obData.data[0]?.ba2_date;
                                  case 3:
                                    return obData.data[0]?.sdr_date;
                                  case 4:
                                    return obData.data[0]?.composite_date;
                                  default:
                                    return currentDate; 
                                }
                              })()
                            }
                            max={currentDate}
                            className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                          />
                          <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                            Completed Date
                          </span>
                        </div>
                      </div>
                      <button
                          onClick={() => {
                            updateOBStatus();
                          }}
                          className="bg-[#9A55FF] text-white text-sm font-semibold h-[30px] rounded px-5 block mx-auto my-6"
                        >
                          Update
                        </button>
                        </>
              )}
               


                  <hr className="mb-6 border border-[#9A55FF]" />

                <div className="flex gap-4 mt-6">
                </div>
        


          {/* followupdiv */}
        <div>
          

          <p className="text-[#696969] font-medium text-sm mb-1 mt-2">
            Enter Remark
          </p>
          <textarea
            onChange={(e) => setFollowUpComment(e.target.value)}
            placeholder="Remarks Here"
            value={followUpComment}
            className="outline-none text-sm resize-none w-full border border-[#CFCFCF] text-[#9A9A9A] rounded placeholder:text-xs placeholder:text-[#9A9A9A] pl-2 pt-2"
          ></textarea>

          <button
            onClick={updateData}
            className="bg-[#9A55FF] text-white text-sm font-semibold h-[30px] rounded px-5 block mx-auto my-6"
          >
            Add 
          </button>
          <hr className="mb-6 border border-[#9A55FF]" />
          <table className="w-full text-center ">
          <thead className="bg-[#E1CDFF] border border-[#E1CDFF] ">
              <tr>
             
                <th className="text-sm text-[#3D3D3D] font-medium border-b border-r">
                  Remark
                </th>
                <th className="text-sm text-[#3D3D3D] font-medium border-b">
                Follow Up Date
                </th>
              </tr>
            </thead>

            <tbody>
              {followUpData?.map((item, index) => (
                <tr className="h-9 border border-[#E1CDFF]">
                  <td className="border border-[#E1CDFF] text-[#555555] text-xs font-normal text-left pl-2">
                    {item?.followup_comment}
                  </td>
                  <td className="border border-[#E1CDFF] text-[#555555] text-xs font-normal  text-left pl-2">
                    {item?.followup_date}
                  </td>
                 
                </tr>
              ))}
              {/* <tr className="h-9 border border-[#E1CDFF]">
                <td className="border border-[#E1CDFF] text-[#555555] text-xs font-normal">
                  Lorem Ipsum is simply dummy text..
                </td>
                <td className="border border-[#E1CDFF] text-[#555555] text-xs font-normal">
                  Developer
                </td>
                <td className="border border-[#E1CDFF] text-[#555555] text-xs font-normal">
                  23 Oct 2023 - 12:00 PM
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
      </Draggable>
    </div>
  );
};

export default FollowUpModal;
