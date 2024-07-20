import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.css"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material"

const container = document.getElementById("root")
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
