import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  login: '',
  password: '',
  name: '',
  surname: '',
  birthDate: '',
  email: '',
  additionalContactInfo: '',
  country: '',
  city: '',
  avatar: null,
  language: 'english',
  additionalInfo: '',
  role: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  /* eslint-disable no-param-reassign */
  reducers: {
    setAccountInfo: (state, action) => {
      state.login = action.payload.login;
      state.password = action.payload.password;
    },
    setPersonalInfo: (state, action) => {
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.gender = action.payload.gender;
      state.birthDate = action.payload.birthDate;
    },
    setContactInfo: (state, action) => {
      state.email = action.payload.email;
      state.additionalContactInfo = action.payload.additionalContactInfo;
    },
    setLocationInfo: (state, action) => {
      state.city = action.payload.city;
      state.country = action.payload.country;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload.avatar;
    },
    setAdditionalInfo: (state, action) => {
      state.additionalInfo = action.payload.additionalInfo;
    },
    setUserInfo: (state, action) => {
      state.login = action.payload.login;
      state.password = action.payload.password;
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.gender = action.payload.gender;
      state.birthDate = action.payload.birthdate;
      state.email = action.payload.email;
      state.additionalContactInfo = action.payload.additional_contact_info;
      state.city = action.payload.city;
      state.country = action.payload.country;
      state.avatar = action.payload.avatar;
      state.additionalInfo = action.payload.additional_info;
      state.role = action.payload.user_role;
    },
    clearUserInfo: (state) => {
      state.login = initialState.login;
      state.password = initialState.password;
      state.name = initialState.name;
      state.surname = initialState.surname;
      state.gender = initialState.gender;
      state.birthDate = initialState.birthDate;
      state.email = initialState.email;
      state.additionalContactInfo = initialState.additionalContactInfo;
      state.city = initialState.city;
      state.country = initialState.country;
      state.avatar = initialState.avatar;
      state.additionalInfo = initialState.additionalInfo;
      state.role = initialState.role;
    },
  },
  /* eslint-disable no-param-reassign */
});

export const {
  setAccountInfo,
  setPersonalInfo,
  setContactInfo,
  setLocationInfo,
  setAvatar,
  setAdditionalInfo,
  setUserInfo,
  clearUserInfo,
} = userSlice.actions;

export default userSlice.reducer;
