const addParamsToUrl = (baseUrl, params) => {
  const keys = Object.keys(params || {});
  if (keys.length === 0) return baseUrl;

  let queryParams = "";
  for (let i = 0; i < keys.length; i += 1) {
    queryParams += `${keys[i]}=${params[keys[i]]}`;
    if (i < keys.length - 1) {
      queryParams += "&";
    }
  }

  return `${baseUrl}?${queryParams}`;
};

export default addParamsToUrl;
