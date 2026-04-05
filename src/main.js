import { QuantumShogiApp } from './ui/app.js';

const root = document.getElementById('app');
const app = new QuantumShogiApp(root);
app.render();
app.maybeTriggerAi();

window.microQuantumShogi = app;
