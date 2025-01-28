import YouTube from "react-youtube"
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer"
import React, { useEffect } from "react"
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon"
import { ForwardIcon } from "@heroicons/react/16/solid"
import { BackwardIcon } from "@heroicons/react/16/solid"
import { ArrowPathIcon } from "@heroicons/react/16/solid"
import { usePlayerStore } from "packages/player/store"
import { PlayerPhraseVisualizer } from "packages/player/components/PlayerPhraseVisualizer"
import SpeedDropDown from "packages/builder/components/SpeedDropDown"
import RestTimeDropDown from "packages/player/components/RestTimeDropDown"
import ReactSlider from "react-slider"
import { fmtMSS } from "packages/looper/helpers"
import debounce from "lodash.debounce"
import Instructions from "packages/player/components/Instructions"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import { dataDecompress } from "packages/sharing/conversion"
import Link from "next/link"
import Header from "packages/header/Header"

export default function Player() {
    const pp = usePlayerStore() //pp = phrasePlayer

    const router = useRouter()

    const removeQueryParams = async () => {
        await router.push({
            pathname: router.pathname,
            query: {},
        }, undefined, { shallow: true });
    }

    useEffect(() => {
        const q = router.query
        if (typeof q.data === 'string' && q.data.length > 0) {
            const res = dataDecompress(q.data)
            if (res !== null) {
                pp.setData(res)
                pp.setSliderValues([res.phrases[0]?.startTime ?? 0, res.phrases[0]?.endTime ?? 5])
                pp.setCurrentPhraseIdxs([0])
                void removeQueryParams()
            }
        }
    }, [])


    // const onLoopCore = () => {
    //     const pp = usePlayerStore.getState()
    //     if (pp.currentPhraseRepeatCount && pp.currentPhraseRepeatCount >= 1) {
    //         console.log(pp.currentPhraseRepeatCount)
    //         pp.decrementRepeatCount()
    //         return
    //     }
    //     if (pp.data.phrases[pp.currentPhraseIdx + 1]) {
    //         pp.setSliderValues([pp.data.phrases[pp.currentPhraseIdx + 1]?.startTime ?? 0, pp.data.phrases[pp.currentPhraseIdx + 1]?.endTime ?? 5])
    //         pp.setCurrentPhraseRepeatCount(pp.data.phrases[pp.currentPhraseIdx + 1]?.repeatCount ?? 3)
    //         pp.setCurrentPhraseIdx((pp.currentPhraseIdx + 1))

    //     } else {
    //         pp.setCurrentPhraseIdx(0)
    //         pp.setSliderValues([pp.data.phrases[0]?.startTime ?? 0, pp.data.phrases[0]?.endTime ?? 5])
    //         pp.setCurrentPhraseRepeatCount(pp.data.phrases[0]?.repeatCount ?? 3)
    //     }
    // }

    // const onLoop = debounce(onLoopCore, 500) // debounce is a hacky way to stop multiple calls
    const { handleResize, ...yt } = useYouTubePlayer('player', null)

    const calculateSliderValues = () => {
        // costing client compute to make ts happy 
        const { currentPhraseIdxs, data } = usePlayerStore.getState();
        if (!Array.isArray(currentPhraseIdxs) || currentPhraseIdxs.length === 0) return;
        if (!Array.isArray(data?.phrases) || data.phrases.length === 0) return;
        const startIdx = currentPhraseIdxs[0];
        const endIdx = currentPhraseIdxs[currentPhraseIdxs.length - 1];
        if (startIdx === undefined || endIdx === undefined) return;
        const startTime = data.phrases[startIdx]?.startTime;
        const endTime = data.phrases[endIdx]?.endTime;
        if (startTime === undefined || endTime === undefined) return;
        return [startTime, endTime];
    };
    const handlePlayPauseClick = () => {
        if (!pp.hasStarted) {
            const sliderValues = calculateSliderValues()
            if (sliderValues) pp.setSliderValues(sliderValues)
            pp.setHasStarted(true)
        }
        yt.voidPlayPause()
    }

    const handleNextClick = () => {
        const pp = usePlayerStore.getState()
        if (pp.currentPhraseIdxs.length !== 1) {
            pp.setCurrentPhraseIdxs([pp.currentPhraseIdxs[0]!])
            handleNextClick()
        }
        const currentPhraseIdx = pp.currentPhraseIdxs[0]
        if (typeof currentPhraseIdx === 'undefined') return
        if (pp.data.phrases[currentPhraseIdx + 1]) {
            pp.setCurrentPhraseIdxs([currentPhraseIdx + 1])
            // this is okay because we use getState in calculateSliderValues
            const sliderValues = calculateSliderValues()
            if (sliderValues) pp.setSliderValues(sliderValues)

        } else {
            pp.setCurrentPhraseIdxs([0])
            pp.setSliderValues([pp.data.phrases[0]?.startTime ?? 0, pp.data.phrases[0]?.endTime ?? 5])
        }
    }

    const handleBackwardClick = () => {
        const pp = usePlayerStore.getState()
        if (pp.currentPhraseIdxs.length !== 1) {
            pp.setCurrentPhraseIdxs([pp.currentPhraseIdxs[pp.currentPhraseIdxs.length - 1]!])
            handleBackwardClick()
        }
        const currentPhraseIdx = pp.currentPhraseIdxs[0]
        if (typeof currentPhraseIdx === 'undefined') return
        if (typeof pp.data.phrases[currentPhraseIdx - 1] !== 'undefined') {
            pp.setCurrentPhraseIdxs([currentPhraseIdx - 1])
            const sliderValues = calculateSliderValues()
            if (sliderValues) pp.setSliderValues(sliderValues)

        } else {
            pp.setCurrentPhraseIdxs([pp.data.phrases.length - 1])
            pp.setSliderValues([pp.data.phrases[pp.data.phrases.length - 1]?.startTime ?? 0, pp.data.phrases[pp.data.phrases.length - 1]?.endTime ?? 5])
        }
    }

    const handlePhraseReset = () => {
        const pp = usePlayerStore.getState()
        const currentPhraseIdx = pp.currentPhraseIdxs[0]
        if (typeof currentPhraseIdx === 'undefined') return
        pp.setCurrentPhraseIdxs([currentPhraseIdx])
        const sliderValues = calculateSliderValues()
        if (sliderValues) pp.setSliderValues(sliderValues)
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
    const mssNums: string[] = React.useMemo(() => {
        const precomputedNums = []
        for (let i = 0; i <= pp.duration; i++) {
            precomputedNums.push(fmtMSS(i))
        }
        return precomputedNums
    }, [pp.duration])

    React.useEffect(() => {
        if (typeof window === 'undefined') return
        window.addEventListener('resize', debounce(handleResize, 500))
    }, [handleResize])


    return (
        <div className="flex flex-col items-center justify-center gap-5 min-h-screen pb-20">
            <Header />

            <div className="relative">

                <YouTube loading="lazy" id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={pp.data.videoId} opts={playerOpts} onReady={yt.onPlayerReady} onStateChange={yt.onStateChange} />
                <button onClick={handlePlayPauseClick} className="absolute top-0 left-0 w-full h-full z-10"></button>
            </div>
            <div className="flex flex-col 2xl:flex-row items-center justify-center w-full sm:w-8/12 lg:w-1/2 relative px-3">
                <PlayerPhraseVisualizer />
            </div>
            <div className="w-11/12 sm:w-8/12 lg:w-1/2 bg-slate-600 p-5 pb-8 mt-3 mb-4 rounded-3xl flex relative ">
                <ReactSlider
                    value={pp.sliderValues}

                    className="horizontal-slider w-full"
                    thumbClassName="bg-white p-1 cursor-pointer relative h-3"
                    // trackClassName classes applied globals.css
                    withTracks={true}
                    renderThumb={(props, state) =>
                        <div {...props}>
                            <div className={state.index ? "absolute p-2 rounded-xl cursor-pointer text-white -bottom-12 -right-5 border-b-2 border-gray-200" : "absolute p-2 rounded-xl cursor-pointer text-white border-gray-200 bottom-5 -right-5 border-t-2"}>
                                <p className="select-none">{mssNums[Math.floor(state.valueNow)] ?? Math.floor(state.valueNow)}</p>
                            </div>
                        </div>
                    }
                    step={.005}
                    min={0}
                    max={pp.duration / 10} //duration is in 10th of a second ReactSlider takes arg in seconds
                    onChange={(values) => pp.setSliderValues(values)}
                    minDistance={.05}
                />
                {pp.isPlaying && (
                    <div
                        className="absolute top-5 border-l-0 border-r-2 z-30 h-3"
                        style={{
                            width: `${((pp.currentTime / (pp.duration * 1.04)) * 1000)}%`,
                            // transition: 'width 0.1s linear', // Smooth animation
                        }}
                    ></div>
                )}

            </div>

            <div className="flex flex-col gap-5 items-center justify-center md:grid md:grid-cols-3 md:justify-items-between w-11/12 sm:w-8/12 lg:w-1/2 bg-slate-800 m-0 p-3 rounded-xl">
                <div>
                    <SpeedDropDown speed={pp.speed} setSpeed={pp.setSpeed} voidChangeSpeed={yt.voidChangeSpeed} />
                </div>
                <div className="flex flex-col xs:flex-row gap-2 w-full justify-center items-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBackwardClick}>
                        <BackwardIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer select-none" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePlayPauseClick}>
                        <PlayPauseIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer select-none" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNextClick}>
                        <ForwardIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer select-none" />
                    </motion.button>
                </div>
                <div className="md:w-auto flex flex-col xs:flex-row justify-end items-end">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePhraseReset}>
                        <ArrowPathIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer select-none" />
                    </motion.button>
                    <RestTimeDropDown restTime={pp.restTime} setRestTime={pp.setRestTime} />
                </div>
            </div>
            <div className="block 2xl:fixed 2xl:left-0 top-1 ">
                <Instructions />
            </div>
        </div>
    )
}