import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { extractVideoId, fmtMSS } from "packages/helpers";
import YouTube, { YouTubeProps, YouTubePlayer, YouTubeEvent } from 'react-youtube'
import ReactSlider from "react-slider";
export default function Home() {
  const [sliderValues, setSliderValues] = React.useState([0, 100])
  const playerRef = React.useRef<YouTube | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [intervalId, setIntervalId] = React.useState(null);
  const [videoId, setVideoId] = React.useState("p7BmgJSKzu4")
  const [userUrl, setUserUrl] = React.useState("https://youtube.com/watch?v=p7BmgJSKzu4")
  const [duration, setDuration] = React.useState(0)

  const mssNums: string[] = React.useMemo(() => {
    const precomputedNums = []
    for (let i = 0; i <= duration; i++) {
      precomputedNums.push(fmtMSS(i))
    }
    return precomputedNums
  }, [duration])

  const seekToTime = (timeInSeconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds, true);  // 'true' for precise seeking
    }
  };

  const snapToLoop = () => {
    if (!sliderValues) return
    if (currentTime < sliderValues[0]!) {
      seekToTime(sliderValues[0]!)
    }
    if (currentTime > sliderValues[1]!) {
      seekToTime(sliderValues[0]!)
    }
  }

  React.useMemo(() => {
    snapToLoop()
  }, [currentTime])

  const playerOpts = React.useState({
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  })


  const onPlayerReady: YouTubeProps['onReady'] = (event: { target: YouTubePlayer }) => {
    // access to player in all event handlers via event.target
    playerRef.current = event.target
    console.log(playerRef.current)
    setDuration(playerRef.current.getDuration())
  }

  const onStateChange = (e: YouTubeEvent) => {
    const playerState = e.data;
    if (playerState === 1) {
      // Video is playing, start polling current time
      const id = setInterval(() => {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time); // Update the state
      }, 200); // Update every second
      setIntervalId(id);
    } else {
      clearInterval(intervalId)
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
    <div className="bg-slate-700 h-screen">
      <AuthShowcase />
      <div className="flex flex-col gap-10 items-center pt-5">
        <div className="bg-gray-200 p-5 rounded-lg w-1/3">
          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
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
          <YouTube className="bg-black p-3 rounded-xl" videoId={videoId} opts={playerOpts[0]} onReady={onPlayerReady} onStateChange={onStateChange} />
          <div className="w-full flex justify-center items-center">
            <div className="w-6/12 bg-slate-600 p-5 pb-8 rounded-3xl">
              <ReactSlider
                value={sliderValues}
                onAfterChange={(newSliderValues) => {
                  setSliderValues(newSliderValues)
                  snapToLoop()
                }}
                className="horizontal-slider w-full"
                thumbClassName="bg-gray-200 p-1 cursor-pointer relative h-3"
                trackClassName="border-2 border-purple-500 bg-purple-400 h-3 border-black border-4"
                withTracks={true}
                renderThumb={(props, state) =>
                  <div {...props}>
                    <div className={state.index ? `${thumbClasses + "-bottom-12 -right-5"}` : `${thumbClasses + "bottom-5 -right-5"}`}>
                      <p>{mssNums[state.valueNow] ?? state.valueNow}</p>
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
