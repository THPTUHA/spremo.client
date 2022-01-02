import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { LoadingHook } from '../../store/loading/hooks';


const LoadingAbsolute = ({ height }: { height?: number }) => {
    return (
        <div className=" h-96 z-50 fixed w-full left-0 flex items-center justify-center">
            <span className="text-primary text-opacity-80 text-8xl animate-spin"><AiOutlineLoading3Quarters/></span>
        </div>
    )
};

export const ProgressLoading = () => {
    const state = LoadingHook.useLoading();
    return <>
        {state.loading && <progress style={{ height: 6, position: 'fixed', top: 0, width: '100%', zIndex: 99999 }} className="uk-progress" value={state.progress} max="100"></progress>}
    </>
}

export const Loading = ({ height }: { height?: number }) => {
    return (
        <div style={{minHeight: '300px'}} className=" flex items-center justify-center">
            <span className="text-primary text-opacity-80 text-8xl animate-spin"><AiOutlineLoading3Quarters/></span>
        </div>
    )
};

export const FetchLoading = () => {
    const { loading, show_loading } = LoadingHook.useLoading();

    if (loading && show_loading) {
        return (
            <div style={{
                alignItems: 'center',
                display: 'flex',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999999,
                background: `rgba(0,0,0,0)`,
                justifyContent: 'center',
                paddingTop: 35
            }}>
                <div style= {
                    {
                        position: "absolute",
                        bottom: 20,
                        right: 50
                    }
                }>
                    <div className="loader">Loading...</div>
                </div>
            </div>
        )
    }

    return null;
}

export const HorizontalLoading = () => {

        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                zIndex: 2,
                background: `rgba(0,0,0,0)`,
            }}>
                 <div className="loader2">Loading...</div>
            </div>
        )
}


export default LoadingAbsolute; 