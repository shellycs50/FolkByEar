import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import BackwardIcon from "@heroicons/react/16/solid/BackwardIcon";
import ForwardIcon from "@heroicons/react/16/solid/ForwardIcon";
import PlayPauseIcon from "@heroicons/react/16/solid/PlayPauseIcon";
import { LinkIcon } from "@heroicons/react/16/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid"
import { MdJoinInner } from "react-icons/md";
import ReactSlider from "react-slider";
const PhraseExample = () => (
    <div className='border border-black p-2 text-white  w-8 h-8 flex items-center justify-center'>
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
                            <dt><LinkIcon className="h-8 w-8 p-1 " /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Enter a link from the creator</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt><PlayPauseIcon className="h-8 w-8 p-1 bg-slate-900 rounded-xl text-white  select-none" /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Get started by hitting play</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt><PhraseExample /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Click <span className="text-green-400">phrases</span> to jump to them or join them in link mode</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt className="w-1/2"><ReactSlider /></dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Adjust sliders</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt className="flex">
                                <BackwardIcon className="w-8 h-8 p-1 bg-slate-900 rounded-xl text-white  select-none" />
                                <ForwardIcon className="w-8 h-8 p-1 bg-slate-900 rounded-xl text-white  select-none" />
                            </dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Click the forward and back buttons to jump between phrases</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt>
                                <MdJoinInner className="w-10 h-10 p-1 bg-slate-700 rounded-xl text-slate-900 select-none hover:text-green-500" />
                            </dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Toggle link mode</dd>
                        </div>
                        <div className="flex flex-col gap-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                            <dt>
                                <ArrowUturnLeftIcon className="w-8 h-8 p-1 bg-slate-900 rounded-xl text-white select-none" />
                            </dt>
                            <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Click restart to jump to the start</dd>
                        </div>


                    </dl>
                </div>
            </div>
        </div>)
}