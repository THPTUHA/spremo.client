import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import Modal from "react-responsive-modal";
import { LeaderBoardProps } from "../../store/interface";
import LeaderBoardItem from "./LeaderBoardItem";


const LeaderBoard = ({ items, handleData, item_number, page, setPage, min_width, min_height, title, max_width, searchComp,item_selected }: LeaderBoardProps) => {

    const [open_search, setOpenSearch] = useState(false);
    const [item_id_selected, setItemIdSelected] = useState(item_selected?item_selected:0);

    return (
        <div className="mb-20" style={{ minWidth: min_width ? min_width : 480, maxWidth: max_width ? max_width : 500 }}>
            <div className="flex justify-between items-center">
                <div className="text-xl font-medium ml-4 text-[#2A6A02]">{title ? title : "Leader Board"}</div>
                {(searchComp ? true : false) && <div onClick={() => { setOpenSearch(true) }} className="mr-5 cursor-pointer"><IoSearch/></div>}
            </div>
            <div className=" w-80 pb-4 mt-4">
                <div className="" style={{ minHeight: min_height ? min_height : 320 }}>
                    {
                        items.map((item) => (
                            <div key={item.id} onClick={() => { if (handleData) handleData(item.id);if(item_id_selected){setItemIdSelected(item.id)}}} 
                                style={{ minWidth: min_width ? min_width : 480}}
                                className={`mb-2 ml-4 ${handleData ? "cursor-pointer" : ""} ${item_id_selected == item.id?"bg-gray-100":""}`} >
                                <LeaderBoardItem {...item} min_width={min_width}/>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                setPage && page && (
                    <div className="flex justify-center font-medium items-center " >
                        <div className="text-lg cursor-pointer hover:text-gray-500" onClick={() => { if (page > 1) setPage(page - 1) }}>{`<<`}</div>
                        <div className="px-1 text-base ">{page}</div>
                        <div className="text-lg cursor-pointer hover:text-gray-500" onClick={() => { if (page * 5 < item_number) setPage(page + 1) }}>{`>>`}</div>
                    </div>
                )
            }
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-11/12 xs:w-2/5"
                }}
                onClose={() => setOpenSearch(false)} open={(open_search && (searchComp ? true : false))}>
                <>
                    {searchComp}
                </>
            </Modal>
        </div>
    )
}

export default LeaderBoard;