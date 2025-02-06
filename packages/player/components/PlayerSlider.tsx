import { fmtMSS } from "packages/looper/helpers";
import ReactSlider from "react-slider";
import { usePlayerStore } from "../store";
import { useMemo } from "react";

export default function PlayerSlider({ }) {

    const isPlaying = usePlayerStore((state) => state.isPlaying);


    const sliderValues = usePlayerStore((state) => state.sliderValues);
    const setSliderValues = usePlayerStore((state) => state.setSliderValues);

    const currentTime = usePlayerStore((state) => state.currentTime);


    const duration = usePlayerStore((state) => state.duration);


    const mssNums: string[] = useMemo(() => {
        const precomputedNums = [];
        for (let i = 0; i <= duration; i++) {
            precomputedNums.push(fmtMSS(i));
        }
        return precomputedNums;
    }, [duration]);

    return (
        <div className="relative mb-4 mt-3 flex w-11/12 rounded-3xl bg-slate-600 p-5 pb-8 sm:w-8/12 lg:w-1/2">
            <ReactSlider
                value={sliderValues}
                className="horizontal-slider w-full"
                thumbClassName="bg-white p-1 cursor-pointer relative h-3"
                // trackClassName classes applied globals.css
                withTracks={true}
                renderThumb={(props: React.HTMLProps<HTMLDivElement>, state: { index: number; valueNow: number }) => (
                    <div {...props}>
                        <div
                            className={
                                state.index
                                    ? "absolute -bottom-12 -right-5 cursor-pointer rounded-xl border-b-2 border-gray-200 p-2 text-white"
                                    : "absolute -right-5 bottom-5 cursor-pointer rounded-xl border-t-2 border-gray-200 p-2 text-white"
                            }
                        >
                            <p className="select-none">
                                {mssNums[Math.floor(state.valueNow)] ?? Math.floor(state.valueNow)}
                            </p>
                        </div>
                    </div>
                )}
                step={0.005}
                min={0}
                max={duration / 10} //duration is in 10th of a second ReactSlider takes arg in seconds
                onChange={(values) => setSliderValues(values)}
                minDistance={0.05}
            />
            {isPlaying && (
                <div
                    className="absolute top-5 z-30 h-3 border-l-0 border-r-2"
                    style={{
                        width: `${(currentTime / (duration * 1.04)) * 1000}%`,
                    }}
                ></div>
            )}
        </div>
    )

}