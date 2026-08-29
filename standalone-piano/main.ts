import { SodorPiano } from '../piano-lib/src/ui/piano-vanilla';

const container = document.getElementById('piano-container');
if (container) {
    new SodorPiano(container);
}
