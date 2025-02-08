import { ChevronDownIcon } from '@heroicons/react/16/solid'
export default function RestTimeDropDown({ restTime, setRestTime }: { restTime: number, setRestTime: (speed: number) => void }) {
    // const builder = useTuneBuilderStore()
    return (
        <div className='relative self-end w-full flex justify-center md:justify-end'>
            <div className='w-1/2'>
                <label htmlFor="rest-time" className="block text-sm/6 text-gray-200 text-center absolute bottom-9 xl:hidden ">
                    Rest
                </label>
                <label htmlFor="rest-time" className="text-sm/6 text-gray-200 text-center absolute bottom-9 hidden xl:block ">
                    Rest Time
                </label>
                <div className="mt-2 grid grid-cols-1">
                    <select
                        id="rest-time"
                        name="rest-time"
                        value={restTime}
                        onChange={(e) => {
                            setRestTime(parseFloat(e.target.value))
                        }
                        }
                        className="select-none col-start-1 row-start-1 w-full appearance-none rounded-md bg-gray-900 py-1.5 pl-3 pr-8 text-base text-white outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        <option value={0}>0</option>
                        <option value={0.5}>0.5</option>
                        <option value={1}>1</option>
                        <option value={1.5}>1.5</option>
                        <option value={2}>2</option>
                        <option value={2.5}>2.5</option>
                        <option value={3}>3</option>
                        <option value={3.5}>3.5</option>
                        <option value={4}>4</option>
                        <option value={4.5}>4.5</option>
                        <option value={5}>5</option>

                    </select>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                </div>
            </div>
        </div>
    )
}
