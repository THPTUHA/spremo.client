import { useParams } from "react-router-dom";
import SettingLayout from "../../components/ui/SettingLayout";
import Action from "./action";
import Apperance from "./apperance";

const Setting = ()=>{
    const {type} = useParams();

    return(
        <SettingLayout children={
            type == 'apperance'? <Apperance/> : <Action/>
        }/>
    )
}

export default Setting;