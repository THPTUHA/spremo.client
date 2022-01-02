import Constants, { Code, DownloadSource, LAYOUT_TYPES, PodcastSource } from "../../../../Constants";
import { GetServerSideProps, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiFillEdit, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { ReactQuillNoSSR } from "../../../../components/form/NoSSR";
import Fetch from "../../../../services/Fetch";
import { Toast } from "../../../../services/Toast";
import { PodcastCollectionHook } from "../../../../store/podcast.collection/hooks";
import { RawDownloadLink, RawPodcast } from "../../../../store/types";
import { getHintText ,generateHint} from "../../../../utils/hint/hint";
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { Helper } from "../../../../services/Helper";
import Meta from "../../../../components/ui/Meta";
import { useParams } from "react-router-dom";


const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent'
]

interface DataState {
    hint: number[],
    source_key: number,
    name: string,
    duration: number,
    image_url: string,
    sub_name: string,
    result: string
}


const readAsDataURL = (file: File) => {
    return new Promise((resolve, reject)=> {
        let reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target) {
                return resolve(null);
            }

            return resolve(event.target.result);
        }
        reader.readAsDataURL(file);
    });
}

const Edit = () => {
    const {id}  = useParams();
    const [files, setFiles] = useState<File[]>([]);
    const audio_ref = useRef<HTMLAudioElement>(null);
    const [onLoading, setOnLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [collection_ids, setCollectionIds] = useState<string[]>([])
    const [download_links, setDownLoadLinks] = useState<RawDownloadLink[]>([]);
    const [post_date, setPostDate] = useState<number>();
    const [publish, setPublish] = useState<boolean>();
    const [data, setData] = useState<DataState>();
    const [podcast,setPodcast] = useState<RawPodcast>();

    useEffect(()=>{
        (async()=>{
            try {
                const res = await Fetch.postJsonWithAccessToken<{ podcast: RawPodcast, code: number, message: string }>('/api/podcasts/detail', { id:id });
                const podcast = res.data.podcast;
                setDescription(podcast.description ? podcast.description : "");
                setPostDate(podcast.since);
                setPublish(!!podcast.status);
                setPodcast(podcast);
                setData({
                    hint: podcast.hint,
                    source_key: podcast.source_key,
                    name: podcast.name,
                    duration: podcast.duration,
                    image_url: podcast.image_url,
                    sub_name: podcast.sub_name,
                    result: podcast.result,
                });
            } catch (error) {
                Toast.error("ERROR...");
            }
        })();
    },[]);

    const collections = PodcastCollectionHook.useAll();
    const hint = useMemo(() => {
        console.log("render");
        if (data&&data.result && data.result != "") {
            return generateHint(data.result);
        }
        return [];
    }, [data&&data.result]);

    const onChangeDate = (e: any) => {
        setPostDate(Helper.getUnixNum(e.target.value));
    };

    const onChangeHandle = useCallback((e) => {
        if(data)setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }, [data])

    const onChangeSource = (e: any) => {
        var source = PodcastSource.find(x => x.source_key.toString() == e.target.value.toString());
        if(data)setData({
            ...data,
            source_key: source ? source.source_key : PodcastSource[0].source_key
        })
    }

    const onToggleSelectCollection = (id: string, isSelected: boolean) => {
        if (isSelected) {
            setCollectionIds(collection_ids.filter(x => x != id));
            return;
        }

        setCollectionIds([...collection_ids, id]);
    }

    const [new_download_link, setNewDownLoadLink] = useState({
        name: DownloadSource[0].source_name,
        link: ''
    });

    const [editing_download_link, setEditingDownloadLink] = useState({
        index: -1,
        name: '',
        link: ''
    });

    const onChangeDownloadLink = useCallback((e) => {
        setNewDownLoadLink({
            ...new_download_link,
            [e.target.name]: e.target.value
        })
    }, [new_download_link])

    const onChangeEditingDownloadLink = useCallback((e) => {
        setEditingDownloadLink({
            ...editing_download_link,
            [e.target.name]: e.target.value
        })
    }, [editing_download_link])

    const onEnableEditDownloadLink = (index: number) => {
        setEditingDownloadLink({
            index: index,
            name: download_links[index].name,
            link: download_links[index].link
        });
    }

    const onEditDownLoadLink = () => {
        if (editing_download_link.name && editing_download_link.link && editing_download_link.index > -1) {
            let new_download_links = download_links;
            download_links[editing_download_link.index] = {
                name: editing_download_link.name,
                link: editing_download_link.link
            }
            setDownLoadLinks(new_download_links)
        }

        setEditingDownloadLink({
            index: -1,
            name: '',
            link: ''
        })
    }

    const onSubmit = async () => {
        setOnLoading(true);
        if(podcast){
            try {
                const res: any = await Fetch.postWithAccessToken<{ podcast: RawPodcast, code: number }>("/api/podcasts/update", {
                    ...data,
                    hint: JSON.stringify(hint),
                    description: description,
                    download_link: JSON.stringify(download_links),
                    collection_ids: collection_ids.join("_"),
                    id: podcast.id,
                    since: post_date,
                    image: images[0] ? images[0].file : null,
                    audio: files[0] ? files[0] : null,
                    status: !!publish ? 1 : 0
                })
    
                setOnLoading(false);
    
                if (res && res.data) {
                    console.log(res);
                    if (res.data.code != Code.SUCCESS) {
                        Toast.error(res.data.message)
                        return;
                    }
                    else {
                        Toast.success("Update Podcast Successful!")
    
                        return;
                    }
                }
            }
            catch (err) {
                //@ts-ignore
                Toast.error(err.message);
                setOnLoading(false);
            }
        }


    }

    const onAddDownLoadLink = () => {
        if (new_download_link.name && new_download_link.link) {
            setDownLoadLinks([
                ...download_links,
                new_download_link
            ])

            setNewDownLoadLink({
                name: '',
                link: ''
            })
        }
    };


    const onChangePodcast = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {

            var url = await readAsDataURL(e.target.files[0]);
            let audio_preview = audio_ref.current;
            audio_preview?.setAttribute("src", url as string || "");
            audio_preview?.play();

            setFiles([e.target.files[0]]);
        }
    };


    const onRemoveDownloadLink = (link: RawDownloadLink) => {
        setDownLoadLinks(download_links.filter(x => !(x.name == link.name && x.link == link.link)))
    };

    const [images, setImages] = useState<ImageListType>([]);

    const onImageSelectChange = (
        image_list: ImageListType
    ) => {
        setImages(image_list as never[]);
    };


    return (<>
    {podcast&&data&&post_date?(
    <div>
    <Meta title={`WELE | Sửa Podcast ${podcast.name}`} />
        <div className="w-full px-5 py-5 rounded-lg shadow">
            <div className="w-full flex flex-wrap">
                <div className="w-full semi-lg:w-1/2 semi-lg:pr-10">
                    <div className="mt-2 flex ">
                        <div className=" flex-1 mr-3">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Podcast Name</label>
                            <div className="w-full">
                                <input value={data.name} className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all" type="text" name="name" id="" placeholder="Podcast name..." onChange={onChangeHandle} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Podcast Number</label>
                            <div className="w-full">
                                <input value={data.sub_name} className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all" type="text" name="sub_name" placeholder="Podcast subname..." onChange={onChangeHandle} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Result</label>
                        <div className="w-full">
                            <textarea className="w-full px-5 py-5 outline-none focus:outline-none bg-gray-50 rounded-lg  border-2 border-transparent focus:border-primary transition-all"
                                name="result" value={data.result} onChange={onChangeHandle} placeholder="Result for the podcasts..." ></textarea>
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Hint</label>
                        <div className="w-full overflow-y-auto h-48">
                            <div className=" text-xs w-full px-5 py-5 outline-none focus:outline-none bg-gray-50 rounded-lg  border-2 border-transparent focus:border-primary transition-all">
                                {hint && hint.length > 0 && getHintText(data.result, hint)}
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Post date</label>
                        <div className="w-full">
                            <input className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                type="date"
                                name="since"
                                placeholder={"Post date"}
                                onChange={onChangeDate}
                                value={Helper.getDateInputFormat(post_date)}
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Download Links</label>
                        <ul className="w-full">
                            {download_links.map((link, index) => (
                                <li key={index} className="flex items-center mb-1">

                                    {index != editing_download_link.index ? <>
                                        <h5 onClick={() => onEnableEditDownloadLink(index)} className="flex-1 cursor-pointer px-2 py-1 rounded-lg bg-gray-200 mr-3 border-2 border-transparent transition-all">{link.name}</h5>
                                        <h5 onClick={() => onEnableEditDownloadLink(index)} className=" line-clamp-1 flex-1 cursor-pointer px-2 py-1 rounded-lg bg-gray-200 border-2 border-transparent transition-all">{link.link}</h5>
                                        <button className="outline-none focus:outline-none ml-3 px-1.5 py-1.5 hover:bg-gray-200 transition-all text-lg rounded-full shadow"
                                            value="" onClick={() => onRemoveDownloadLink(link)}>
                                            <span><IoMdTrash /></span>
                                        </button> </> : <>
                                        <input value={editing_download_link.name} className="flex-1 outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all" type="text" name="name" id="" placeholder="Link Name ..." onChange={onChangeEditingDownloadLink} />
                                        <input value={editing_download_link.link} className="flex-1 outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 border-2 border-transparent focus:border-primary transition-all" type="text" name="link" id="" placeholder="Link Url ..." onChange={onChangeEditingDownloadLink} />
                                        <button className="outline-none focus:outline-none ml-3 px-1.5 py-1.5 hover:bg-gray-200 transition-all text-lg rounded-full shadow"
                                            value="" onClick={() => onEditDownLoadLink()}>
                                            <span><AiFillEdit /></span>
                                        </button> </>}
                                </li>
                            ))}
                            <li className="flex items-center">
                                <select value={new_download_link.name} className="flex-1 outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all">
                                    {DownloadSource.map(e =>
                                        <option key={e.source_key} value={e.source_name}>{e.source_name}</option>
                                    )}
                                </select>
                                <input value={new_download_link.link} className="flex-1 outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 border-2 border-transparent focus:border-primary transition-all" type="text" name="link" id="" placeholder="Link Url ..." onChange={onChangeDownloadLink} />
                                <button type="submit" className="outline-none focus:outline-none ml-3 px-1.5 py-1.5 hover:bg-gray-200 transition-all text-lg rounded-full shadow"
                                    onClick={onAddDownLoadLink}>
                                    <span><IoAdd /></span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-2 flex flex-wrap">
                        <div className="flex-1">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Image Url</label>
                            <div>
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
                                        // write your building UI
                                        <div className="upload__image-wrapper">
                                            <button

                                                className={` ${images.length > 0 && "none"} text-base outline-none focus:outline-none`}
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                {podcast.image_url ? <>
                                                    <span >Upload</span>
                                                    <img src={`${Constants.IMAGE_URL + podcast.image_url}`} alt="" />
                                                </> : "Upload"}
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
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Source Name</label>
                            <select className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all" name="source_name" id="" onChange={onChangeSource}>
                                {PodcastSource.map((value, index) => (
                                    <option value={value.source_key} key={index} selected={value.source_key == data.source_key} >{value.source_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Upload File</label>
                        <div className="flex items-center">
                            <input type="file" name="file" onChange={onChangePodcast} />
                            <audio src={Constants.IMAGE_URL + podcast.file_path} ref={audio_ref} controls />
                        </div>

                    </div>
                </div>

                <div className="semi-lg:w-1/2 w-full">
                    <div className="mt-0">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Collections</label>
                        <div className="w-full flex flex-wrap">
                            {collections.map((collection, index) => (
                                <div key={collection.id} className="flex items-center mr-2 mb-2">
                                    <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                                        <input id={`collection_${collection.id}`}
                                            checked={collection_ids.includes(collection.id.toString())}
                                            onChange={() => onToggleSelectCollection(collection.id.toString(), collection_ids.includes(collection.id.toString()))}
                                            className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="" />
                                        <span className={!collection_ids.includes(collection.id.toString())?"text-transparent":""+" transition-all"}>
                                           <FaCheck />
                                        </span>
                                    </div>
                                    <label htmlFor={`collection_${collection.id}`} className="font-medium text-gray-600">{collection.name}</label>
                                </div>))}
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Publish</label>
                        <div className="w-full flex flex-wrap">
                            <div className="flex items-center mr-2 mb-2">
                                <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                                    <input
                                        id='publish-checkbox'
                                        checked={publish}
                                        onChange={() => setPublish(!publish)}
                                        className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="" />
                                    <span className={!publish?"text-transparent":""+" transition-all"}>
                                        <FaCheck />
                                    </span>
                                </div>
                                <label htmlFor={`publish-checkbox`} className="font-medium text-gray-600">{"Publish it to users"}</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Description</label>
                        <div className="w-full sm:mb-0 mb-14">
                            <ReactQuillNoSSR theme="snow"
                                modules={modules}
                                formats={formats}
                                className=" h-full w-full pb-10 text-lg"
                                value={description} onChange={setDescription} />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button
                    onClick={onSubmit}
                    className="outline-none w-36 focus:outline-none bg-primary text-white flex items-center justify-center py-1 rounded font-medium mt-3 shadow hover:bg-primary-dark transition-all">
                    {onLoading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>} <span> Save changes</span></button>
            </div>
        </div>
        </div>):""}
    </>)
}

Edit.layout = LAYOUT_TYPES.Admin;

// export const getServerSideProps: GetServerSideProps = async (context) => {
    // const res = await Fetch.postJsonWithAccessToken<{ podcast: RawPodcast, code: number, message: string }>('/api/podcasts/detail', {
    //     id: context.params ? (context.params)['id'] : 0
    // })
//     return {

//         props: { podcast: res.data.podcast },
//     }
// }


export default Edit;