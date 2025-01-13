import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { extractVideoId, fmtMSS } from "packages/helpers";
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'
import type { YouTubePlayer } from 'youtube-player/dist/types'
import ReactSlider from "react-slider";
import debounce from 'lodash.debounce'
export default function Home() {
  const [sliderValues, setSliderValues] = React.useState([0, 100])
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const playerRef = React.useRef<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [videoId, setVideoId] = React.useState("p7BmgJSKzu4")
  const [userUrl, setUserUrl] = React.useState("https://youtube.com/watch?v=p7BmgJSKzu4")
  const [duration, setDuration] = React.useState(0)
  const pollingRef = React.useRef<NodeJS.Timeout | null>(null)
  const mssNums: string[] = React.useMemo(() => {
    const precomputedNums = []
    for (let i = 0; i <= duration; i++) {
      precomputedNums.push(fmtMSS(i))
    }
    return precomputedNums
  }, [duration])

  const seekToTime = async (timeInSeconds: number) => {
    if (playerRef.current) {
      await playerRef.current.seekTo(timeInSeconds, true);
    }
  };

  const snapToLoop = async () => {
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
  }

  const voidSnapToLoop = () => {
    void snapToLoop()
  }
  React.useMemo(() => {
    voidSnapToLoop()
  }, [currentTime, snapToLoop])



  const setSize = async (width: number, height: number) => {
    if (playerRef.current) {
      await playerRef.current.setSize(width, height)
    }
  }
  const voidSetSize = (width: number, height: number) => {
    void setSize(width, height)
  }

  const handleResize = () => {
    console.log('...resizing')
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
  }

  const debouncedHandleResize = debounce(handleResize, 500)

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", debouncedHandleResize)
  })


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
    try {
      const newDuration = await playerRef.current.getDuration()
      setDuration(newDuration)
    } catch (error) {
      console.error("Failed to fetch duration:", error);
    }
  };

  const updateTime = async () => {
    if (!playerRef.current) return
    try {
      const time = await playerRef.current.getCurrentTime();
      setCurrentTime(time)
    } catch (error) {
      console.error("Failed to fetch duration:", error);
    }

  }

  const onPlayerReady: YouTubeProps['onReady'] = (event: { target: YouTubePlayer }) => {
    // access to player in all event handlers via event.target
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    playerRef.current = event.target
    console.log(playerRef.current)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const duration = playerRef.current.getDuration()
    void updateDuration()
  }

  const onStateChange = (e: YouTubeEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const playerState = e.data;
    if (playerState === 1) {
      // Video is playing, start polling current time

      pollingRef.current = setInterval(() => {
        void updateTime()
        // Update the state
      }, 200); // Update every second

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

  const thumbClasses = "absolute p-2 rounded-xl cursor-pointer text-white "

  return (
    <div className="bg-slate-700 flex flex-col justify-center pt-10 pb-40">
      {/* <AuthShowcase /> */}
      <div className="flex flex-col gap-10 items-center pt-5">
        <div className="bg-gray-200 p-5 rounded-lg w-11/12 sm:w-1/2 md:w-1/3">
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

        <div className="w-full flex flex-col items-center gap-10">
          <YouTube className="select-none bg-gray-600 p-4 rounded-xl" videoId={videoId} opts={playerOpts[0]} onReady={onPlayerReady} onStateChange={onStateChange} />
          <div className="w-full flex justify-center items-center">
            <div className="w-11/12 sm:w-2/3 md:w-1/2 bg-slate-600 p-5 pb-8 rounded-3xl">
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
                      <p className="select-none">{mssNums[state.valueNow] ?? state.valueNow}</p>
                    </div>
                  </div>
                }
                step={1}
                max={duration ?? 100}
                minDistance={1}
              />
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
    undefined, // no input
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
