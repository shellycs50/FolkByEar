import React, { useEffect } from "react";
import { extractVideoId, fmtMSS } from "packages/looper/helpers";
import YouTube from 'react-youtube'
import ReactSlider from "react-slider";
import debounce from 'lodash.debounce'
import SpeedDropDown from "packages/builder/components/SpeedDropDown";
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, PlayPauseIcon } from "@heroicons/react/16/solid";
import { useLooperStore } from "packages/looper/store";
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer";
export default function Looper() {

  const { sliderValues, setSliderValues, trackMin, setTrackMin, trackMax, setTrackMax, userUrl, setUserUrl, videoId, setVideoId, currentTime, duration, speed, setSpeed, isZoomed, setIsZoomed } = useLooperStore();
  const { voidPlayPause, onStateChange, initialSizes, handleResize, onPlayerReady, voidChangeSpeed, voidSnapToLoop } = useYouTubePlayer()
  const playerOpts = React.useState({
    height: initialSizes[1],
    width: initialSizes[0],
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

  const debouncedHandleResize = debounce(handleResize, 500)

  useEffect(() => {
    voidSnapToLoop()
  }, [currentTime, voidSnapToLoop])

  useEffect(() => {
    voidChangeSpeed(speed)
  }, [speed, voidChangeSpeed])

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize)
  }, [debouncedHandleResize, handleResize])

  useEffect(() => {
    if (userUrl.length < 24) return
    const id = extractVideoId(userUrl)
    if (id) {
      setVideoId(id)
    }
  }, [setVideoId, userUrl])

  const loopStore = useLooperStore()
  return (
    <div className="bg-slate-700 flex flex-col justify-center pt-0 pb-0 min-h-screen">
      {/* <AuthShowcase /> */}
      <div className="flex flex-col gap-5 items-center justify-center pt-0 m-0 w-full">
        <div className="bg-purple-400 border-slate-900 border-2 p-5 rounded-lg w-11/12 sm:w-1/2 md:w-1/2 flex flex-col items-center">
          <label htmlFor="link" className="block text-sm/6 font-medium text-gray-900 ">
            Enter Your Youtube Link Here
          </label>
          <div className="mt-2 w-full lg:w-2/3">
            <input
              id="link"
              name="link"
              type="link"
              value={userUrl}
              onChange={(e) => setUserUrl(e.target.value)}
              className="text-center block w-full rounded-md bg-slate-200 px-3 py-1.5 font-semibold text-gray-900 outline outline-1 -outline-offset-1 outline-slate-400 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 lg:text-base"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-5">
          <YouTube id="yt" className=" bg-gray-600 p-4 rounded-xl" videoId={videoId} opts={playerOpts[0]} onReady={onPlayerReady} onStateChange={onStateChange} />
          <div className="flex flex-col justify-center items-center gap-10 w-full sm:w-2/3 md:w-7/12 bg-slate-800 border-slate-900 border-2 p-8 rounded-3xl">
            <div className="w-full bg-slate-600 p-5 pb-8 rounded-3xl flex">

              <ReactSlider
                value={sliderValues}
                onAfterChange={(newSliderValues) => {
                  setSliderValues(newSliderValues)
                  voidSnapToLoop()
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
                step={.01}
                min={trackMin}
                max={trackMax} //duration is in 10th of a second ReactSlider takes arg in seconds
                minDistance={.05}
              />
            </div>
            <div className="flex justify-between w-full">
              <SpeedDropDown speed={speed} setSpeed={setSpeed} />
              <PlayPauseIcon className="w-12 h-12 p-1 bg-slate-900 rounded-xl text-white cursor-pointer" onClick={() => voidPlayPause()} />
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
  );
}