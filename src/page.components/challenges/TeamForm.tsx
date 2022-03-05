import { memo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import ImageUploading,{ ImageListType } from "react-images-uploading";
import Constants, { Code, TeamStatus } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawRecordChallengeUser, RawTeamChallenge, RawUser } from "../../store/types";

interface TeamResponse{
    record: RawRecordChallengeUser,
    team: RawTeamChallenge,
    members: RawUser[],
    code: number,
    message: string
}
interface Data{
    team:RawTeamChallenge,
    reloadData: ()=>void,
}

const TeamForm = ({team,reloadData}:Data)=>{
    const [name,setName] = useState(team.name);
    const [description,setDescription] = useState(team.description);
    const [images, setImages] = useState<ImageListType>([]);
    const [status, setStatus] = useState(team.status);
    const [is_loading,setIsLoading] = useState(false);

    const onImageSelectChange = (
        imageList: ImageListType,
    ) => {
        console.log(imageList);
        setImages(imageList as never[]);
    };

    const submit = async(is_create: boolean)=>{
        if(!name){
            Toast.error("Name can not be empty!");
            return;
        }
        const url = is_create?'/api/team.challenge/create': '/api/team.challenge/update';
        console.log(url);
        try {
            setIsLoading(true);
            const res = await Fetch.postWithAccessToken<TeamResponse>(url, {
                team_id: team.id?team.id: 0,
                name: name,
                challenge_id: team.challenge_id,
                status: status,
                description: description,
                image: images.length? images[0].file: team.avatar
            });
            setIsLoading(false);
            if (res && res.data) {
                console.log(res.data);
                if (res.data.code == Code.SUCCESS) {
                    reloadData();
                    Toast.success(is_create?"Create team sucessful!":"Update team sucessful!");
                    return;
                }
                Toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!");
        }
    }
    return (
        <>
        {
        <div className="flex flex-col  w-full">
            <div className="">
                <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Name </label>
                <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}} className="border-[1px] border-gray-300 w-full"/>
            </div>
            <div>
                <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Description </label>
                <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}} className="w-full border-[1px] border-gray-300"/>
            </div>
            <div className="mt-2">
                <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Avatar </label>
                <ImageUploading
                    value={images}
                    onChange={onImageSelectChange}
                    maxNumber={1}
                    dataURLKey="data_url"
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageUpdate,
                        isDragging,
                        dragProps,
                    }) => (
                        <div className="upload__image-wrapper">
                            <button
                                className={` ${images.length > 0 && "none"} text-base outline-none focus:outline-none outline-none w-20 focus:outline-none  `}
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                {team.avatar ? <>
                                        <span>Upload</span>
                                        <img src={`${Constants.IMAGE_URL + team.avatar}`} alt="" />
                                    </> :(
                                        <div className="flex items-center bg-blue-500 rounded-lg text-white px-1 py-1">
                                            <BsFillArrowUpCircleFill/>
                                            <div className="font-medium ">Upload</div>
                                        </div>
                                    )}
                            </button>
                            {imageList.map((image, index) => (
                                <div key={index} className="flex">
                                    <div
                                        className=" overflow-hidden rounded-md shadow relative">
                                        <img src={`${image['data_url']}`} alt="" />
                                        <div className="absolute flex items-center top-3 right-1">
                                            <span onClick={() => onImageUpdate(index)} className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                                <FiEdit />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ImageUploading>
            </div>
            <div className="mt-2">
                <div className="flex font-medium ">
                    <div className="flex items-center">
                        <label>Public</label>
                        <input onChange={()=>setStatus(TeamStatus.PUBLIC)} type="checkbox" name="status" value={1} checked={status==1} className="ml-1"/>
                    </div>
                    <div className="flex items-center ml-4">
                        <label>Private</label>
                        <input onChange={()=>setStatus(TeamStatus.PRIVATE)} type="checkbox" name="status" value={2} checked={status==2} className="ml-1"/>
                    </div>
                </div>
            </div>
            <div className="flex justify-start mt-2">
                {
                    team.id 
                    ?<a onClick={()=>submit(false)} className="cursor-pointer outline-none w-16 focus:outline-none bg-green-500 text-white flex mb-6 items-center justify-center py-1 rounded font-medium  shadow hover:bg-primary-dark transition-all">
                        {is_loading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                        <span >Save</span>
                    </a>
                    :<a onClick={()=>submit(true)} className="cursor-pointer outline-none w-36 focus:outline-none bg-green-500 text-white flex mb-6 items-center justify-center py-1 rounded font-medium  shadow hover:bg-primary-dark transition-all">
                        {is_loading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                        <span >Create team</span>
                    </a>
                }
                {/* <div onClick={setSelectedFrom} className="ml-4">
                    <button className="outline-none w-16 focus:outline-none bg-primary text-white flex mb-6 items-center justify-center py-1 rounded font-medium  shadow hover:bg-primary-dark transition-all">
                        Cancel
                    </button>
                </div> */}
            </div>
        </div>
        }
        </>
    )
}

export default memo(TeamForm);