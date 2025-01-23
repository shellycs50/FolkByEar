import { usePlayerStore } from "../store"
import clsx from 'clsx'
import { useYouTubePlayer } from "packages/looper/useYoutubePlayer"
export const PlayerPhraseVisualizer = () => {
    const { data, ...pp } = usePlayerStore()
    const yt = useYouTubePlayer('player', null)
    return (
        <div className="flex">
            {data.phrases.map((phrase) => (
                <div key={phrase.idx} className=
                    {clsx(
                        'border border-black p-2 m-2 text-white cursor-pointer',
                        { 'bg-green-300': phrase.idx === pp.currentPhraseIdx }
                    )}
                    onClick={() => {
                        pp.setCurrentPhraseIdx(phrase.idx)
                        pp.setSliderValues([phrase.startTime, phrase.endTime])
                        void yt.updateTime()
                    }}>
                    {phrase.idx}
                </div>))}
            {data.phrases.length === 0 && <div className="border border-black p-2 m-2 text-white">No phrases</div>}
        </div>
    )
}