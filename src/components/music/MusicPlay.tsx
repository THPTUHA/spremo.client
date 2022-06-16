import Plyr from "plyr-react";
import { memo } from "react";

const MusicPlay = ({url}:{url: string})=>{
    console.log("URL",url);
    const videoSrc: Plyr.SourceInfo = {
        type: "audio",
        sources: [
          {
            src: url
          }
        ]
    };

    return (
        <>
            <Plyr 
              source={videoSrc}
              loop={true}  
              options = {
                {
                  controls: [
                    "play",
                    "progress",
                    "current-time",
                    "duration",
                    "mute",
                    "volume",
                    "settings",
                    "fullscreen",
                  ],
                }
              }
            />
        </>
    );
}

export default memo(MusicPlay);