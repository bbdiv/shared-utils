// Cookie utilities: get/set/remove cookies
export function setCookie(name: string, value: string, days = 1, domain?: string) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/` + (domain ? `; domain=${domain}` : '');
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const parts = cookie.split('=');
    if (parts[0] === name && parts[1] !== undefined) {
      return decodeURIComponent(parts[1]);
    }
  }
  return null;
}

export function removeCookie(name: string) {
  setCookie(name, '', -1);
}
