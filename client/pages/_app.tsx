// first file created in pages folder


import type { AppProps } from "next/app";



export default function MyApp({Component, pageProps}: AppProps){
    return <Component {...pageProps}/>
}