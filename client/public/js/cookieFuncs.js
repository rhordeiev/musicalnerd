/* eslint-disable no-useless-escape */
/* eslint-disable import/prefer-default-export */

export function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(name) {
  document.cookie = `${name}=;Max-Age=-1;`;
}

// export function deleteAllCookies() {
//   const cookies = document.cookie.split(';');

//   for (let i = 0; i < cookies.length; i = +1) {
//     const cookie = cookies[i];
//     const eqPos = cookie.indexOf('=');
//     const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
//   }
// }
