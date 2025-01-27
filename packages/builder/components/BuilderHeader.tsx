import { motion } from "framer-motion"

export default function BuilderHeader({ tryToLeave }: { tryToLeave: () => void }) {

    return (
        <div className="w-1/2 flex flex-col justify-center items-center md:border-b border-white/10 relative shadow-2xl">
            <div className="hidden md:flex flex-col gap-3 items-center p-4 rounded-b-3xl">
                <h1 className="text-md lg:text-4xl text-gray-100 font-semibold">LoopLab</h1>
                <p className="hidden lg:block lg:text-sm text-gray-300">Mark, loop, and learn from any video.</p>
            </div>
            <div className="mt-4 md:mt-0 md:self-end md:absolute">
                <motion.div
                    whileTap={{ scale: 0.9 }}>
                    <a onClick={() => tryToLeave()} className="bg-slate-900 text-white p-3 m-3 rounded-2xl shadow-2xl cursor-pointer">
                        Go to Player
                    </a>
                </motion.div>
            </div>
        </div>
    )
}