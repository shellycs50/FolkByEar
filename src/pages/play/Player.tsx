import YouTube from "react-youtube";
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer";
import React, { useCallback, useEffect } from "react";
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon";
import { ForwardIcon } from "@heroicons/react/16/solid";
import { BackwardIcon } from "@heroicons/react/16/solid";
// import { ArrowPathIcon } from "@heroicons/react/16/solid"
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import { usePlayerStore } from "packages/player/store";
import { PlayerPhraseVisualizer } from "packages/player/components/PlayerPhraseVisualizer";
import SpeedDropDown from "packages/builder/components/SpeedDropDown";
import RestTimeDropDown from "packages/player/components/RestTimeDropDown";
import { fmtMSS } from "packages/looper/helpers";
import debounce from "lodash.debounce";
import Instructions from "packages/player/components/Instructions";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { dataDecompress } from "packages/sharing/conversion";
import Header from "packages/header/Header";
import PlayerSlider from "packages/player/components/PlayerSlider";

export default function Player() {
    const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

    const setSliderValues = usePlayerStore((state) => state.setSliderValues);

    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);

    const duration = usePlayerStore((state) => state.duration);
    const setDuration = usePlayerStore((state) => state.setDuration);

    const speed = usePlayerStore((state) => state.speed);
    const setSpeed = usePlayerStore((state) => state.setSpeed);

    const hasStarted = usePlayerStore((state) => state.hasStarted);
    const setHasStarted = usePlayerStore((state) => state.setHasStarted);

    const currentPhraseIdxs = usePlayerStore((state) => state.currentPhraseIdxs);
    const setCurrentPhraseIdxs = usePlayerStore(
        (state) => state.setCurrentPhraseIdxs,
    );
    // const togglePhraseIdx = usePlayerStore((state) => state.togglePhraseIdx);

    const data = usePlayerStore((state) => state.data);
    const setData = usePlayerStore((state) => state.setData);

    const restTime = usePlayerStore((state) => state.restTime);
    const setRestTime = usePlayerStore((state) => state.setRestTime);

    const linkMode = usePlayerStore((state) => state.linkMode);
    const setLinkMode = usePlayerStore((state) => state.setLinkMode);

    const togglePhraseIdx = usePlayerStore((state) => state.togglePhraseIdx);

    // const showGuide = usePlayerStore((state) => state.showGuide);
    // const setShowGuide = usePlayerStore((state) => state.setShowGuide);

    // const playerReady = usePlayerStore((state) => state.playerReady);
    const setPlayerReady = usePlayerStore((state) => state.setPlayerReady);

    const getLatestPlayerState = usePlayerStore.getState;

    const router = useRouter();

    const removeQueryParams = useCallback(async () => {
        await router.push(
            {
                pathname: router.pathname,
                query: {},
            },
            undefined,
            { shallow: true },
        );
    }, [router]);

    useEffect(() => {
        const q = router.query;
        if (typeof q.data === "string" && q.data.length > 0) {
            const res = dataDecompress(q.data);
            if (res !== null) {
                setData(res);
                setSliderValues([
                    res.phrases[0]?.startTime ?? 0,
                    res.phrases[0]?.endTime ?? 5,
                ]);
                setCurrentPhraseIdxs([0]);
                void removeQueryParams();
            }
        }
    }, [removeQueryParams, router.query, setCurrentPhraseIdxs, setData, setSliderValues]);

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

    const {
        voidSeekToTime,
        voidPlayPause,
        onStateChange,
        handleResize,
        initialBuilderSizes,
        onPlayerReady,
        voidChangeSpeed,
        updateTime,
    } = useYouTubePlayer({
        setCurrentTime,
        setTrackMax: undefined,
        setDuration,
        setSpeed,
        getLatestState: usePlayerStore.getState,
        getRestTime: undefined,
        setIsPlaying,
        setPlayerReady,
        onLoop: undefined,
    });

    const calculateSliderValues = () => {
        // costing client compute to make ts happy
        const { currentPhraseIdxs, data } = getLatestPlayerState();
        if (!Array.isArray(currentPhraseIdxs) || currentPhraseIdxs.length === 0)
            return;
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
            const sliderValues = calculateSliderValues();
            if (sliderValues) setSliderValues(sliderValues);
            setHasStarted(true);
        }
        voidPlayPause();
    };

    const handleNextClick = useCallback(() => {
        const latest = getLatestPlayerState();
        if (latest.linkMode) {
            const staticCurrentTime = latest.currentTime;
            const current = data.phrases.find((phrase) => {
                if (
                    phrase.startTime <= staticCurrentTime &&
                    phrase.endTime >= staticCurrentTime
                ) {
                    const [startlog, endlog] = [phrase.startTime, phrase.endTime];
                    console.log({ startlog, endlog, staticCurrentTime });
                    return true;
                }
            });
            if (current) {
                const nextIdx = latest.currentPhraseIdxs.find(
                    (idx) => idx === current.idx + 1,
                );
                console.log(nextIdx, current.idx);
                if (typeof nextIdx === "undefined") {
                    const startIdx = latest.currentPhraseIdxs[0]!;
                    const startTime = latest.data.phrases[startIdx]!.startTime;
                    voidSeekToTime(startTime);
                    return;
                }
                const next = data.phrases[nextIdx];
                if (typeof next === "undefined") {
                    voidSeekToTime(data.phrases[0]!.startTime);
                    return;
                }
                voidSeekToTime(next.startTime);
                return;
            }
        }
        const currentPhraseIdx = latest.currentPhraseIdxs[0];
        if (typeof currentPhraseIdx === "undefined") return;
        if (latest.data.phrases[currentPhraseIdx + 1]) {
            setCurrentPhraseIdxs([currentPhraseIdx + 1]);
            // this is okay because we use getState in calculateSliderValues
            const sliderValues = calculateSliderValues();
            if (sliderValues) setSliderValues(sliderValues);
        } else {
            setCurrentPhraseIdxs([0]);
            setSliderValues([
                latest.data.phrases[0]?.startTime ?? 0,
                latest.data.phrases[0]?.endTime ?? 5,
            ]);
        }
    }, [
        calculateSliderValues,
        data.phrases,
        getLatestPlayerState,
        setCurrentPhraseIdxs,
        setSliderValues,
        voidSeekToTime,
    ]);

    const handleBackwardClick = useCallback(() => {
        const latest = getLatestPlayerState();
        if (latest.linkMode) {
            const staticCurrentTime = latest.currentTime;
            const current = data.phrases.find((phrase, idx) => {
                if (
                    phrase.startTime <= staticCurrentTime &&
                    phrase.endTime >= staticCurrentTime
                ) {
                    const [startlog, endlog] = [phrase.startTime, phrase.endTime];
                    console.log({ startlog, endlog, staticCurrentTime });
                    return true;
                }
            });
            if (current) {
                console.log(current);
                voidSeekToTime(current.startTime);
            }

            return;
        }
        const currentPhraseIdx = latest.currentPhraseIdxs[0];
        if (typeof currentPhraseIdx === "undefined") return;
        if (typeof latest.data.phrases[currentPhraseIdx - 1] !== "undefined") {
            setCurrentPhraseIdxs([currentPhraseIdx - 1]);
            const sliderValues = calculateSliderValues();
            if (sliderValues) setSliderValues(sliderValues);
        } else {
            setCurrentPhraseIdxs([latest.data.phrases.length - 1]);
            setSliderValues([
                latest.data.phrases[latest.data.phrases.length - 1]?.startTime ?? 0,
                latest.data.phrases[latest.data.phrases.length - 1]?.endTime ?? 5,
            ]);
        }
    }, [
        calculateSliderValues,
        data.phrases,
        getLatestPlayerState,
        setCurrentPhraseIdxs,
        setSliderValues,
        voidSeekToTime,
    ]);

    const handleUTurnClick = useCallback(() => {
        const latest = getLatestPlayerState();
        const currentPhraseIdx = latest.currentPhraseIdxs[0];
        if (typeof currentPhraseIdx === "undefined") return;
        const time = data.phrases[currentPhraseIdx]?.startTime;
        if (typeof time === "undefined") return;
        voidSeekToTime(time);
    }, [data.phrases, getLatestPlayerState, voidSeekToTime]);

    // playerOpts doesnt need to be state
    const [playerOpts] = React.useState({
        height: initialBuilderSizes[1],
        width: initialBuilderSizes[0],
        autoplay: "0",
        controls: "0",
        // playerVars: {
        //   // https://developers.google.com/youtube/player_parameters
        // },
    });

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        window.addEventListener("resize", debounce(handleResize, 500));
    }, [handleResize]);

    // linkMode = usePlayerStore((state) => state.linkMode);
    //     const data = usePlayerStore((state) => state.data);
    //     const setLinkMode = usePlayerStore((state) => state.setLinkMode);
    //     const togglePhraseIdx = usePlayerStore((state) => state.togglePhraseIdx);
    //     const currentPhraseIdxs = usePlayerStore((state) => state.currentPhraseIdxs);
    //     const setCurrentPhraseIdxs = usePlayerStore((state) => state.setCurrentPhraseIdxs);
    //     const setSliderValues = usePlayerStore((state) => state.setSliderValues);

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-start gap-5 pb-20">
            <Header />

            <div className="relative select-none">
                <YouTube
                    loading="lazy"
                    id="yt"
                    className="rounded-xl bg-gray-600 p-4"
                    videoId={data.videoId}
                    opts={playerOpts}
                    onReady={onPlayerReady}
                    onStateChange={onStateChange}
                />
                <button
                    onClick={handlePlayPauseClick}
                    className="absolute left-0 top-0 z-10 h-full w-full select-none"
                ></button>
            </div>
            <div className="relative flex w-full flex-col items-center justify-center px-3 sm:w-8/12 lg:w-1/2 2xl:flex-row">
                <PlayerPhraseVisualizer
                    updateTime={updateTime}
                    data={data}
                    linkMode={linkMode}
                    setLinkMode={setLinkMode}
                    togglePhraseIdx={togglePhraseIdx}
                    currentPhraseIdxs={currentPhraseIdxs}
                    setCurrentPhraseIdxs={setCurrentPhraseIdxs}
                    setSliderValues={setSliderValues}
                />
            </div>
            <PlayerSlider />

            <div className="md:justify-items-between m-0 flex w-11/12 flex-col items-center justify-center gap-5 rounded-xl bg-slate-800 p-3 sm:w-8/12 md:grid md:grid-cols-3 lg:w-1/2">
                <div>
                    <SpeedDropDown
                        speed={speed}
                        setSpeed={setSpeed}
                        voidChangeSpeed={voidChangeSpeed}
                    />
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-2 xs:flex-row">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBackwardClick}
                    >
                        <BackwardIcon className="h-12 w-12 cursor-pointer select-none rounded-xl bg-slate-900 p-1 text-white" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePlayPauseClick}
                    >
                        <PlayPauseIcon className="h-12 w-12 cursor-pointer select-none rounded-xl bg-slate-900 p-1 text-white" />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={handleNextClick}>
                        <ForwardIcon className="h-12 w-12 cursor-pointer select-none rounded-xl bg-slate-900 p-1 text-white" />
                    </motion.button>
                </div>
                <div className="flex flex-col items-end justify-end xs:flex-row md:w-auto">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={handleUTurnClick}>
                        <ArrowUturnLeftIcon className="h-12 w-12 cursor-pointer select-none rounded-xl bg-slate-900 p-1 text-white" />
                    </motion.button>
                    <RestTimeDropDown restTime={restTime} setRestTime={setRestTime} />
                </div>
            </div>
            <div className="top-1 block 2xl:fixed 2xl:left-0">
                <Instructions />
            </div>

        </div>
    );
}
