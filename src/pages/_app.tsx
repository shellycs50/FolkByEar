import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/next"
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="bg-slate-700">
        <div className={GeistSans.className}>
          <Component {...pageProps} />
          <Analytics />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
