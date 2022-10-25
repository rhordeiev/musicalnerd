import React from 'react';
import LoginInfoRegister from './LoginInfoRegister';
import PersonalInfoRegister from './PersonalInfoRegister';
import ContactInfoRegister from './ContactInfoRegister';
import LocationInfoRegister from './LocationInfoRegister';
import AdditionalInfoRegister from './AdditionalInfoRegister';
import AvatarRegister from './AvatarRegister';

export default function Register() {
  return (
    <>
      <LoginInfoRegister />
      <PersonalInfoRegister />
      <ContactInfoRegister />
      <LocationInfoRegister />
      <AdditionalInfoRegister />
      <AvatarRegister />
    </>
  );
}
