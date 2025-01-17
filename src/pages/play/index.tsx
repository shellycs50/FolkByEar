import YouTube from "react-youtube"
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer"
import React from "react"
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon"
const Play = () => {
    const [data] = React.useState({
        videoId: "D6FdFNuWmVY",
        restTime: 1,
        phrases: [
            {
                "idx": 0,
                "startTime": 26.91,
                "endTime": 31.005,
                "repeatCount": 3,
                "speed": 1
            },
            {
                "idx": 1,
                "startTime": 13.05,
                "endTime": 19.355,
                "repeatCount": 3,
                "speed": 1
            },
            {
                "idx": 2,
                "startTime": 45.225,
                "endTime": 48.875,
                "repeatCount": 3,
                "speed": 0.8
            },
            {
                "idx": 3,
                "startTime": 7.85,
                "endTime": 10.805,
                "repeatCount": 5,
                "speed": 1.5
            },
            {
                "idx": 4,
                "startTime": 7.85,
                "endTime": 10.805,
                "repeatCount": 3,
                "speed": 1
            }
        ]
    })

    const yt = useYouTubePlayer()
    const playerOpts = React.useState({
        height: yt.initialBuilderSizes[1],
        width: yt.initialBuilderSizes[0],
        // playerVars: {
        //   // https://developers.google.com/youtube/player_parameters

        // },
    })

    // state variable: currentPhrase: tracking current phrase. 
    // state variable repeatTracker: tracking repeats (inits to current and decrements making original data not mutate)
    // when repeatTracker reaches 0, move to next phrase.
    // modulo length so we loop back to first phrase at the end
    // loop through phrases 

    const currentPhrase = React.useState(0)
    const repeatTracker = React.useState(data.phrases[0]?.repeatCount)
    return (
        <div>
            <YouTube id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={data.videoId} opts={playerOpts[0]} onReady={yt.onPlayerReady} onStateChange={yt.onStateChange} />
            <PlayPauseIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer" onClick={() => yt.voidPlayPause()} />
        </div>
    )
}