import { ssoInstance, suiteInstance } from "@axios";
import addParamsToUrl from "./addParamsToUrl";
import {
  useSessionStore,
  type userAccount,
  type UserData,
} from "../store/session";
import persistor from "../persistor";
import { logout } from "./auth";

export const saveUserLogin = (
  userAccount: userAccount,
  userData: UserData,
 
) => {
  const sessionStore = useSessionStore.getState();

  sessionStore.setUserAccount(userAccount);
  sessionStore.setUserData(userData);
 

  persistor.setItem("userAccount", userAccount,10 * 60 * 1000 * 6); // 1 hour
  persistor.setItem("userData", userData,10 * 60 * 1000 * 6); // 1 hour
 
};



export const getCustomerList = async (email: string, module?: string) => {
  console.log("[PUM] email:", email, "module:", module);

  // todo add auth headers

  try {
    const response = await suiteInstance("", "v2").get(
      addParamsToUrl(
        `/users/email/${email}/customers`,
        module ? { "filter[product]": module } : {}
      )
    );
    console.log("[PUM] getCustomerList response:", response);
    if (response.status === 200) {
   
      return response.data.data;
    } else {
      const error = new Error("Failed to fetch customer list");
      (error as any).response = response;
      throw error;
    }
  } catch (error) {
    console.error("[PUM] Error fetching customer list:", error);
  }
};



export const saveSelectedCustomer = (customer: any) => {
  const { setSelectedCustomer } = useSessionStore.getState();

  persistor.setItem("selectedCustomer", customer);

  setSelectedCustomer(customer);
};

export const saveSelectedConstruction = (construction: any) => {
  const { setSelectedConstruction } = useSessionStore.getState();

  persistor.setItem("selectedConstruction", construction);
  setSelectedConstruction(construction);
};


//dados do usuario vindos do sso (userAccount)
export const getAccountData = async (idToken: string,email: string) => {
try {
  const response = await ssoInstance().get(`/account/${email}`, {
    withCredentials: true,
    headers: {
      "Authorization": idToken,
    },

  });

  console.log("[PUM] getAccountData response:", response);
//usar o save? ou setar direto pra n precisar editar as outras funcoes?

  return response.data.data;


} catch (error) {
  console.error("[PUM] Error fetching account data:", error);
  logout();

}

 


}


//dados do usuario vindos do suite (userData)
export const getUserData = async (email: string) => {

  try {
    
    const response = await suiteInstance("", "v1").get(`/users/email/${email}`);
    console.log("[PUM] getUserData response:", response);
     return response.data.data;


  } catch (error) {
    console.error("[PUM] Error fetching user data:", error);
    logout();
  }


}