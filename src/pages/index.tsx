import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { extractVideoId, fmtMSS } from "packages/helpers";
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'
import type { YouTubePlayer } from 'youtube-player/dist/types'
import ReactSlider from "react-slider";
import debounce from 'lodash.debounce'
import SpeedDropDown from "~/components/SpeedDropDown";
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, PlayPauseIcon } from "@heroicons/react/16/solid";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";

export default function Home() {
  const [sliderValues, setSliderValues] = React.useState([26.67, 29.39])
  const playerRef = React.useRef<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [videoId, setVideoId] = React.useState("D6FdFNuWmVY")
  const [userUrl, setUserUrl] = React.useState("https://www.youtube.com/watch?v=D6FdFNuWmVY")
  const [duration, setDuration] = React.useState(0)
  const [speed, setSpeed] = React.useState(1)
  const [trackMin, setTrackMin] = React.useState(0)
  const [trackMax, setTrackMax] = React.useState(duration / 10)
  const [isZoomed, setIsZoomed] = React.useState(false)

  const pollingRef = React.useRef<NodeJS.Timeout | null>(null)
  const mssNums: string[] = React.useMemo(() => {
    const precomputedNums = []
    for (let i = 0; i <= duration; i++) {
      precomputedNums.push(fmtMSS(i))
    }
    return precomputedNums
  }, [duration])

  const seekToTime = React.useCallback(async (timeInSeconds: number) => {
    if (playerRef.current) {
      await playerRef.current.seekTo(timeInSeconds, true);
    }
  }, []);

  const snapToLoop = React.useCallback(async () => {
    if (!sliderValues) return
    try {
      if (currentTime < sliderValues[0]!) {
        await seekToTime(sliderValues[0]!)
      }
      if (currentTime > sliderValues[1]!) {
        await seekToTime(sliderValues[0]!)
      }
    } catch (err) {
      console.error(err)
    }
  }, [sliderValues, currentTime, seekToTime])

  const voidSnapToLoop = React.useCallback(() => {
    void snapToLoop()
  }, [snapToLoop])

  React.useMemo(() => {
    voidSnapToLoop()
  }, [currentTime, voidSnapToLoop])

  const changeSpeed = React.useCallback(async (speed: number) => {
    if (playerRef.current) {
      await playerRef.current.setPlaybackRate(speed)
    }
  }, [])

  const voidChangeSpeed = React.useCallback((speed: number) => {
    void changeSpeed(speed)
  }, [changeSpeed])

  React.useMemo(() => {
    voidChangeSpeed(speed)
  }, [speed, voidChangeSpeed])


  const setSize = async (width: number, height: number) => {
    if (playerRef.current) {
      await playerRef.current.setSize(width, height)
    }
  }


  const handleResize = React.useCallback(() => {
    if (!window) return
    const voidSetSize = (width: number, height: number) => {
      void setSize(width, height)
    }
    const width = window.innerWidth
    let playerWidth = width / 1.5

    switch (true) {
      case width > 1280:
        playerWidth = width / 2
        break
      case width > 768:
        playerWidth = width / 1.5
        break
      default:
        playerWidth = width - 40
        break
    }
    playerWidth = playerWidth
    const playerHeight = playerWidth * (9 / 16)
    if (playerRef.current) {
      voidSetSize(playerWidth - 16, playerHeight - 16)
    }
  }, [])

  const debouncedHandleResize = debounce(handleResize, 500)

  useEffect(() => {
    setTimeout(() => {
      handleResize()
    }, 1500) // hack
    window.addEventListener("resize", debouncedHandleResize)
  }, [debouncedHandleResize, handleResize])


  const playerOpts = React.useState({
    height: 390,
    width: 560,
    // playerVars: {
    //   // https://developers.google.com/youtube/player_parameters
    //   autoplay: 1,
    // },
  })

  const updateDuration = async () => {
    if (!playerRef.current) return
    const newDuration = await playerRef.current.getDuration()
    setDuration(newDuration * 10)
    setTrackMax(newDuration)
  }

  const updateTime = async () => {
    if (!playerRef.current) return
    const time = await playerRef.current.getCurrentTime();
    setCurrentTime(time)
  }

  const onPlayerReady: YouTubeProps['onReady'] = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target
    void updateDuration()
    handleResize()
  }

  const onStateChange = (e: YouTubeEvent<number>) => {
    const playerState: number = e.data;
    if (playerState === 1) {
      pollingRef.current = setInterval(() => {
        void updateTime()
      }, 50);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  };

  React.useMemo(() => {
    if (userUrl.length < 24) return
    const id = extractVideoId(userUrl)
    if (id) {
      setVideoId(id)
    }
  }, [userUrl])

  const zoomTrack = (start: number, end: number) => {
    setTrackMin(start)
    setTrackMax(end)
  }

  const unZoomTrack = () => {
    setTrackMax(duration / 10)
    setTrackMin(0)
  }

  const playPause = async () => {
    if (!playerRef.current) return
    const playerState = await playerRef.current.getPlayerState()
    const playing: PlayerStates = 1
    if (playerState === playing) {
      await playerRef.current.pauseVideo()
    } else {
      await playerRef.current.playVideo()
    }
  }

  const voidPlayPause = () => {
    void playPause()
  }

  const thumbClasses = "absolute p-2 rounded-xl cursor-pointer text-white "

  return (
    <div className="bg-slate-700 flex flex-col justify-center pt-10 pb-60 min-h-screen">
      {/* <AuthShowcase /> */}
      <div className="flex flex-col gap-10 items-center pt-5">
        <div className="bg-purple-500 p-5 rounded-lg w-11/12 sm:w-1/2 md:w-1/3">
          <label htmlFor="link" className="block text-sm/6 font-medium text-gray-900">
            Enter Your Youtube Link
          </label>
          <div className="mt-2">
            <input
              id="link"
              name="link"
              type="link"
              value={userUrl}
              onChange={(e) => setUserUrl(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-5">
          <YouTube className="select-none bg-gray-600 p-4 rounded-xl" videoId={videoId} opts={playerOpts[0]} onReady={onPlayerReady} onStateChange={onStateChange} />
          <div className="flex flex-col justify-center items-center gap-10 w-11/12 sm:w-2/3 md:w-1/2 bg-gray-800 p-8 rounded-3xl">

            <div className="w-full bg-slate-600 p-5 pb-8 rounded-3xl flex">
              <ReactSlider
                value={sliderValues}
                onAfterChange={(newSliderValues) => {
                  setSliderValues(newSliderValues)
                  void snapToLoop()
                }}
                className="horizontal-slider w-full"
                thumbClassName="bg-gray-200 p-1 cursor-pointer relative h-3"
                trackClassName="border-2 border-purple-500 bg-purple-400 h-3 border-black border-4"
                withTracks={true}
                renderThumb={(props, state) =>
                  <div {...props}>
                    <div className={state.index ? `${thumbClasses + "-bottom-12 -right-5"}` : `${thumbClasses + "bottom-5 -right-5"}`}>
                      <p className="select-none">{mssNums[Math.floor(state.valueNow)] ?? Math.floor(state.valueNow)}</p>
                    </div>
                  </div>
                }
                step={.01}
                min={trackMin}
                max={trackMax} //duration is in 10th of a second ReactSlider takes arg in seconds
                minDistance={.01}
              />
            </div>
            <div className="flex justify-between w-full">
              <SpeedDropDown speed={speed} setSpeed={setSpeed} />
              <PlayPauseIcon className="w-10 h-10 text-white cursor-pointer" onClick={() => voidPlayPause()} />
              {isZoomed ?
                <MagnifyingGlassMinusIcon className="w-10 h-10 text-white cursor-pointer" onClick={() => {
                  setIsZoomed(false)
                  unZoomTrack()
                }} /> :
                <MagnifyingGlassPlusIcon className="w-10 h-10 text-white cursor-pointer" onClick={() => {

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

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center bg-purple-500 py-5">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
