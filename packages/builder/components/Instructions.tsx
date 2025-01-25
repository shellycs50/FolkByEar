import MagnifyingGlassPlusIcon from "@heroicons/react/16/solid/MagnifyingGlassPlusIcon";
import ReactSlider from "react-slider";
const PhraseExample = () => (
    <a className='border border-black p-2 text-white cursor-pointer'
    >0
    </a>
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
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt className="w-1/2"><ReactSlider /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Move sliders to mark loop</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt><a className=
                                'bg-slate-900 text-white px-2 py-3 rounded-2xl cursor-pointer text-xs'>Add Phrase</a></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Hit add phrase to add a new loop
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt><MagnifyingGlassPlusIcon className="h-8 w-8" /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Use the magnifiying glass to fine tune your current loop</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt className="w-1/2 relative"><PhraseExample /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">
                                Click a phrase to edit it</dd>
                        </div>



                    </dl>
                </div>
            </div>
        </div>)
}