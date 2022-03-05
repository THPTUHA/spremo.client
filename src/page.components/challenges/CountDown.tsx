import { useEffect, useState } from "react";
import { Helper } from "../../services/Helper";

interface CountDownParamester {
    start_time: number,
    end_time: number,
    reloadData?: () => void
}

const CountDown = ({ start_time, end_time, reloadData }: CountDownParamester) => {
    const [time, setTime] = useState(start_time - Helper.time() > 0
        ? {
            value: start_time - Helper.time(),
            is_register: true
        }
        : end_time - Helper.time() > 0
            ? {
                value: end_time - Helper.time(),
                is_register: false
            }
            : {
                value: 0,
                is_register: false
            });

    useEffect(() => {
        let interval = setInterval(() => { setTime({ ...time, value: time.value - 1 }) }, 1000);
        if (time.value <= 0) {
            clearInterval(interval);
            if (time.is_register) {
                interval = setInterval(() => { setTime({ ...time, value: end_time - Helper.time() }) }, 1000);
                if(reloadData){
                    reloadData();
                }
            }
        }
        return () => {
            clearInterval(interval);
        }
    }, [time]);

    return (
        <div>
            {
                time.value > 0
                    ? `${Helper.getTime(time.value)} left`
                    : time.is_register ? <div className="font-medium">Start...</div>
                        : <div className="font-medium">Finised</div>
            }
        </div>
    )
}

export default CountDown;