import React from "react";
import { GiSpeaker } from "react-icons/gi";
import Modal from "react-responsive-modal";
import Voice from "../../services/Voice";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react"
import { ReportWordType } from "../../store/types";

const ResultModal = ({
    open,
    close,
    sum_up_words
}: { open: boolean, close: () => void, sum_up_words: ReportWordType[] }) => {

    const [selected_correct_word, setCorrectWord] = useState(-1);
    return (<>
        <Modal classNames={{
            modal: 'rounded-lg top-10 w-full px-10'
        }} styles={{ modal: { margin: 0 }, modalContainer: { padding: 10 } }} open={open} onClose={() => close()}>
            <h3 className=" font-semibold text-2xl">Words you got wrong</h3>
            <div className="w-full flex flex-wrap">
                <div className="w-full py-2 pr-4 flex items-center">
                    <div className=" w-4/5">
                        <span className=" text-gray-300 font-medium">Correct Words</span>
                    </div>
                    <div className=" w-1/5 flex justify-start"><span className=" text-gray-300 font-medium">Frequency</span></div>
                </div>
            </div>
            <div className="w-full flex flex-wrap mt-4">
                {sum_up_words && sum_up_words.map((e, index) => (
                    <div className="w-full" key={index}>
                        <div className="w-full py-2 pr-4 flex items-center border-b border-gray-900 border-opacity-10 " >
                            <div className="w-4/5 line-clamp-3">
                                <span className="text-gray-400">{(index + 1).toString().padStart(2, '0')}.</span>
                                <span className="text-sm " title={e.label}> {e.label} </span>
                                <span><GiSpeaker onClick={() => Voice.speak(e.label)} style={{ display: 'inline-block', cursor: 'pointer' }} /></span>
                            </div>
                            <div className=" w-1/5 flex justify-start cursor-pointer items-center" onClick={() => setCorrectWord(selected_correct_word == index ? -1 : index)}>
                                <span className="w-8 inline-block text-center bg-gray-200 rounded-lg text-gray-500 font-semibold">{e.freq}</span>
                                <span className="ml-2 cursor-pointer">{selected_correct_word == index ? <FiChevronDown /> : <FiChevronUp />}</span>
                            </div>
                        </div>

                        <CSSTransition
                            unmountOnExit={true}
                            timeout={300}
                            in={index == selected_correct_word}
                            classNames="css-dropdown">
                            <div className="w-full pl-10 pb-5">
                                {e.references.map((wrong_text, idx) => (<div key={idx}>
                                    <span className="text-gray-400">{(idx + 1).toString().padStart(2, '0')}.</span>
                                    <span className="text-sm " title={wrong_text}> {wrong_text} </span>
                                    <span><GiSpeaker onClick={() => Voice.speak(wrong_text)} style={{ display: 'inline-block', cursor: 'pointer' }} /></span>
                                </div>))}
                            </div>
                        </CSSTransition>
                    </div>
                ))}
            </div>

            <div className=" flex justify-center mt-5">
                <button
                    onClick={() => close()}
                    className=" outline-none focus:outline-none px-3 py-1 border-2 border-blue-400 rounded text-blue-400 font-medium hover:border-blue-700 hover:text-blue-700 transition-all">
                    Close</button>
            </div>
        </Modal>
    </>)
}

export default ResultModal;