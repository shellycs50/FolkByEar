import YouTube from "react-youtube"
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer"
import React from "react"
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon"
import { usePlayerStore } from "packages/player/store"
import PlayerTextArea from "packages/player/components/PlayerTextArea"
import debounce from "lodash.debounce"
import { PlayerPhraseVisualizer } from "packages/player/components/PlayerPhraseVisualizer"
export default function Play() {

    const pp = usePlayerStore() //pp = phrasePlayer


    const onLoopCore = () => {
        const pp = usePlayerStore.getState()
        if (pp.currentPhraseRepeatCount && pp.currentPhraseRepeatCount >= 1) {
            console.log(pp.currentPhraseRepeatCount)
            pp.decrementRepeatCount()
            return
        }
        if (pp.data.phrases[pp.currentPhraseIdx + 1]) {
            pp.setSliderValues([pp.data.phrases[pp.currentPhraseIdx + 1]?.startTime ?? 0, pp.data.phrases[pp.currentPhraseIdx + 1]?.endTime ?? 5])
            pp.setCurrentPhraseRepeatCount(pp.data.phrases[pp.currentPhraseIdx + 1]?.repeatCount ?? 3)
            pp.setCurrentPhraseIdx((pp.currentPhraseIdx + 1))

        } else {
            pp.setCurrentPhraseIdx(0)
            pp.setSliderValues([pp.data.phrases[0]?.startTime ?? 0, pp.data.phrases[0]?.endTime ?? 5])
            pp.setCurrentPhraseRepeatCount(pp.data.phrases[0]?.repeatCount ?? 3)
        }
    }

    const onLoop = debounce(onLoopCore, 500) // debounce is a hacky way to stop multiple calls
    const yt = useYouTubePlayer('player', onLoop)

    const handlePlayPauseClick = () => {
        if (!pp.hasStarted) {
            pp.setSliderValues([pp.data.phrases[pp.currentPhraseIdx]?.startTime ?? 666, pp.data.phrases[pp.currentPhraseIdx]?.endTime ?? 666])
            pp.setSpeed(pp.data.phrases[pp.currentPhraseIdx]?.speed ?? 666)
            yt.voidChangeSpeed(pp.data.phrases[pp.currentPhraseIdx]?.speed ?? 666)
            pp.setCurrentPhraseRepeatCount(pp.data.phrases[pp.currentPhraseIdx]?.repeatCount ?? 666)
            pp.setHasStarted(true)
        }
        yt.voidPlayPause()
    }

    // playerOpts doesnt need to be state
    const [playerOpts] = React.useState({
        height: yt.initialBuilderSizes[1],
        width: yt.initialBuilderSizes[0],
        autoplay: '0',
        controls: '0',
        // playerVars: {
        //   // https://developers.google.com/youtube/player_parameters
        // },
    })

    return (
        <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
            <PlayerPhraseVisualizer />
            <PlayerTextArea />
            <div className="relative">
                <YouTube id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={pp.data.videoId} opts={playerOpts} onReady={yt.onPlayerReady} onStateChange={yt.onStateChange} />
                <div className="absolute top-0 left-0 w-full h-full z-10 cursor-not-allowed"></div>
            </div>
            <PlayPauseIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer select-none" onClick={handlePlayPauseClick} />
            <div className="fixed left-2 top-1 flex flex-col gap-2">
                <h2>Current Phrase</h2>
                <pre className="text-white text-xs">
                    {JSON.stringify(pp.data.phrases[pp.currentPhraseIdx], null, 2)}
                </pre>
                <h2>Repeats left</h2>
                <pre className="text-white text-xs">
                    {JSON.stringify(pp.currentPhraseRepeatCount, null, 2)}
                </pre>
            </div>

        </div>
    )
}