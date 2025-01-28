import { useTuneBuilderStore } from "../store"
import { useLooperStore } from "packages/looper/store"
import clsx from 'clsx'
export const PhraseVisualizer = ({ zoomTrack, isZoomed }: { zoomTrack: (start: number, end: number) => void, isZoomed: boolean }) => {
    const { setSliderValues } = useLooperStore()
    const builder = useTuneBuilderStore()

    return (
        <div className="flex flex-col items-center">
            <div className="flex select-none flex-wrap">
                {builder.phrases.map((phrase) => (
                    <div key={phrase.idx} className=
                        {clsx(
                            'border border-black p-2 m-2 text-white cursor-pointer h-9 w-9 overflow-hidden text-center flex justify-center items-center',
                            { 'bg-green-300': phrase.idx === builder.selectedPhraseIdx }
                        )}
                        onClick={() => {
                            builder.setSelectedPhrase(phrase.idx)
                            setSliderValues([phrase.startTime, phrase.endTime])
                            if (!isZoomed) return
                            zoomTrack(phrase.startTime, phrase.endTime)
                        }}>
                        <p>{phrase.idx + 1}</p>
                    </div>))}
                {builder.phrases.length === 0 && <div className="border border-black p-2 m-2 text-white">No phrases</div>}
            </div>
        </div>
    )
}