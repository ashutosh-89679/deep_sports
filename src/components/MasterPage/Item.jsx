import React, { useState } from "react";
import IMAGES from "../../images";

const Item = ({ data, setModalData, setIsModalVisible }) => {

  //console.log(data);

  return (
    <>
      <div
        onClick={() => {
          setModalData(data);
          setIsModalVisible(true);
        }}
        className=" cursor-pointer rounded-[10px] border bg-white border-[#EDEDED] shadow-custom  mt-4  min-w-[32%]"
      >
        <div className="flex items-center justify-between pt-4 pb-3 pr-3">
          <p className="text-[#7418FC] font-medium pl-4 text-base leading-none">
            {data.project_name}
          </p>
          {data?.extended_date !== null && (
            <p className="bg-[#008F64] text-white leading-none text-sm font-medium rounded px-3 py-[7px]">
              Extended
            </p>
          )}
        </div>
        <div className="bg-[#F7F7FF] py-3 pl-3">
          <p className="leading-none text-[#1B2559] text-[13px]">
            Developer :
            <span className="font-semibold"> {data?.developer_name} </span>
          </p>
        </div>
        <div className="flex items-start gap-2 py-3 pl-8 pr-8">
          <img src={IMAGES.CalenderGrey} alt="calender icon" />
          <p className="leading-none text-[#515151] text-[13px] ">
            {new Date(data?.start_date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            <span> - </span>
            {new Date(data?.end_date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {data?.extended_date !== null && (<span> - </span>)}
           
            {data?.extended_date && (
              new Date(data?.extended_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
              })
            )}

            
          </p>
        </div>
      </div>
    </>
  );
};

export default Item;
