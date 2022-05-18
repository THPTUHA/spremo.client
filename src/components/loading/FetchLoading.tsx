import { LoadingHook } from "../../store/loading/hooks";

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