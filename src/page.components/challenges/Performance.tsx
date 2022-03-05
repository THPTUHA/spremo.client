import { Helper } from "../../services/Helper"
import { PerformanceProps } from "../../store/interface"

const Performance = ({ time_listen, point, member_number, title, rank }: PerformanceProps) => {
    return (
        <div className="font-medium">
            <div className='text-xl'>{title}</div>
            {
                rank ? (
                    <div className='flex justify-between w-full mb-5'>
                        <div className='flex flex-col'>
                            <div className='text-8xl'>
                                <span className='text-red-500'>{rank}</span>/
                                <span className='text-green-500'>{member_number}</span>
                            </div>
                            <div className='text-gray-400'>Rank</div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-col items-end mr-4 mb-5'>
                                <div className='text-blue-600 text-xl'>{Helper.getTimeListen(time_listen)}</div>
                                <div className='text-gray-400 text-base'>Listening time</div>
                            </div>
                            <div className='flex flex-col items-end mr-4 mb-5'>
                                <div className='text-red-600 text-xl'>{(point / 100).toFixed(2)} points</div>
                                <div className='text-gray-400 text-base'>Point received</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex mt-5'>
                        <div className='flex flex-col mr-4 mb-5'>
                            <div className='text-blue-600 text-xl'>{Helper.getTimeListen(time_listen)}</div>
                            <div className='text-gray-400 text-base'>Listening time</div>
                        </div>
                        <div className='flex flex-col mr-4 mb-5'>
                            <div className='text-red-600 text-xl'>{(point / 100).toFixed(2)} points</div>
                            <div className='text-gray-400 text-base'>Point received</div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Performance;