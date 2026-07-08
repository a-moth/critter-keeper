'use client';
import { EntryReader } from "./input_modules";


export default function DataManager() {
    return (
        <html>
            <head>
                <title>critterKeeper - dataKeeper</title>
                <link rel="stylesheet" href="style.css" />
            </head>
            <body>
                <div id="header">
                    <a href="index.html">Home</a>
                    <h1>critterKeeper - dataKeeper</h1>
                    <p>A container for the worst to best days.</p>
                </div>
                <div id="main">
                    <EntryReader base="defaultEntry" />
                </div>
            </body>
        </html>
    );
}