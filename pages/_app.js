import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider serverUrl="https://ybswkhmuchof.usemoralis.com:2053/server" appId="QcEu9cXntwVTRz6SGbMuAkkYDdEdGWUGtSpCem1A">
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
