import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import { extractVideoId } from "packages/helpers";
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube'

export default function Home() {


  const playerRef = React.useRef<YouTube | null>(null);

  const seekToTime = (timeInSeconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds, true);  // 'true' for precise seeking
    }
  };
  const onPlayerReady: YouTubeProps['onReady'] = (event: { target: YouTubePlayer }) => {
    // access to player in all event handlers via event.target
    playerRef.current = event.target
  }

  const [videoId, setVideoId] = React.useState("p7BmgJSKzu4")
  const [userUrl, setUserUrl] = React.useState("https://youtube.com/watch?v=p7BmgJSKzu4")

  React.useMemo(() => {
    if (userUrl.length < 24) return
    const id = extractVideoId(userUrl)
    if (id) {
      setVideoId(id)
    }
  }, [userUrl])

  const playerOpts = React.useState({
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  })





  return (
    <div>
      <AuthShowcase />
      <div className="flex flex-col gap-10 items-center">
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

        <YouTube videoId={videoId} opts={playerOpts} onReady={onPlayerReady} />

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
