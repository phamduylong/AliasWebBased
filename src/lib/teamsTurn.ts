import { writable, type Writable } from 'svelte/store';

function init() {
    const {subscribe, set} : Writable<boolean> = writable<boolean>(true);

    return {
        subscribe,
        switchToTeam1: () : void => set(true),
        switchToTeam2: () : void => set(false)
    }
}
const team1Turn = init();
export { team1Turn };