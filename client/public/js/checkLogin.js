import { getCookie } from './cookieFuncs';

export default function checkLogin(user) {
  const userPageLink = document.getElementById('userPageLink');
  const accountLink = document.getElementById('accountLink');
  const linkToUserPage = document.getElementById('linkToUserPage');
  const linkToUserSettings = document.getElementById('linkToUserSettings');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  if (user && getCookie('token')) {
    userPageLink.style.display = 'flex';
    userPageLink.style.justifyContent = 'center';
    accountLink.style.display = 'none';
    userName.textContent = user.login;
    linkToUserPage.href = `/user/${user.login}`;
    linkToUserSettings.href = `/user/${user.login}/settings`;
    userAvatar.src = user.avatar
      ? `${user.avatar}`
      : 'https://res.cloudinary.com/dbapiimages/image/upload/v1655238165/avatar-default_v7gfhw.svg';
  } else {
    userPageLink.style.display = 'none';
    accountLink.style.display = 'flex';
  }
}
