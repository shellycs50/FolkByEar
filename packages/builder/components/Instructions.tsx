import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import MagnifyingGlassPlusIcon from "@heroicons/react/16/solid/MagnifyingGlassPlusIcon";
import ReactSlider from "react-slider";
const PhraseExample = () => (
    <div className='border border-black p-2 text-white cursor-pointer w-10 h-10 flex items-center justify-center'>
        0
    </div>
)
export default function Instructions() {
    return (
        <div className="text-white text-lg max-w-96 p-10">
            <div>
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-white">Instructions</h3>
                </div>
                <div className="mt-6 border-t border-white/10">
                    <dl className="divide-y divide-white/10">
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt className="w-1/2"><ReactSlider /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Move sliders to mark loop</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt>
                                <div className='bg-slate-900 text-white p-1 rounded-2xl cursor-pointer text-xs text-center'>Add Phrase</div>
                            </dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Hit add phrase to add a new loop
                            </dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt><MagnifyingGlassPlusIcon className="h-8 w-8" /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Use the magnifiying glass to fine tune your current loop</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt><PhraseExample /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">
                                Click a phrase to edit it</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt><ArrowUturnLeftIcon className="h-8 w-8" /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">
                                Click reset to snap to the start of the current loop</dd>
                        </div>



                    </dl>
                </div>
            </div>
        </div>)
}