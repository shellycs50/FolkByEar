import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Header() {
    const { pathname } = useRouter()

    return (
        <div className="w-1/2 flex flex-col justify-center items-center md:border-b border-white/10 md:relative shadow-2xl ">
            <div className="hidden md:flex flex-col gap-3 items-center p-4 rounded-b-3xl">
                <h1 className="text-md lg:text-4xl text-gray-100 font-semibold">Folk By Ear</h1>
                <p className="hidden lg:block lg:text-sm text-gray-300">Learn tunes faaaast</p>
            </div>
            <div className="mt-4 md:mt-0 md:self-end md:absolute">
                {pathname !== '/play' && (
                    <motion.div
                        whileTap={{ scale: 0.9 }}>
                        <Link href="/play" className="bg-slate-900 text-white p-3 m-3 rounded-2xl">
                            Go to Player
                        </Link>
                    </motion.div>
                )}

                {pathname !== '/create' && (
                    <motion.div
                        whileTap={{ scale: 0.9 }}>
                        <Link href="/create" className="bg-slate-900 text-white p-3 m-3 rounded-2xl shadow-2xl">
                            Go to Creator
                        </Link>
                    </motion.div>
                )}

            </div>
        </div>
    )
}