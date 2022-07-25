import React from 'react'
import '../styles/globals.css'
import '../styles/icons.css'
import '../styles/custom.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'


{/** Allows pages to use layouts */}
export type NextPageWithLayout<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactElement) => ReactNode
}

{/** Allows pages in app to use layouts */}
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    /** Use the layout defined at the page level, if available */
    const getLayout = Component.getLayout ?? ((page) => page)

    return getLayout(<Component {...pageProps} />)
}

export default MyApp;