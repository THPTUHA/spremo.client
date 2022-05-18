const DrawViewModal = ({draw}:{draw: any})=>{
    return (
        <div>
            <img src={draw.data.url} className="w-full" />
        </div>
    )
}

export default DrawViewModal;