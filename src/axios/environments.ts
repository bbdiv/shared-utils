const env = import.meta.env.NODE_ENV || 'development';

interface ApiEnvironment {
  baseURL: string;
}

interface ApiEnvironments {
  sso: ApiEnvironment;
}

const developmentEnvironments: ApiEnvironments = {
  sso: {
    baseURL: import.meta.env.AUTH_BASE_URL || "https://sso.autodocdev.com" ,
  },

};

const productionEnvironments: ApiEnvironments = {
  sso: {
    baseURL: import.meta.env.AUTH_BASE_URL || "https://sso.autodoc.com.br" ,
  },
 
};

const apiEnvironments: ApiEnvironments = env === 'production' ? productionEnvironments : developmentEnvironments;

export default apiEnvironments;
