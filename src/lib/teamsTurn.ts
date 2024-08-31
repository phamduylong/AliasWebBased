import { writable, type Writable } from 'svelte/store';

function init() {
    const {subscribe, set} : Writable<boolean> = writable<boolean>(true);

    return {
        subscribe,
        switchToTeam1: () : void => { set(true); console.log("LOL") },
        switchToTeam2: () : void => { set(false); console.log("LOL2")}
    }
}
const team1Turn = init();
export { team1Turn };