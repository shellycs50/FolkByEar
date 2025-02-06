import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/next"
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>LoopLab</title>
        <meta name="description" content="Mark, loop, and learn from any video." />
        <meta property="og:title" content="LoopLab" />
        <meta property="og:description" content="Mark, loop, and learn from any video." />
        <meta property="og:url" content="https://looplab-beta.vercel.app" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="LoopLab" />
        <meta name="twitter:description" content="Mark, loop, and learn from any video." />

        <link rel="canonical" href="https://looplab-beta.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider session={session}>
        <div className="bg-slate-700">
          <div className={GeistSans.className}>
            <Component {...pageProps} />
            <Analytics />
          </div>
        </div>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
