import YouTube from "react-youtube"
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer"
import React, { useCallback } from "react"
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon"
import { usePlayerStore } from "packages/player/store"
import PlayerTextArea from "packages/player/components/PlayerTextArea"
import debounce from "lodash.debounce"
export default function Play() {

    const pp = usePlayerStore() //pp = phrasePlayer
    const data = pp.data
    const {
        sliderValues,
        // currentTime,
        setCurrentTime,
        setDuration,
        setSpeed } = pp

    // 
    // on first play: 

    //   sliderValues: [0, 0],
    //   setSliderValues: (values) => set({ sliderValues: values }),
    //   currentTime: 0,
    //   setCurrentTime: (time) => set({ currentTime: time }),
    //   duration: 0,
    //   setDuration: (duration) => set({ duration: duration }),
    //   speed: 1,
    //   setSpeed: (speed) => set({ speed: speed }),

    //   currentPhraseIdx: 0,
    //   setCurrentPhraseIdx: (idx) => set({ currentPhraseIdx: idx }),
    //   currentPhraseRepeatCount: null,
    //   setCurrentPhraseRepeatCount: (count) =>
    //   set({ currentPhraseRepeatCount: count }),

    // state variable: currentPhrase: tracking current phrase. 
    // state variable repeatTracker: tracking repeats (inits to current phrase's repeat count and decrements making original data not mutate)
    // when repeatTracker reaches 0, move to next phrase.
    // modulo length so we loop back to first phrase at the end
    // loop through phrases 

    // const onLoopCore = () => {
    //     if (pp.currentPhraseRepeatCount !== null && pp.currentPhraseRepeatCount <= 1) {
    //         console.log('next phrase')
    //         if (data.phrases[pp.currentPhraseIdx + 1]) {
    //             pp.setSliderValues([data.phrases[pp.currentPhraseIdx + 1]?.startTime ?? 0, data.phrases[pp.currentPhraseIdx + 1]?.endTime ?? 5])
    //             pp.setCurrentPhraseRepeatCount(data.phrases[pp.currentPhraseIdx + 1]?.repeatCount ?? 3)
    //             pp.setCurrentPhraseIdx((pp.currentPhraseIdx + 1))

    //         } else {
    //             pp.setCurrentPhraseIdx(0)
    //             pp.setSliderValues([data.phrases[0]?.startTime ?? 0, data.phrases[0]?.endTime ?? 5])
    //             pp.setCurrentPhraseRepeatCount(data.phrases[0]?.repeatCount ?? 3)
    //         }

    //     } else {
    //         if (pp.currentPhraseRepeatCount) {
    //             console.log(pp.currentPhraseRepeatCount - 1)
    //             pp.decrementRepeatCount()
    //         }
    //     }
    // }

    const onLoopCore = () => {
        const pp = usePlayerStore.getState()
        if (pp.currentPhraseRepeatCount && pp.currentPhraseRepeatCount >= 1) {
            console.log(pp.currentPhraseRepeatCount)
            pp.decrementRepeatCount()
            return
        }
        if (data.phrases[pp.currentPhraseIdx + 1]) {
            pp.setSliderValues([data.phrases[pp.currentPhraseIdx + 1]?.startTime ?? 0, data.phrases[pp.currentPhraseIdx + 1]?.endTime ?? 5])
            pp.setCurrentPhraseRepeatCount(data.phrases[pp.currentPhraseIdx + 1]?.repeatCount ?? 3)
            pp.setCurrentPhraseIdx((pp.currentPhraseIdx + 1))

        } else {
            pp.setCurrentPhraseIdx(0)
            pp.setSliderValues([data.phrases[0]?.startTime ?? 0, data.phrases[0]?.endTime ?? 5])
            pp.setCurrentPhraseRepeatCount(data.phrases[0]?.repeatCount ?? 3)
        }
    }

    const onLoop = debounce(onLoopCore, 500)

    const yt = useYouTubePlayer({
        sliderValues,
        setCurrentTime,
        setDuration,
        setSpeed,
        onLoop
    })

    const handlePlayPauseClick = () => {
        if (!pp.hasStarted) {
            pp.setSliderValues([data.phrases[pp.currentPhraseIdx]?.startTime ?? 666, data.phrases[pp.currentPhraseIdx]?.endTime ?? 666])
            pp.setSpeed(data.phrases[pp.currentPhraseIdx]?.speed ?? 666)
            yt.voidChangeSpeed(data.phrases[pp.currentPhraseIdx]?.speed ?? 666)
            pp.setCurrentPhraseRepeatCount(data.phrases[pp.currentPhraseIdx]?.repeatCount ?? 666)
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

            <PlayerTextArea />
            <div className="relative">
                <YouTube id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={data.videoId} opts={playerOpts} onReady={yt.onPlayerReady} onStateChange={yt.onStateChange} />
                <div className="absolute top-0 left-0 w-full h-full z-10 cursor-not-allowed"></div>
            </div>
            <PlayPauseIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer select-none" onClick={handlePlayPauseClick} />
            <pre className="fixed left-2 top-1 text-white text-xs">{JSON.stringify(pp, null, 2)}</pre>
        </div>
    )
}