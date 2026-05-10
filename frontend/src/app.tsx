import './App.css'
import logo from "./assets/images/logo-universal.png"
//import {Greet} from "../wailsjs/go/main/App";
import {useState} from "preact/hooks";
import {h} from 'preact';
import { Theme, ThemePanel } from "@radix-ui/themes";

export function App(props: any) {

    function greet() {
       // Greet(name).then(updateResultText);
    }

    return (
        <>
            <div id="App">
                <Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
                    
                    {/* <ThemePanel /> */}
                </Theme>
            </div>
        </>
    )
}
