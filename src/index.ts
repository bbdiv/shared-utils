import { useAuthStore } from './store/auth';
import { useLoggedUserStore } from './store/loggedUser';
import { useShallow } from 'zustand/react/shallow';

//functions
export * from './utils/cookies';
export * from './utils/auth';

//stores
export * from './store/auth';
export * from './store/loggedUser';

//zustand
export { useShallow };

//persistor
export * from './persistor';













//debug abaixo, apagar depois
console.log('Shared utils LOADED.', useAuthStore.getState());

const printState = () => {
    console.log('Auth store state:', useAuthStore.getState());
    console.log('Logged user store state:', useLoggedUserStore.getState());
 
}

(globalThis as any).printState = printState;