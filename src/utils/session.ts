import { suiteInstance } from '@axios';
import addParamsToUrl from './addParamsToUrl';
import {
  useSessionStore,
  type userAccount,
  type UserData,
} from '../store/session';
import persistor from '../persistor';

export const saveUserLogin = (
  userAccount: userAccount,
  userData: UserData,
  customerList: unknown[]
) => {
  const sessionStore = useSessionStore.getState();

  sessionStore.setUserAccount(userAccount);
  sessionStore.setUserData(userData);
  sessionStore.setCustomerList(customerList);

  persistor.setItem('userAccount', userAccount);
  persistor.setItem('userData', userData);
  persistor.setItem('customerList', customerList);
};

export const saveCustomerList = (customerList: unknown[]) => {
  const sessionStore = useSessionStore.getState();
  sessionStore.setCustomerList(customerList);

  persistor.setItem('customerList', customerList);
};

export const getCustomerList = async (email: string, module?: string) => {
  console.log('[PUM] email:', email, 'module:', module);

  // todo add auth headers

  try {
    const response = await suiteInstance('', 'v2').get(
      addParamsToUrl(
        `/users/email/${email}/customers`,
        module ? { 'filter[product]': module } : {}
      )
    );
    console.log('[PUM] getCustomerList response:', response);
    if (response.status === 200) {
      saveCustomerList(response.data.data);
      return response.data.data;
    } else {
      const error = new Error('Failed to fetch customer list');
      (error as Error & { response?: unknown }).response = response;
      throw error;
    }
  } catch (error) {
    console.error('[PUM] Error fetching customer list:', error);
  }
};

export const saveCustomerId = (customerId: string) => {
  persistor.setItem('customerId', customerId);

  useSessionStore.getState().setCustomerId(customerId);
};
