import { usePlayerStore } from "../store"
import clsx from 'clsx'
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer"
import React from "react"
export const PlayerPhraseVisualizer = () => {
    const { data, ...pp } = usePlayerStore()
    const yt = useYouTubePlayer('player', null)

    const calculateSliderValues = () => {
        // costing client compute to make ts happy 
        const { currentPhraseIdxs } = usePlayerStore.getState();
        if (!Array.isArray(currentPhraseIdxs) || currentPhraseIdxs.length === 0) return;
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
            <div className="flex select-none flex-wrap">
                {data.phrases.map((phrase) => (
                    <a key={phrase.idx} className=
                        {clsx(
                            'border border-black p-2 m-2 text-white cursor-pointer',
                            { 'bg-green-300': pp.currentPhraseIdxs.includes(phrase.idx) }
                        )}
                        onClick={() => {
                            pp.togglePhraseIdx(phrase.idx)
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            const sliderValues = calculateSliderValues()
                            if (sliderValues) pp.setSliderValues(sliderValues)
                            void yt.updateTime()
                        }}>
                        {phrase.idx}
                    </a>))}
                {data.phrases.length === 0 && <div className="border border-black p-2 m-2 text-white">No phrases</div>}
            </div>
        </div>
    )
}