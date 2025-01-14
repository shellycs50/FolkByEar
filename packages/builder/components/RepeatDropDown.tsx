import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useLooperStore } from "packages/looper/store";
import { useTuneBuilder } from '../store';
export default function RepeatDropDown() {
    const info = useLooperStore()
    const builder = useTuneBuilder()
    const selectedPhraseIdx = builder.selectedPhraseIdx
    const selectedPhrase = builder.phrases[selectedPhraseIdx]
    const repeats = selectedPhrase?.repeatCount ?? 3

    return (
        <div className='relative'>
            <label htmlFor="speed" className="block text-sm/6 text-gray-200 text-center absolute bottom-9">
                Repeats
            </label>

            <div className="mt-2 grid grid-cols-1">
                <select
                    id="speed"
                    name="speed"
                    value={repeats}
                    onChange={(e) => builder.setRepeatCount(selectedPhraseIdx, parseInt(e.target.value))}
                    className="select-none col-start-1 row-start-1 w-full appearance-none rounded-md bg-gray-900 py-1.5 pl-3 pr-8 text-base text-white outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>

                </select>
                <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
            </div>
        </div>
    )
}