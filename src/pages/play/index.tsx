import YouTube from "react-youtube"
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer"
import React from "react"
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon"
import { usePlayerStore } from "packages/player/store"
export default function Play() {
    const [data] = React.useState({
        "selectedPhraseIdx": 0,
        "videoId": "Ct-oGOAQAzk",
        "phrases": [
            {
                "idx": 0,
                "startTime": 187.1,
                "endTime": 196.305,
                "repeatCount": 5,
                "speed": 0.7
            },
            {
                "idx": 1,
                "startTime": 203.75,
                "endTime": 212.32,
                "repeatCount": 5,
                "speed": 1
            }
        ],
        "restTime": 1
    })
    const phrasePlayer = usePlayerStore()

    const {
        sliderValues,
        currentTime,
        setCurrentTime,
        setDuration,
        setSpeed } = phrasePlayer

    const yt = useYouTubePlayer({
        sliderValues,
        currentTime,
        setCurrentTime,
        setDuration,
        setSpeed
    })

    // playerOpts doesnt need to be state
    const [playerOpts] = React.useState({
        height: yt.initialBuilderSizes[1],
        width: yt.initialBuilderSizes[0],
        // playerVars: {
        //   // https://developers.google.com/youtube/player_parameters
        // },
    })

    // state variable: currentPhrase: tracking current phrase. 
    // state variable repeatTracker: tracking repeats (inits to current phrase's repeat count and decrements making original data not mutate)
    // when repeatTracker reaches 0, move to next phrase.
    // modulo length so we loop back to first phrase at the end
    // loop through phrases 

    // 
    // on first play: 



    return (
        <div className="flex flex-col items-center justify-center h-screen gap-5">
            <YouTube id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={data.videoId} opts={playerOpts} onReady={yt.onPlayerReady} onStateChange={yt.onStateChange} />
            <PlayPauseIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer" onClick={() => yt.voidPlayPause()} />
        </div>
    )
}