import { Link } from "react-router-dom";
import { useAsync } from "react-use";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Helper } from "../../services/Helper";
import { Toast } from "../../services/Toast";

const Verify = ()=>{
    const state = useAsync(async () => {
        try {
            console.log(Helper.getURLParams());
            const res = await Fetch.postWithAccessToken<any>('/api/authentication/verify', {
                ...Helper.getURLParams(),
            });
    
            if (res.status == 200) {
                if (res.data && res.data.code == Code.SUCCESS) {
                    console.log("data",res.data)
                   return {
                       user: res.data.user
                   }
                }
            }    
        } catch (error) {
            Toast.error("ERROR!");
        }
        return {
            user: {}
        }
    }, [Helper.setAndGetURLParam([])]);

    return (
       <div className="mt-5 flex items-center">
           <div className="font-bold text-5xl text-white">Welcome <span>{state.value?.user.username}</span></div>
           <Link to="/authentication/login">
                <button>Log in</button>
           </Link>
       </div>
    )
}

export default Verify;