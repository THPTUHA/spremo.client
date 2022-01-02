import { useEffect, useRef, useState } from 'react';
import { BadgeFunctions } from '../../store/badge/functions';
import { BadgeHook } from '../../store/badge/hooks';
import Modal from 'react-responsive-modal';
import { MeHook } from '../../store/me/hooks';
import Constants from '../../Constants';
import lottie from 'lottie-web';
import gift from '../../components/animation/gift.json';
import congrat from '../../components/animation/congrat.json';


const Badge = () => {

    const ref = useRef(null);
    const congrat_ref = useRef(null);
    const { badges } = BadgeHook.useBadges();
    const me = MeHook.useMe();
    const [show, setShow] = useState(false);
    var badge_id = badges[0] ? badges[0].id : '';


    useEffect(() => {
        if (me) {
            BadgeFunctions.init();
        }
    }, [me]);

    useEffect(() => {
        if (ref.current && congrat_ref.current) {

            lottie.loadAnimation({
                //@ts-ignore
                container: ref.current,
                renderer: 'svg',
                animationData: gift,
            });

            
            lottie.loadAnimation({
                //@ts-ignore
                container: congrat_ref.current,
                renderer: 'svg',
                animationData: congrat,
            })


        }

        return () => {
            lottie.destroy()
        }

    }, [ref.current, congrat_ref.current])

    useEffect(() => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
    }, [badge_id])

    if (!badges.length) {
        return <></>;
    }

    console.log(ref, congrat_ref);

    const badge = badges[0];
    const badge_info = Constants.BADGES.find(e => e.value == badge.badge_name)

    return (
        <div className='w-full h-full'>
            {show && <div style={{ background: 'transparent' }} className='fixed' ref={congrat_ref}></div>}

            <Modal
                classNames={{
                    modal: "rounded-3xl rounded-lg  shadow-md"
                }}
                open={!!badge}
                onClose={() => BadgeFunctions.seen(badge.id)}>
                <>
                    <div className=" bg-white" style={{ width: 320 }}>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-center text-lg text-gray-400 mb-2 mt-2">Bạn đã đạt được huy hiệu</p>
                            {
                                show && (
                                    <div style={{ height: 160, width: 160 }} ref={ref}>
                                    </div>
                                )
                            }
                            {
                                !show && <div style={{ height: 160, width: 160 }} className="p-3 rounded-3xl bg-red-100 flex items-center justify-center">
                                    <img src={badge_info?.image} alt="" />
                                </div>
                            }
                            <h5 className="text-center text-lg font-bold mt-2">
                                {badge_info?.name}
                            </h5>
                            <p className="text-center text-lg text-gray-400 mt-1">Xin chúc mừng</p>

                            <div onClick={() => BadgeFunctions.seen(badge.id)} className="mt-3 cursor-pointer flex text-white items-center justify-center py-2.5 px-5 rounded-lg shadow bg-green-400">
                                <span className="font-semibold text-sm">OK</span>
                            </div>

                        </div>
                    </div>
                </>
            </Modal>
        </div>
    );
};


export default Badge;