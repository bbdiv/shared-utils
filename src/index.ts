import { useAuthStore } from "./store/auth";
import { useSessionStore } from "./store/session";
import { useShallow } from "zustand/react/shallow";
import init from "./utils/init";

//functions
export * from "./utils/cookies";
export * from "./utils/auth";
export * from "./utils/session";

//stores
export * from "./store/auth";
export * from "./store/session";

//zustand
export { useShallow };

//persistor
export * from "./persistor";

//components
export { PrivateRoute } from "./components/PrivateRoute";

init();

//
//
//
//
//
//
//
//debug abaixo, apagar depois
const printState = () => {
  console.log("Auth store state:", useAuthStore.getState());
  console.log("Session store:", useSessionStore.getState());
};

(globalThis as any).printState = printState;
