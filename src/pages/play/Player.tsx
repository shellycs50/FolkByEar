import YouTube from "react-youtube"
import { useYouTubePlayer, YTPlayerNoResize } from "packages/looper/useYoutubePlayer"
import React, { useEffect } from "react"
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon"
import { ForwardIcon } from "@heroicons/react/16/solid"
import { BackwardIcon } from "@heroicons/react/16/solid"
// import { ArrowPathIcon } from "@heroicons/react/16/solid"
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid"
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
import Header from "packages/header/Header"


export default function Player() {
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

    const sliderValues = usePlayerStore((state) => state.sliderValues);
    const setSliderValues = usePlayerStore((state) => state.setSliderValues);

    const currentTime = usePlayerStore((state) => state.currentTime);
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);

    const duration = usePlayerStore((state) => state.duration);
    const setDuration = usePlayerStore((state) => state.setDuration);

    const speed = usePlayerStore((state) => state.speed);
    const setSpeed = usePlayerStore((state) => state.setSpeed);

    const hasStarted = usePlayerStore((state) => state.hasStarted);
    const setHasStarted = usePlayerStore((state) => state.setHasStarted);

    const currentPhraseIdxs = usePlayerStore((state) => state.currentPhraseIdxs);
    const setCurrentPhraseIdxs = usePlayerStore((state) => state.setCurrentPhraseIdxs);
    // const togglePhraseIdx = usePlayerStore((state) => state.togglePhraseIdx);

    const data = usePlayerStore((state) => state.data);
    const setData = usePlayerStore((state) => state.setData);

    const restTime = usePlayerStore((state) => state.restTime);
    const setRestTime = usePlayerStore((state) => state.setRestTime);

    // const showGuide = usePlayerStore((state) => state.showGuide);
    // const setShowGuide = usePlayerStore((state) => state.setShowGuide);

    // const playerReady = usePlayerStore((state) => state.playerReady);
    const setPlayerReady = usePlayerStore((state) => state.setPlayerReady);

    const getLatestPlayerState = usePlayerStore.getState;


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
                setData(res)
                setSliderValues([res.phrases[0]?.startTime ?? 0, res.phrases[0]?.endTime ?? 5])
                setCurrentPhraseIdxs([0])
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

    const { handleResize, ...yt } = useYouTubePlayer({
        setCurrentTime,
        setTrackMax: undefined,
        setDuration,
        setSpeed,
        getLatestState: usePlayerStore.getState,
        getRestTime: undefined,
        setIsPlaying,
        setPlayerReady,
        onLoop: undefined
    })

    const calculateSliderValues = () => {
        // costing client compute to make ts happy 
        const { currentPhraseIdxs, data } = getLatestPlayerState();
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
        if (!hasStarted) {
            const sliderValues = calculateSliderValues()
            if (sliderValues) setSliderValues(sliderValues)
            setHasStarted(true)
        }
        yt.voidPlayPause()
    }

    const handleNextClick = () => {
        const latest = getLatestPlayerState()
        if (latest.linkMode) {
            const staticCurrentTime = currentTime
            const current = data.phrases.find((phrase) => {
                if (phrase.startTime <= staticCurrentTime && phrase.endTime >= staticCurrentTime) {
                    const [startlog, endlog] = [phrase.startTime, phrase.endTime]
                    console.log({ startlog, endlog, staticCurrentTime })
                    return true
                }
            })
            if (current) {
                const nextIdx = latest.currentPhraseIdxs.find((idx) => idx === current.idx + 1)
                console.log(nextIdx, current.idx)
                if (typeof nextIdx === 'undefined') {
                    const startIdx = latest.currentPhraseIdxs[0]!
                    const startTime = latest.data.phrases[startIdx]!.startTime
                    yt.voidSeekToTime(startTime)
                    return
                }
                const next = data.phrases[nextIdx]
                if (typeof next === 'undefined') {
                    yt.voidSeekToTime(data.phrases[0]!.startTime)
                    return
                }
                yt.voidSeekToTime(next.startTime)
                return
            }
        }
        const currentPhraseIdx = latest.currentPhraseIdxs[0]
        if (typeof currentPhraseIdx === 'undefined') return
        if (latest.data.phrases[currentPhraseIdx + 1]) {
            setCurrentPhraseIdxs([currentPhraseIdx + 1])
            // this is okay because we use getState in calculateSliderValues
            const sliderValues = calculateSliderValues()
            if (sliderValues) setSliderValues(sliderValues)

        } else {
            setCurrentPhraseIdxs([0])
            setSliderValues([latest.data.phrases[0]?.startTime ?? 0, latest.data.phrases[0]?.endTime ?? 5])
        }
    }

    const handleBackwardClick = () => {
        const latest = getLatestPlayerState()
        if (latest.linkMode) {
            const staticCurrentTime = currentTime
            const current = data.phrases.find((phrase, idx) => {
                if (phrase.startTime <= staticCurrentTime && phrase.endTime >= staticCurrentTime) {
                    const [startlog, endlog] = [phrase.startTime, phrase.endTime]
                    console.log({ startlog, endlog, staticCurrentTime })
                    return true
                }
            })
            if (current) {
                console.log(current)
                yt.voidSeekToTime(current.startTime)
            }

            return
        }
        const currentPhraseIdx = latest.currentPhraseIdxs[0]
        if (typeof currentPhraseIdx === 'undefined') return
        if (typeof latest.data.phrases[currentPhraseIdx - 1] !== 'undefined') {
            setCurrentPhraseIdxs([currentPhraseIdx - 1])
            const sliderValues = calculateSliderValues()
            if (sliderValues) setSliderValues(sliderValues)

        } else {
            setCurrentPhraseIdxs([latest.data.phrases.length - 1])
            setSliderValues([latest.data.phrases[latest.data.phrases.length - 1]?.startTime ?? 0, latest.data.phrases[latest.data.phrases.length - 1]?.endTime ?? 5])
        }
    }

    const handleUTurnClick = () => {
        const latest = getLatestPlayerState()
        const currentPhraseIdx = latest.currentPhraseIdxs[0]
        if (typeof currentPhraseIdx === 'undefined') return
        const time = data.phrases[currentPhraseIdx]?.startTime
        if (typeof time === 'undefined') return
        yt.voidSeekToTime(time)

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
        for (let i = 0; i <= duration; i++) {
            precomputedNums.push(fmtMSS(i))
        }
        return precomputedNums
    }, [duration])

    React.useEffect(() => {
        if (typeof window === 'undefined') return
        window.addEventListener('resize', debounce(handleResize, 500))
    }, [handleResize])


    return (
        <div className="flex flex-col items-center justify-center gap-5 min-h-screen pb-20">
            <Header />

            <div className="relative">

                <YouTube loading="lazy" id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={data.videoId} opts={playerOpts} onReady={yt.onPlayerReady} onStateChange={yt.onStateChange} />
                <button onClick={handlePlayPauseClick} className="absolute top-0 left-0 w-full h-full z-10"></button>
            </div>
            <div className="flex flex-col 2xl:flex-row items-center justify-center w-full sm:w-8/12 lg:w-1/2 relative px-3">
                <PlayerPhraseVisualizer yt={yt} />
            </div>
            <div className="w-11/12 sm:w-8/12 lg:w-1/2 bg-slate-600 p-5 pb-8 mt-3 mb-4 rounded-3xl flex relative ">
                <ReactSlider
                    value={sliderValues}

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
                    max={duration / 10} //duration is in 10th of a second ReactSlider takes arg in seconds
                    onChange={(values) => setSliderValues(values)}
                    minDistance={.05}
                />
                {isPlaying && (
                    <div
                        className="absolute top-5 border-l-0 border-r-2 z-30 h-3"
                        style={{
                            width: `${((currentTime / (duration * 1.04)) * 1000)}%`,
                        }}
                    ></div>
                )}

            </div>

            <div className="flex flex-col gap-5 items-center justify-center md:grid md:grid-cols-3 md:justify-items-between w-11/12 sm:w-8/12 lg:w-1/2 bg-slate-800 m-0 p-3 rounded-xl">
                <div>
                    <SpeedDropDown speed={speed} setSpeed={setSpeed} voidChangeSpeed={yt.voidChangeSpeed} />
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
                        onClick={handleUTurnClick}>
                        <ArrowUturnLeftIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer select-none" />
                    </motion.button>
                    <RestTimeDropDown restTime={restTime} setRestTime={setRestTime} />
                </div>
            </div>
            <div className="block 2xl:fixed 2xl:left-0 top-1 ">
                <Instructions />
            </div>
        </div>
    )
}