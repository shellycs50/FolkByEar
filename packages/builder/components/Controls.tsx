import { useTuneBuilder } from "../store";
import { useLooperStore } from "packages/looper/store";
import RepeatDropDown from "./RepeatDropDown";
export default function Controls() {
    const { createPhrase } = useTuneBuilder()
    const info = useLooperStore()
    return (
        <div className="w-1/3 flex flex-col items-start bg-pink-600">
            <a className="bg-slate-900 text-white p-3 rounded-2xl" onClick={() => createPhrase(info.duration)}>Create</a>
            <RepeatDropDown />
        </div>
    )
}