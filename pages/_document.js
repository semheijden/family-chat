import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(){
    return(
        <Html>
            <Head>
            <link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap" rel="stylesheet"/>
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    )
}