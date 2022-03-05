import { Link } from "react-router-dom";
import Constants, { USER_ACTION_METATYPE } from "../../Constants";
import { Helper } from "../../services/Helper";
import { RawUserActionLog } from "../../store/types";

const GenerateHeader = ({ action_log}: { action_log: RawUserActionLog}) => {


    const renderContent = () => {
        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_CERTIFICATE) {
            return (<>
                get a <span className="font-medium text-green-500">special certification</span> 
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_MILESTONE) {
            return (<>
                completed <span className="text-green-600">{action_log.content} podcasts</span>
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_LISTENING) {
            return (<>
                {(action_log.end_time && Math.floor((action_log.end_time - action_log.start_time) / 60) > 10) ? (<>
                    has listened to podcast <Link to={`/podcasts/detail/${Helper.generateCode(action_log.podcast_name)}/${action_log.podcast_id}`}><a target={`_blank`} className="inline text-yellow-600 hover:text-yellow-800">{action_log.podcast_name}{" " + action_log.podcast_sub_name}</a></Link> for {Math.floor((action_log.end_time - action_log.start_time) / 60)} minutes
                </>) : (<>
                    started listening to podcast <Link to={`/podcasts/detail/${Helper.generateCode(action_log.podcast_name)}/${action_log.podcast_id}`}><a target={`_blank`} className="inline text-yellow-600 hover:text-yellow-800">{action_log.podcast_name}{" " + action_log.podcast_sub_name}</a></Link>
                </>)}
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_SUBMIT){
            return (<>
                submitted <Link to={`/podcasts/detail/${Helper.generateCode(action_log.podcast_name)}/${action_log.podcast_id}`}><a target={`_blank`} className="inline text-yellow-600 hover:text-yellow-800">{action_log.podcast_name}{" " + action_log.podcast_sub_name}</a></Link>
            </>)
        }

        if (action_log.metatype == USER_ACTION_METATYPE.METATYPE_SYSTEM) {
            return (<>
                {action_log.content}
            </>)
        }
    }

    return (<>
        {renderContent()}
    </>)
}

export default GenerateHeader;