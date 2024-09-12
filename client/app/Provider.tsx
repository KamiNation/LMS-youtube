// first file created in app folder after creating redux store to 
// connect redux to entire application and used imported in Layout component

import React, { ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "../redux/store"

interface ProviderProps {
    children: any
}

export function Providers({ children }: ProviderProps) {
    return <Provider store={store}>{children}</Provider>
}