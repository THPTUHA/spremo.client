import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-responsive-modal';
import lottie from 'lottie-web';
import trophy from '../animation/trophy.json';
import { CongratHook } from '../../store/congrat/hooks';
import { CongratFunctions } from '../../store/congrat/functions';


const Congrat = () => {

    const ref = useRef(null);
    const congrat_ref = useRef(null);
    const { congrat } = CongratHook.useCongrat();

    useEffect(() => {
        if (ref.current && congrat_ref.current) {
            
            lottie.loadAnimation({
                //@ts-ignore
                container: ref.current,
                renderer: 'svg',
                animationData: trophy,
            });
            
            // lottie.loadAnimation({
            //     //@ts-ignore
            //     container: congrat_ref.current,
            //     renderer: 'svg',
            //     animationData: congrat,
            // })


        }

        return () => {
            lottie.destroy()
        }

    }, [ref.current, congrat_ref.current])


    if (!congrat) {
        return <></>
    }

    return (
        <div className='w-full h-full'>
            <div style={{ background: 'transparent' }} className='fixed' ref={congrat_ref}></div>
            <Modal
                classNames={{
                    modal: "rounded-3xl rounded-lg  shadow-md"
                }}
                open={!!congrat}
                onClose={() => CongratFunctions.reset()}>
                <>
                    <div className=" bg-white" style={{ width: 320 }}>
                        <div className="flex flex-col items-center justify-center">
                            <div style={{ height: 160, width: 160 }} ref={ref}>
                            </div>

                            <h5 className="text-center text-lg font-bold mt-2">
                                {congrat}
                            </h5>
                            <p className="text-center text-lg text-gray-400 mt-1">Xin chúc mừng</p>

                            <div onClick={() => CongratFunctions.reset()} className="mt-3 cursor-pointer flex text-white items-center justify-center py-2.5 px-5 rounded-lg shadow bg-green-400">
                                <span className="font-semibold text-sm">OK</span>
                            </div>

                        </div>
                    </div>
                </>
            </Modal>
        </div>
    );
};


export default Congrat;