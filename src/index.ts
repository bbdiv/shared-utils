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
export { default as PrivateRoute } from "./components/PrivateRoute";

// Initialize auth and session data
// Errors are handled internally, so we don't need to await or catch here
init().catch((error) => {
  // Catch any unhandled errors during initialization to prevent unhandled promise rejection
  console.error("Failed to initialize shared-utils:", error);
});

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
