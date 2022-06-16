import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading';
import { Code } from '../../Constants';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { MeHook } from '../../store/me/hooks';

const Apperance = ()=>{
    const me = MeHook.useMe();
    const [avatar, setAvatar] = useState<ImageListType>([]);
    const [background, setBackGround] = useState<ImageListType>([]);

    const onAvatarSelectChange = (
        image_list: ImageListType
    ) => {
        setAvatar(image_list as never[]);
    };

    const onBackgroundSelectChange = (
        image_list: ImageListType
    ) => {
        setBackGround(image_list as never[]);
    };

    const handleSumbit = async()=>{
        try {
            const res  = await Fetch.postWithAccessToken<{code: number, message: string}>('/api/me/appearance.edit',{
                avatar: avatar[0]? avatar[0].file: "",
                background: background[0]? background[0].file: ""
            });
            
            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Update Successfull");
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }
    }
    return (
        <div className="w-full mt-5 flex flex-col justify-center items-center text-black">
            <div className='full flex flex-col justify-center items-center'>
                <div className='w-full'>
                    <ImageUploading
                        value={background}
                        onChange={onBackgroundSelectChange}
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
                                    className={` ${background.length > 0 && "none"} text-base outline-none focus:outline-none`}
                                    style={isDragging ? { color: 'red' } : undefined}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    <div className='relative'>
                                        <div className="bg-no-repeat bg-cover bg-center"
                                            style={{
                                                minWidth:750,
                                                minHeight:300,
                                                backgroundImage:`url(${me?.background?me.background :"https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg"})`}}>
                                        </div>
                                        <div className="absolute flex items-center top-3 right-1">
                                            <span className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                                <FiEdit />
                                            </span>
                                        </div>     
                                    </div>
                                </button>
                                {imageList.map((image, index) => (
                                    <div key={index} className="relative">
                                        <div className="bg-no-repeat rounded bg-center  bg-cover"
                                            style={{
                                                minWidth:750,
                                                minHeight:300,
                                                backgroundImage:`url(${image['data_url']})`
                                            }}>
                                        </div>
                                        <div className="absolute flex items-center top-3 -right-10">
                                            <span onClick={() => onImageUpdate(index)} className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                                <FiEdit />
                                            </span>
                                        </div> 
                                    </div>
                                ))}
                            </div>
                        )}
                    </ImageUploading>
                </div>
                <div className='absolute ' style={{bottom: 60}}>
                    <ImageUploading
                        value={avatar}
                        onChange={onAvatarSelectChange}
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
                            <div className="upload__image-wrapper ">
                                <button
                                    className={` ${avatar.length > 0 && "none"} text-base outline-none focus:outline-none`}
                                    style={isDragging ? { color: 'red' } : undefined}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    <div className='relative '>
                                        <div className="bg-no-repeat bg-cover bg-center rounded-full  border-4 boder-white"
                                            style={{
                                                minWidth:100,
                                                minHeight:100,
                                                backgroundImage:`url(${me?.avatar?me.avatar :"https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg"})`}}>
                                        </div>
                                        <div className="absolute flex items-center top-3 right-1">
                                            <span className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                                <FiEdit />
                                            </span>
                                        </div>     
                                    </div>
                                </button>
                                {imageList.map((image, index) => (
                                    <div key={index} className="flex ">
                                        <div className="rounded-full bg-no-repeat border-4 boder-white bg-center  bg-cover"
                                            style={{
                                                minWidth: 100,
                                                minHeight: 100,
                                                backgroundImage:`url(${image['data_url']})`}}>
                                        </div>
                                        <div className="absolute flex items-center top-3 right-1">
                                            <span onClick={() => onImageUpdate(index)} className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                                <FiEdit />
                                            </span>
                                        </div> 
                                    </div>
                                ))}
                            </div>
                        )}
                    </ImageUploading>
                </div>
                <div className='font-medium text-5xl mt-10 text-white w-full center'>
                    {me?.username}
                </div>
            </div>
           <button onClick={handleSumbit} className="text-white"
           >Save</button>
        </div>
    )
}

export default Apperance;