import '@/styles/globals.css'
import type { AppProps } from 'next/app'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function (): number {
  return parseInt(this.toString());
};

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
