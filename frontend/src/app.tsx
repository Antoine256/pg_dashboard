//import {Greet} from "../wailsjs/go/main/App";
import { Theme } from "@radix-ui/themes";
import Dashboard from './app/Dashboard';

export function App(props: any) {

    function greet() {
       // Greet(name).then(updateResultText);
    }

    return (
        <>
            <div id="App">
                <Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%" appearance="dark" panelBackground="solid">
                    <Dashboard />
                </Theme>
            </div>
        </>
    )
}
