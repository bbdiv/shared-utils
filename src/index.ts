import { useAuthStore } from './store/auth';

//functions
export * from './utils/cookies';
export * from './utils/auth';

//stores
export * from './store/auth';
export * from './store/loggedUser';


console.log('Shared utils LOADED.', useAuthStore.getState());
