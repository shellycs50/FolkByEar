import { PlayerState, usePlayerStore } from "../store";
import clsx from "clsx";
import { YTPlayerNoResize } from "packages/looper/useYoutubePlayer";
import React from "react";
import { MdJoinInner } from "react-icons/md";
export const PlayerPhraseVisualizer = ({ yt }: { yt: YTPlayerNoResize }) => {


    const { data, ...pp } = usePlayerStore();

    const calculateSliderValues = () => {
        // costing client compute to make ts happy
        const { currentPhraseIdxs } = usePlayerStore.getState();
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
    const handlePhraseReset = () => {
        const latest = usePlayerStore.getState()
        const currentPhraseIdx = latest.currentPhraseIdxs[0]
        if (typeof currentPhraseIdx === 'undefined') return
        pp.setCurrentPhraseIdxs([currentPhraseIdx])
        const sliderValues = calculateSliderValues()
        if (sliderValues) pp.setSliderValues(sliderValues)
    }

    const handlePhraseResetClick = () => {
        const linked = pp.linkMode
        if (linked) {
            handlePhraseReset()
            pp.setLinkMode(false)
        } else {
            pp.setLinkMode(true)
        }
    }
    return (
        <div className="flex flex-col items-center">
            <ol className="flex select-none flex-wrap items-center">
                <button onClick={handlePhraseResetClick}>
                    <MdJoinInner className={clsx({ "h-9 w-9": true, "text-green-500": pp.linkMode, "text-slate-900": !pp.linkMode })} />
                </button>
                {data.phrases.map((phrase) => (
                    <li
                        key={phrase.idx}
                        className={clsx(
                            "m-2 flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden border border-black p-2 text-center text-white",
                            { "bg-green-300": pp.currentPhraseIdxs.includes(phrase.idx) },
                        )}
                    >
                        <button
                            key={phrase.idx}

                            onMouseDown={() => {
                                if (pp.linkMode) {
                                    pp.togglePhraseIdx(phrase.idx);
                                } else {
                                    pp.setCurrentPhraseIdxs([phrase.idx]);
                                }

                                const sliderValues = calculateSliderValues();
                                if (sliderValues) pp.setSliderValues(sliderValues);
                                void yt.updateTime();
                            }}


                        >
                            <p>{phrase.idx + 1}</p>
                        </button>
                    </li>
                ))}
                {data.phrases.length === 0 && (
                    <div className="m-2 border border-black p-2 text-white">
                        No phrases
                    </div>
                )}
            </ol>
        </div>
    );
};
