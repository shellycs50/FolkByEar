import { useRef, useCallback, useMemo } from "react";
import { type YouTubeEvent, type YouTubeProps } from "react-youtube";
import type { YouTubePlayer } from 'youtube-player/dist/types'
import type PlayerStates from "youtube-player/dist/constants/PlayerStates";

interface LooperDependencies {
    sliderValues: number[]
    setTrackMax?: (value: number) => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setSpeed: (speed: number) => void;
}


export const useYouTubePlayer = (stateDeps: LooperDependencies) => {
    const {
        sliderValues,
        setTrackMax,
        currentTime,
        setCurrentTime,
        setDuration,
        setSpeed
    } = stateDeps
    // [start, end] : times for loop
    // setTrackMax, setDuration : optional setter for UI and duration (maybe dont need to be separate)
    // [currentTime, setCurrentTime] : state representing current playback time 
    // setSpeed (passing allows reset of speed on video change)

    const playerRef = useRef<YouTubePlayer | null>(null);
    const pollingRef = useRef<number | null>(null)

    const seekToTime = useCallback(async (timeInSeconds: number) => {
        if (playerRef.current) {
            await playerRef.current.seekTo(timeInSeconds, true);
        }
    }, []);

    const snapToLoop = useCallback(async () => {

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

    const voidSnapToLoop = useCallback(() => {
        void snapToLoop()
    }, [snapToLoop])


    const changeSpeed = useCallback(async (speed: number) => {
        if (playerRef.current) {
            await playerRef.current.setPlaybackRate(speed)
        }
    }, [])

    const voidChangeSpeed = useCallback((speed: number) => {
        void changeSpeed(speed)
    }, [changeSpeed])

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

    const onStateChange = (e: YouTubeEvent<number>) => {
        const playerState: number = e.data;

        const poll = () => {
            void updateTime();
            pollingRef.current = requestAnimationFrame(poll);
        };

        if (playerState === 1) {
            if (!pollingRef.current) {
                pollingRef.current = requestAnimationFrame(poll);
            }
        } else {
            if (pollingRef.current) {
                cancelAnimationFrame(pollingRef.current);
                pollingRef.current = null;
            }
        }
    };

    // using setInterval rather than requestAnimationFrame

    // const onStateChange = (e: YouTubeEvent<number>) => {
    //   const playerState: number = e.data;
    //   if (playerState === 1) {
    //     pollingRef.current = setInterval(() => {
    //       void updateTime()
    //     }, 10);
    //   } else {
    //     if (pollingRef.current) {
    //       clearInterval(pollingRef.current)
    //     }
    //   }
    // };

    const updateTime = async () => {
        console.log('man is updating')
        if (!playerRef.current) return
        const time = await playerRef.current.getCurrentTime();
        setCurrentTime(time)
    }

    const updateDuration = async () => {
        if (!playerRef.current) return
        const newDuration = await playerRef.current.getDuration()
        setDuration(newDuration * 10)
        if (setTrackMax) setTrackMax(newDuration)
    }
    const setSize = async (width: number, height: number) => {
        if (!playerRef.current) return
        console.log({ width, height })
        await playerRef.current.setSize(width, height)
    }
    const initialSizes = useMemo(() => {
        if (typeof window === 'undefined') return [0, 0]
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
        return [playerWidth - 16, playerHeight - 16]
    }, [])

    const handleResize = useCallback(() => {
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
        voidSetSize(playerWidth - 16, playerHeight - 16)
    }, [])

    const initialBuilderSizes = useMemo(() => {
        if (typeof window === 'undefined') return [0, 0]
        const width = window.innerWidth
        let playerWidth = width / 3

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
        return [playerWidth - 16, playerHeight - 16]
    }, [])

    const handleBuilderResize = useCallback(() => {
        if (!window) return
        const voidSetSize = (width: number, height: number) => {
            void setSize(width, height)
        }
        const width = window.innerWidth
        let playerWidth = width / 3

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

    const onPlayerReady: YouTubeProps['onReady'] = (event: { target: YouTubePlayer }) => {
        playerRef.current = event.target
        setSpeed(1)
        void updateDuration()
        handleResize()
    }

    return { voidPlayPause, onStateChange, updateTime, updateDuration, setSize, initialSizes, handleResize, initialBuilderSizes, handleBuilderResize, onPlayerReady, voidSnapToLoop, voidChangeSpeed };
};
