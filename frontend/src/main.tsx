import {render} from 'preact';
import {App} from './app';
import './style.css';
import "@radix-ui/themes/styles.css";

render(<App/>, document.getElementById('app')!);
