import React, { useState, useEffect } from 'react';
import { useLazyFindUserQuery } from '../../store/apis/accountApi';
import '../../public/css/components/userInfo.scss';
import translationDataJSON from '../../public/json/translationData.json';

export default function UserInfo({ userLogin }) {
  const [currentUserInfoBlock, setCurrentUserInfoBlock] = useState(0);
  const userInfoBlockNames = [
    'Персональна інформація',
    'Контактна інформація',
    'Місцезнаходження',
    'Додатково',
  ];
  const [userName, setUserName] = useState('');
  const [userSurname, setUserSurname] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [userGender, setUserGender] = useState('');
  const [userBirthdate, setUserBirthdate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAdditionalContactInfo, setUserAdditionalContactInfo] =
    useState('');
  const [userCountry, setUserCountry] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userAdditionalInfo, setUserAdditionalInfo] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userReviewsCount, setUserReviewsCount] = useState(0);
  const [findUser] = useLazyFindUserQuery();

  useEffect(() => {
    findUser({ login: userLogin, role: userRole }).then((result) => {
      setUserName(result.data.name);
      setUserSurname(result.data.surname);
      setUserRole(result.data.user_role);
      setUserGender(result.data.gender);
      setUserBirthdate(result.data.birthdate);
      setUserEmail(result.data.email);
      setUserAdditionalContactInfo(result.data.additional_contact_info);
      setUserCountry(result.data.country);
      setUserCity(result.data.city);
      setUserAdditionalInfo(result.data.additional_info);
      setUserAvatar(result.data.avatar);
      setUserReviewsCount(result.data.reviewCount);
    });
  }, []);

  function userInfoAnimation(
    currentBlockParam,
    nextBlockParam,
    currentBlockIndex,
  ) {
    const currentBlock = currentBlockParam;
    const nextBlock = nextBlockParam;
    const otherInfoHeader = document.getElementById('otherInfoHeader');
    currentBlock.classList.add('hideUserInfoBlockAnimation');
    setTimeout(() => {
      currentBlock.classList.remove('hideUserInfoBlockAnimation');
      currentBlock.style.display = 'none';
      currentBlock.style.transform = 'scale(0)';
      nextBlock.style.display = 'block';
      nextBlock.classList.add('showUserInfoBlockAnimation');
      otherInfoHeader.textContent = userInfoBlockNames[currentBlockIndex];
    }, 290);
    setTimeout(() => {
      nextBlock.classList.remove('showUserInfoBlockAnimation');
      nextBlock.style.transform = 'scale(1)';
      setCurrentUserInfoBlock(currentBlockIndex);
    }, 580);
  }

  function nextAnimation() {
    let nextUserInfoBlock;
    const userInfoBlocks = [
      document.getElementById('personalInfo'),
      document.getElementById('contactInfo'),
      document.getElementById('locationInfo'),
      document.getElementById('additionalInfo'),
    ];
    if (currentUserInfoBlock + 1 > userInfoBlocks.length - 1) {
      nextUserInfoBlock = 0;
    } else {
      nextUserInfoBlock = currentUserInfoBlock + 1;
    }
    userInfoAnimation(
      userInfoBlocks[currentUserInfoBlock],
      userInfoBlocks[nextUserInfoBlock],
      nextUserInfoBlock,
    );
  }

  function previousAnimation() {
    let previousUserInfoBlock;
    const userInfoBlocks = [
      document.getElementById('personalInfo'),
      document.getElementById('contactInfo'),
      document.getElementById('locationInfo'),
      document.getElementById('additionalInfo'),
    ];
    if (currentUserInfoBlock - 1 === -1) {
      previousUserInfoBlock = userInfoBlocks.length - 1;
    } else {
      previousUserInfoBlock = currentUserInfoBlock - 1;
    }
    userInfoAnimation(
      userInfoBlocks[currentUserInfoBlock],
      userInfoBlocks[previousUserInfoBlock],
      previousUserInfoBlock,
    );
  }

  return (
    <section className="userInfoBlock">
      <div className="avatar userInfoElement" id="avatar">
        <img
          src={
            userAvatar !== 'null'
              ? `${userAvatar}`
              : 'https://res.cloudinary.com/dbapiimages/image/upload/v1655238165/avatar-default_v7gfhw.svg'
          }
          alt="Фото користувача"
        />
      </div>
      <div
        className="mainInfoBlock userInfoElement infoBlock"
        style={{ display: userRole === 'moderator' ? 'none' : 'flex' }}
      >
        <div className="mainInfoElement">
          <span className="mainInfoHeader">{translationDataJSON.accountPage.english.reviewsCountLabel}</span>
          <span className="mainInfoText">{userReviewsCount}</span>
        </div>
        {/* <div className="mainInfoElement">
          <span className="mainInfoHeader">Підписників</span>
          <span className="mainInfoText">{userSubscribersCount}</span>
        </div>
        <div className="mainInfoElement">
          <span className="mainInfoHeader">Підписаний</span>
          <span className="mainInfoText">{userSubscriptionCount}</span>
        </div> */}
      </div>
      <div className="otherInfoBlock infoBlock">
        <div className="otherInfoHeaderBlock">
          <button
            type="button"
            className="otherInfoArrow"
            onClick={previousAnimation}
          >
            &lsaquo;
          </button>
          <span className="otherInfoHeader" id="otherInfoHeader">
            Персональна інформація
          </span>
          <button
            type="button"
            className="otherInfoArrow"
            onClick={nextAnimation}
          >
            &rsaquo;
          </button>
        </div>
        <div className="otherInfoMainBlock">
          <table id="personalInfo">
            <tr>
              <td>
                <span className="otherInfoMainHeader">Ім&apos;я:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <input type="text" disabled value={userName} />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="otherInfoMainHeader">Прізвище:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <input type="text" disabled value={userSurname} />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="otherInfoMainHeader">Стать:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <input type="text" disabled value={userGender} />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="otherInfoMainHeader">Дата народження:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <input
                    type="text"
                    disabled
                    value={userBirthdate.split('T')[0]}
                  />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <table id="contactInfo">
            <tr>
              <td>
                <span className="otherInfoMainHeader">Пошта:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <input type="text" disabled value={userEmail} />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="otherInfoMainHeader">Додатково:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <textarea
                    rows="5"
                    disabled
                    defaultValue={userAdditionalContactInfo}
                  ></textarea>
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <table id="locationInfo">
            <tr>
              <td>
                <span className="otherInfoMainHeader">Країна:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <input type="text" disabled value={userCountry} />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="otherInfoMainHeader">Населений пункт:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <input type="text" disabled value={userCity} />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <table id="additionalInfo">
            <tr>
              <td>
                <span className="otherInfoMainHeader">Про себе:</span>
              </td>
              <td>
                <div className="otherInfoMainText">
                  <textarea
                    rows="5"
                    disabled
                    defaultValue={userAdditionalInfo}
                  ></textarea>
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </section>
  );
}
