"use client"

import * as React from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"

import type { ThemeProviderProps } from "next-themes/dist/types"

// second file created in utils folder and used in layout.tsx

export function ThemeProvider({children, ...props}: ThemeProviderProps){
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}