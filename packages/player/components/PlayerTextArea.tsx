import { usePlayerStore } from "../store"
import z, { ZodError } from 'zod'
import debounce from "lodash.debounce"
import React from "react";
import clsx from "clsx";
import Link from "next/link";
export default function PlayerTextArea({ }) {
    const pp = usePlayerStore()
    const phraseSchema = z.object({
        idx: z.number().int().nonnegative(), // Must be a non-negative integer
        startTime: z.number().nonnegative(), // Must be a non-negative number
        endTime: z.number().nonnegative(), // Must be a non-negative number
        repeatCount: z.number().int().positive(), // Must be a positive integer
        speed: z.number().positive(), // Must be a positive number
    });

    const dataSchema = z.object({
        selectedPhraseIdx: z.number().int().nonnegative(), // Must be a non-negative integer
        videoId: z.string().min(1), // Must be a non-empty string
        phrases: z.array(phraseSchema).min(1), // Must be an array of phrases with at least one entry
        restTime: z.number().nonnegative(), // Must be a non-negative number
    });

    const handleChangeCore = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        try {
            const data = dataSchema.parse(JSON.parse(value))
            pp.setData(data)
        } catch (error) {
            if (error instanceof ZodError) {
                setError(error.errors.map(err => err.message).join('\n'))
            } else {
                setError('Invalid JSON')
            }
            setTimeout(() => setError(null), 5000)
        }
    }

    const handleChange = debounce(handleChangeCore, 500)

    const [error, setError] = React.useState<string | null>(null)
    return (
        <div className="w-1/3">
            <label htmlFor="phrases-json" className="block text-md/6 font-medium text-white">
                <p>Paste your code from the <Link href="/create" className="cursor-pointer underline">creator</Link> here</p>
            </label>
            {typeof error === 'string' && <p className="text-red-500 text-sm/6">{error}</p>}
            <div className="mt-2">
                <textarea
                    id="phrases-json"
                    name="phrases-json"
                    rows={4}
                    className={clsx(
                        'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6',
                        { 'bg-red-500': typeof error === 'string' }
                    )}

                    onChange={handleChange}
                />

            </div>
        </div>
    )
}
