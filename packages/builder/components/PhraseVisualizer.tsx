import { useMemo } from "react"
import { useTuneBuilder } from "../store"
import clsx from 'clsx'
export const PhraseVisualizer = () => {
    const builder = useTuneBuilder()
    return (
        <div className="flex">
            {builder.phrases.map((phrase) => (
                <div key={phrase.idx} className=
                    {clsx(
                        'border border-black p-2 m-2 text-white cursor-pointer',
                        { 'bg-green-300': phrase.idx === builder.selectedPhraseIdx }
                    )}
                    onClick={() => builder.setSelectedPhrase(phrase.idx)}>
                    {phrase.idx}
                </div>))}
        </div>
    )
}