import "../styles/styles.css";
import Loading from "../components/loading";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Loading />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
