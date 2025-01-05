import './styles.css';

import { render } from 'solid-js/web';
import { Application } from './Application.tsx';

const main = document.getElementById('app');
if (main) render(Application, main);
