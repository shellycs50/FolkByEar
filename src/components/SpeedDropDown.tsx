import { ChevronDownIcon } from '@heroicons/react/16/solid'

export default function SpeedDropDown({ speed, setSpeed }: { speed: number, setSpeed: (speed: number) => void }) {
  return (
    <div className='relative'>
      <label htmlFor="speed" className="block text-sm/6 text-gray-200 text-center absolute bottom-9">
        Speed
      </label>

      <div className="mt-2 grid grid-cols-1">
        <select
          id="speed"
          name="speed"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          <option value={0.1}>0.1</option>
          <option value={0.2}>0.2</option>
          <option value={0.3}>0.3</option>
          <option value={0.4}>0.4</option>
          <option value={0.5}>0.5</option>
          <option value={0.6}>0.6</option>
          <option value={0.7}>0.7</option>
          <option value={0.8}>0.8</option>
          <option value={0.9}>0.9</option>
          <option value={1.0}>1.0</option>
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        />
      </div>
    </div>
  )
}
