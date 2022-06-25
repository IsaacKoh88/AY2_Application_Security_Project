import '../styles/globals.css'
import type { AppProps } from 'next/app';
//import { cookiesProvider } from "react-cookie"


function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default MyApp