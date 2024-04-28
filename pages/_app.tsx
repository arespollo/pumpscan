import "../styles/globals.css";
import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";

import theme from "../theme/themeConfig";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <Component {...pageProps} />
  </ConfigProvider>
);

export default App;
