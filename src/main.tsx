import { createRoot } from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import App from "./App.tsx";
import "./index.css";


const config = {
    signInRedirectURL: "http://localhost:8080",
    signOutRedirectURL: "http://localhost:8080",
    clientID: "WDLaFpIBI3RE4BKqVJ93DXGBWfMa", // 👈 Replace with your Client ID
    baseUrl: "https://api.eu.asgardeo.io/t/codesixteammochi", // 👈 Replace with your Org URL
    scope: [ "openid", "profile" ]
};


createRoot(document.getElementById("root")!).render(
    <AuthProvider config={config}>
        <App />
    </AuthProvider>
);
