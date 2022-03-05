import Constants, { USER_ACTION_METATYPE } from "../../Constants";
import { Helper } from "../../services/Helper";
import { RawUserActionLog } from "../../store/types";

//@ts-ignore
import ReactHtmlParser from 'react-html-parser'
import { Link } from "react-router-dom";

const GenerateContent = ({ action_log }: { action_log: RawUserActionLog }) => {

    const minutes = Math.floor((action_log.end_time - action_log.start_time) / 60)

    const renderContent = () => {
        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_CERTIFICATE) {
            return (<>
                <div>
                    {ReactHtmlParser(action_log.content)}
                </div>
                {action_log.podcast_image ? (<>
                    <div>
                        <img src={Constants.IMAGE_URL + action_log.podcast_image} alt="" />
                    </div>
                </>) : (<>

                </>)}
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_MILESTONE) {
            return (<>
                <h3 className="text-xl font-medium text-gray-600">Congratulated <span className="text-primary font-medium">{action_log.user_name}</span> completed {action_log.content} podcasts</h3>
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_SUBMIT) {
            return (<>
                <p className="text-gray-600 text-lg">
                    Congratulate <span className="text-primary">{action_log.user_name}</span> successfully submitted podcast <Link to={`/podcasts/detail/${Helper.generateCode(action_log.podcast_name)}/${action_log.podcast_id}`}><a target={`_blank`} className="inline text-yellow-600 hover:text-yellow-800">{action_log.podcast_name}{" " + action_log.podcast_sub_name}</a></Link>
                    &nbsp; after {(JSON.parse(action_log.content).total_time / 60).toFixed(2)} minutes of listening
                </p>
                <div className="mt-4">
                    {/* <div className="flex items-center">
                        <div className="w-full relative rounded-full h-2.5 overflow-hidden flex-1 bg-gray-100">
                            <div style={{ width: `${JSON.parse(action_log.content).accuracy * 100}%` }}
                                className="bg-green-400 absolute top-0 h-full left-0 rounded-full"
                            >
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="font-medium text-lg">{Math.floor(JSON.parse(action_log.content).accuracy * 100)}%</span>
                        </div>
                    </div> */}
                </div>
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_LISTENING) {
            return (<>
                <div className="mt-4">
                    <img src={`${Constants.IMAGE_URL + action_log.podcast_image}`} alt="" />
                </div>
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_SYSTEM) {
            return (<>
                <p className="text-base text-gray-600">
                    {action_log.content}
                </p>
                <div className="mt-4">
                    <img src={`${Constants.IMAGE_URL + action_log.podcast_image}`} alt="" />
                </div>
            </>)
        }
    }

    return (<>
        {renderContent()}
    </>)
}

export default GenerateContent;