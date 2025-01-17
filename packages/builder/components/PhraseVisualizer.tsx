import { useTuneBuilderStore } from "../store"
import { useLooperStore } from "packages/looper/store"
import clsx from 'clsx'
export const PhraseVisualizer = () => {
    const { setSliderValues, setSpeed } = useLooperStore()
    const builder = useTuneBuilderStore()
    return (
        <div className="flex">
            {builder.phrases.map((phrase) => (
                <div key={phrase.idx} className=
                    {clsx(
                        'border border-black p-2 m-2 text-white cursor-pointer',
                        { 'bg-green-300': phrase.idx === builder.selectedPhraseIdx }
                    )}
                    onClick={() => {
                        builder.setSelectedPhrase(phrase.idx)
                        setSliderValues([phrase.startTime, phrase.endTime])
                        setSpeed(phrase.speed)
                    }}>
                    {phrase.idx}
                </div>))}
            {builder.phrases.length === 0 && <div className="border border-black p-2 m-2 text-white">No phrases</div>}
        </div>
    )
}