import { usePlayerStore } from "../store";
import clsx from "clsx";
import React, { useCallback } from "react";
import { MdJoinInner } from "react-icons/md";
interface PlayerPhraseVisualizerProps {
    updateTime: () => void;
    linkMode: boolean;
    data: {
        phrases: {
            idx: number;
            startTime: number;
            endTime: number;
        }[];
    };
    setLinkMode: (linkMode: boolean) => void;
    togglePhraseIdx: (idx: number) => void;
    currentPhraseIdxs: number[];
    setCurrentPhraseIdxs: (idxs: number[]) => void;
    setSliderValues: (values: [number, number]) => void;
}

export const PlayerPhraseVisualizer = React.memo(
    ({
        updateTime,
        linkMode,
        data,
        setLinkMode,
        togglePhraseIdx,
        currentPhraseIdxs,
        setCurrentPhraseIdxs,
        setSliderValues,
    }: PlayerPhraseVisualizerProps) => {
        const calculateSliderValues = useCallback(():
            | [number, number]
            | undefined => {
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
        }, [data.phrases]);

        const handlePhraseReset = () => {
            const latest = usePlayerStore.getState();
            const currentPhraseIdx = latest.currentPhraseIdxs[0];
            if (typeof currentPhraseIdx === "undefined") return;
            setCurrentPhraseIdxs([currentPhraseIdx]);
            const sliderValues = calculateSliderValues();
            if (sliderValues) setSliderValues(sliderValues);
        };

        const handlePhraseResetClick = () => {
            const linked = linkMode;
            if (linked) {
                handlePhraseReset();
                setLinkMode(false);
            } else {
                setLinkMode(true);
            }
        };

        return (
            <div className="flex flex-col items-center">
                <ol className="flex select-none flex-wrap items-center">
                    <button onClick={handlePhraseResetClick}>
                        <MdJoinInner
                            className={clsx({
                                "m-2 h-9 w-9": true,
                                "text-green-500": linkMode,
                                "text-slate-900": !linkMode,
                            })}
                        />
                    </button>
                    {data.phrases.map((phrase) => (
                        <li key={phrase.idx}>
                            <button
                                className={clsx(
                                    "m-2 flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden border border-black p-2 text-center text-white",
                                    { "bg-green-300": currentPhraseIdxs.includes(phrase.idx) },
                                )}
                                key={phrase.idx}
                                onMouseDown={() => {
                                    if (linkMode) {
                                        togglePhraseIdx(phrase.idx);
                                    } else {
                                        setCurrentPhraseIdxs([phrase.idx]);
                                    }

                                    const sliderValues = calculateSliderValues();
                                    if (sliderValues) setSliderValues(sliderValues);
                                    void updateTime();
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
    },
);

PlayerPhraseVisualizer.displayName = "PlayerPhraseVisualizer";
export default PlayerPhraseVisualizer;
