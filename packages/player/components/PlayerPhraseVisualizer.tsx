import { usePlayerStore } from "../store";
import clsx from "clsx";
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer";
import React from "react";
export const PlayerPhraseVisualizer = () => {
    const { data, ...pp } = usePlayerStore();
    const yt = useYouTubePlayer("player", null);

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
    return (
        <div className="flex flex-col items-center">
            <ol className="flex select-none flex-wrap">
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

                            onClick={() => {
                                pp.togglePhraseIdx(phrase.idx);
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
