import React from "react";
import { FaArrowRight } from "react-icons/fa";

const SideBanner = () => {
    return (<>
        <div>
            <div className="rounded-3xl bg-white shadow-md pt-5 pb-10 px-6 2xl:px-12">
                <div className="flex flex-col items-center justify-center">
                    <div className="p-3 rounded-3xl bg-red-100">
                        <img src="/static/Fire.png" className="w-12" alt="" />
                    </div>
                    <h5 className="text-center text-lg font-bold mt-2">
                        Khám phá khuyến mại ELSA <span className="text-red-500 underline">80%</span>
                    </h5>
                    <p className="text-center text-lg text-gray-400 mt-1">Nếu bạn quan tâm hãy click vô</p>
                    <a target='_blank' href="https://elsaspeak.com/inf/wele/">
                        <div className="mt-3 cursor-pointer flex text-white items-center justify-center py-2.5 px-5 rounded-lg shadow bg-green-400">
                            <span className="font-semibold text-sm">Xem ngay</span>
                            <span className="ml-2"><FaArrowRight/></span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </>)
}

export default SideBanner;