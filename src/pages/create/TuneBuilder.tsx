
import React, { useCallback } from "react";
import { extractVideoId, fmtMSS } from "packages/looper/helpers";
import YouTube from 'react-youtube'
import ReactSlider from "react-slider";
import debounce from 'lodash.debounce'
import SpeedDropDown from "packages/builder/components/SpeedDropDown";
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, PlayPauseIcon } from "@heroicons/react/16/solid";
import { useLooperStore } from "packages/looper/store";
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer";
import { useTuneBuilderStore } from "packages/builder/store";
import RepeatDropDown from "packages/builder/components/RepeatDropDown";
import { PhraseVisualizer } from "packages/builder/components/PhraseVisualizer";
import clsx from "clsx";
import Link from "next/link";
export default function CreateTune() {

    const { sliderValues, setSliderValues, trackMin, setTrackMin, trackMax, setTrackMax, userUrl, setUserUrl, videoId, setVideoId, currentTime, setCurrentTime, duration, setDuration, speed, setSpeed, isZoomed, setIsZoomed } = useLooperStore();
    const yt = useYouTubePlayer('creator', null)

    const builder = useTuneBuilderStore()
    const { phrases } = builder
    const { createPhrase } = builder


    const playerOpts = React.useState({
        height: yt.initialBuilderSizes[1],
        width: yt.initialBuilderSizes[0],
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

    const zoomTrack = (start: number, end: number) => {
        const diff = end - start
        const extra = diff * 0.2
        let min = start - extra
        min = min < 0 ? 0 : min
        let max = end + extra
        max = max > duration ? duration : max
        setTrackMin(min)
        setTrackMax(max)
    }

    const unZoomTrack = () => {
        setTrackMax(duration / 10)
        setTrackMin(0)
    }

    const debouncedHandleResize = debounce(yt.handleBuilderResize, 500)

    if (typeof window !== "undefined") {
        window.addEventListener("resize", debouncedHandleResize)
    }


    const handleUrlChange = () => {
        if (userUrl.length < 24) return
        const id = extractVideoId(userUrl)
        if (id) {
            setVideoId(id)
        }
    }


    const [validUrl, setValidUrl] = React.useState<boolean | null>(null)
    const submitUrl = () => {
        const id = extractVideoId(userUrl)
        if (id) {
            setVideoId(id)
            builder.videoId = id
            setValidUrl(true)
        } else {
            setValidUrl(false)
        }
    }


    const updatePhrases = useCallback((sliderValues: number[] = [0, duration]) => {
        if (!phrases[builder.selectedPhraseIdx]) return
        const newPhrases = [...phrases]
        newPhrases[builder.selectedPhraseIdx]!.startTime = sliderValues[0]!
        newPhrases[builder.selectedPhraseIdx]!.endTime = sliderValues[1]!
        builder.setPhrases(newPhrases)
    }, [builder, duration, phrases])



    // loop will often overun its bounds
    return (
        <>
            {!builder.videoId ? (
                <div className="h-screen flex justify-center items-center bg-slate-700">
                    <div className="fixed top-2 right-2">
                        <Link href="/play"
                            className="bg-slate-900 text-white p-3 rounded-2xl">Go to Player</Link>
                    </div>
                    <div className="bg-purple-400 border-slate-900 border-2 p-5 rounded-lg w-11/12 sm:w-1/2 md:w-1/2 flex flex-col items-center">
                        <label htmlFor="link" className="block text-sm/6 font-medium text-gray-900 ">
                            First Enter a Youtube Link
                        </label>
                        <div className="mt-2 w-full lg:w-2/3">
                            <input
                                id="link"
                                name="link"
                                type="link"
                                value={userUrl}
                                onChange={(e) => {
                                    setUserUrl(e.target.value)
                                    debounce(handleUrlChange, 500)
                                }}
                                className={`text-center block w-full rounded-md bg-slate-200 px-3 py-1.5 font-semibold text-gray-900 outline outline-1 -outline-offset-1 outline-slate-400 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 lg:text-base ${validUrl === false && "text-red-500"}`}
                            />
                        </div>
                        <p className="p-3 text-xs text-red-500">{validUrl === false && "Please enter a valid url"}</p>
                        <a className="cursor-pointer self-end bg-slate-900 text-white p-3 rounded-2xl" onClick={() => submitUrl()}>Next</a>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-700 flex flex-col justify-center pt-0 pb-0 min-h-screen">
                    <div className="fixed top-2 right-2">
                        <Link href="/play"
                            className="bg-slate-900 text-white p-3 rounded-2xl">Go to Player</Link>
                    </div>
                    <div className="flex flex-col gap-5 fixed h-screen">

                        <p>{sliderValues[0]}</p>
                        <p>{sliderValues[1]}</p>
                        <textarea className="text-white text-xs bg-slate-800 p-2 rounded-lg h-1/3" value={JSON.stringify(builder, null, 2)}>
                        </textarea>
                    </div>

                    <div className="flex flex-col gap-5 items-center justify-center pt-0 m-0 w-full">
                        <div className="w-full flex flex-col items-center gap-5">
                            <PhraseVisualizer />
                            <YouTube id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={videoId} opts={playerOpts[0]} onReady={yt.onPlayerReady} onStateChange={yt.onStateChange} />
                            <div className="flex flex-col justify-center items-center gap-10 w-full sm:w-2/3 md:w-7/12 bg-slate-800 border-slate-900 border-2 p-8 rounded-3xl">
                                <div className="w-full bg-slate-600 p-5 pb-8 rounded-3xl flex">
                                    <ReactSlider
                                        value={sliderValues}
                                        onAfterChange={(newSliderValues) => {
                                            updatePhrases(newSliderValues)
                                            setSliderValues(newSliderValues)
                                            // voidSnapToLoop()
                                        }}
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
                                        min={trackMin}
                                        max={trackMax} //duration is in 10th of a second ReactSlider takes arg in seconds
                                        minDistance={.05}
                                    />
                                </div>

                                <div className="flex justify-between w-full">
                                    <a className={clsx(
                                        'bg-slate-900 text-white p-3 rounded-2xl cursor-pointer',
                                        { 'border-4 border-green-500': builder.phrases.length === 0 }
                                    )} onClick={() => {
                                        const start = phrases[phrases.length - 1]?.endTime ?? 0
                                        const repeatCount = phrases[phrases.length - 1]?.repeatCount ?? 3
                                        setSliderValues([start, start + 5])
                                        createPhrase(speed, repeatCount)

                                    }}><p>Create New</p></a>
                                    <RepeatDropDown />
                                    <SpeedDropDown speed={speed} setSpeed={setSpeed} voidChangeSpeed={yt.voidChangeSpeed} />
                                    <PlayPauseIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer" onClick={() => yt.voidPlayPause()} />
                                    {isZoomed ?
                                        <MagnifyingGlassMinusIcon className="w-10 h-10 bg-slate-900 rounded-xl text-white cursor-pointer" onClick={() => {
                                            setIsZoomed(false)
                                            unZoomTrack()
                                        }} /> :
                                        <MagnifyingGlassPlusIcon className="w-10 h-10 bg-slate-900 rounded-xl text-white cursor-pointer" onClick={() => {

                                            setIsZoomed(true)
                                            zoomTrack(sliderValues[0]!, sliderValues[1]!)
                                        }} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
}