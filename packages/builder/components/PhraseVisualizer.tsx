import { useTuneBuilderStore } from "../store";
import { useLooperStore } from "packages/looper/store";
import clsx from "clsx";
export const PhraseVisualizer = ({
    zoomTrack,
    isZoomed,
}: {
    zoomTrack: (start: number, end: number) => void;
    isZoomed: boolean;
}) => {
    const { setSliderValues } = useLooperStore();
    const builder = useTuneBuilderStore();

    return (
        <div className="flex flex-col items-center">
            <ol className="flex select-none flex-wrap">
                {builder.phrases.map((phrase) => (
                    <li key={phrase.idx}>
                        <button
                            className={clsx(
                                "m-2 flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden border border-black p-2 text-center text-white",
                                { "bg-green-300": phrase.idx === builder.selectedPhraseIdx },
                            )}
                            onClick={() => {
                                builder.setSelectedPhrase(phrase.idx);
                                setSliderValues([phrase.startTime, phrase.endTime]);
                                if (!isZoomed) return;
                                zoomTrack(phrase.startTime, phrase.endTime);
                            }}
                        >
                            <p>{phrase.idx + 1}</p>
                        </button>
                    </li>
                ))}
                {builder.phrases.length === 0 && (
                    <div className="m-2 border border-black p-2 text-white">
                        No phrases
                    </div>
                )}
            </ol>
        </div>
    );
};
