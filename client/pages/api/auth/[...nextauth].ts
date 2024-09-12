// social login component


// install npm i next-auth
import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google"

import GithubProvider from "next-auth/providers/github"


export const authOptions = {
providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
    })
],
secret: process.env.SECRET,
}

export default NextAuth(authOptions)

// google oauth

// search google developer console, 
//  => console.cloud.google.com,
// => create project
//  => select, the project and
// => select, enable api and services
//  => then select,  credentials 
//  => then select create credentials and select Oauth client id and then
//  => select configure consent screen
// => and click on create
//  => then fill edit app registration and then save and continue
//  => then go back to credentials and click on create credentials and select oauth client id
// => application type, web application
// => javascript origin, http://localhost:3000 then 
// => the auth redirect url, http://localhost:3000/api/auth/callback/google click create
//  => once it has been created, copy the client id and client secret


// github oauth
// => goto github.com, then goto settings
//  => then goto developer settings, select oauth apps, select create new app
// => then fill register a new oauth application,
// => homepage url, http://localhost:300,
// => auth callback url,  http://localhost:300/api/auth/callback/github
// => copy client id
// => then click on generate client secret 