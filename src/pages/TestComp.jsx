import React from 'react'
import IMAGES from "../images";


function TestComp() {
    return (
        <table class="w-full "><thead><tr class="bg-[#F1EEFF] "><th class="  sticky  drop-shadow-2xl left-0 bg-inherit text-[#595959] font-semibold text-base h-[42px] min-w-[14.9vw]  w-[300px]">Project Name</th><th class="border-r-2 border-r-black text-[#595959] font-semibold text-base min-w-[19.3vw] " colspan="3">November 23'</th><th class="sticky right-0 text-[#595959] flex justify-center items-center gap-3 h-[42px] font-semibold text-base bg-inherit  min-w-[7vw]">Total</th></tr></thead><tbody><tr class=" h-[46px]"><td class="sticky left-0 bg-white text-center drop-shadow-2xl ">-</td><td class=" text-[#595959] border-r border-r-[#DFDFDF] text-sm font-medium text-center">1-10 Days</td><td class=" text-[#595959] border-r border-r-[#DFDFDF] text-sm font-medium text-center">11-20 Days</td><td class="border-r-2 border-r-black text-[#595959] text-sm font-medium text-center">21-Last</td><td class=" text-center sticky right-0 bg-white ">-</td></tr><tr class="bg-[#F4F4F4] h-[42px]"><td class="text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-10 left-0 bg-[#F1EEFF]  text-center">Dosti company</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">68.0T</td><td class="text-[#595959] text-sm font-medium text-center  border-r-2 border-r-black ">67.0T</td><td data-com="Dosti company" data-id="1" data-ns="135000" class=" bg-[#F1EEFF] text-[#595959] font-medium text-base text-center  sticky right-0 z-10">1.4L</td></tr><tr class="bg-white h-[42px]"><td class="text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-10 left-0 bg-white  text-center">Kalpatru company</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r-2 border-r-black ">67.0T</td><td data-com="Kalpatru company" data-id="3" data-ns="67000" class=" bg-white text-[#595959] font-medium text-base text-center  sticky right-0 z-10">67.0T</td></tr><tr class="bg-[#F4F4F4] h-[42px]"><td class="text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-10 left-0 bg-[#F1EEFF]  text-center">Piramal Realty Company</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r-2 border-r-black ">0</td><td data-com="Piramal Realty Company" data-id="4" data-ns="0" class=" bg-[#F1EEFF] text-[#595959] font-medium text-base text-center  sticky right-0 z-10">0</td></tr><tr class="bg-white h-[42px]"><td class="text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-10 left-0 bg-white  text-center">Raunak Group Company</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r-2 border-r-black ">67.0T</td><td data-com="Raunak Group Company" data-id="5" data-ns="67000" class=" bg-white text-[#595959] font-medium text-base text-center  sticky right-0 z-10">67.0T</td></tr><tr class="bg-[#F4F4F4] h-[42px]"><td class="text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-10 left-0 bg-[#F1EEFF]  text-center">Vijay Suraksha Realty company</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r-2 border-r-black ">67.0T</td><td data-com="Vijay Suraksha Realty company" data-id="7" data-ns="67000" class=" bg-[#F1EEFF] text-[#595959] font-medium text-base text-center  sticky right-0 z-10">67.0T</td></tr><tr class="bg-white h-[42px]"><td class="text-[#595959] drop-shadow-2xl font-medium text-sm sticky z-10 left-0 bg-white  text-center">Runwal Realty Company</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r border-r-[#DFDFDF] ">0</td><td class="text-[#595959] text-sm font-medium text-center  border-r-2 border-r-black ">67.0T</td><td data-com="Runwal Realty Company" data-id="8" data-ns="67000" class=" bg-white text-[#595959] font-medium text-base text-center  sticky right-0 z-10">67.0T</td></tr><tr class="h-[42px] bg-[#F1EEFF] "><td class="text-[#595959] sticky left-0 bg-inherit font-bold text-base  text-center drop-shadow-2xl z-10">Total</td><td class="text-[#595959] border-r border-r-[#DFDFDF] text-base font-semibold text-center ">0</td><td class="text-[#595959] border-r border-r-[#DFDFDF] text-base font-semibold text-center ">68.0T</td><td class="text-[#595959] border-r border-r-[#DFDFDF] text-base font-semibold text-center border-r-2 border-r-black">3.4L</td><td class="bg-[#F1EEFF] text-[#595959] font-semibold text-base text-center  sticky right-0 z-50">4.0L</td></tr></tbody></table>
    )
}

export default TestComp