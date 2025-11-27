const env = import.meta.env.NODE_ENV || "development";

interface ApiEnvironment {
  baseURL: string;
}

interface ApiEnvironments {
  sso: ApiEnvironment;
  suite: ApiEnvironment;
}

const developmentEnvironments: ApiEnvironments = {
  sso: {
    baseURL: import.meta.env.AUTH_BASE_URL || "https://sso.autodocdev.com",
  },
  suite: {
    baseURL: import.meta.env.SUITE_BASE_URL || "https://suite.autodocdev.com",
  },
};

const productionEnvironments: ApiEnvironments = {
  sso: {
    baseURL: import.meta.env.AUTH_BASE_URL || "https://sso.autodoc.com.br",
  },
  suite: {
    baseURL: import.meta.env.SUITE_BASE_URL || "https://suite.autodoc.com.br",
  },
};

const apiEnvironments: ApiEnvironments =
  env === "production" ? productionEnvironments : developmentEnvironments;

export default apiEnvironments;
