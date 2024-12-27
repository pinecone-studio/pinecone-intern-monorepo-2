'use client';
import { FormikErrors, FormikTouched } from 'formik';
import { BookingInformationInput, BookingInformationInputFormikValues } from './BookingInformationInput';
type ErrorMessageType = {
  errors: FormikErrors<BookingInformationInputFormikValues>;
  touched: FormikTouched<BookingInformationInputFormikValues>;
};
export const FirstNameErrorMessage = ({ errors, touched }: BookingInformationInput) => {
  if (touched.firstName && errors.firstName) {
    return (
      <p data-cy="FirstName-Error-Message" className="text-red-500">
        {errors.firstName}
      </p>
    );
  }
};
export const EmailErrorMessage = ({ errors, touched }: BookingInformationInput) => {
  if (touched.email && errors.email) {
    return (
      <p data-cy="Email-Error-Message" className="text-red-500">
        {errors.email}
      </p>
    );
  }
};
export const PhoneNumberErrorMessage = ({ errors, touched }: BookingInformationInput) => {
  if (touched.phoneNumber && errors.phoneNumber) {
    return (
      <p data-cy="Phonenumber-Error-Message" className="text-red-500">
        {errors.phoneNumber}
      </p>
    );
  }
};
export const CardNameErrorMessage = ({ errors, touched }: ErrorMessageType) => {
  if (touched.cardName && errors.cardName) {
    return (
      <p data-cy="CardName-Error-Message" className="text-red-500">
        {errors.cardName}
      </p>
    );
  }
};
export const CardNumberErrorMessage = ({ errors, touched }: ErrorMessageType) => {
  if (touched.cardNumber && errors.cardNumber) {
    return (
      <p data-cy="CardNumber-Error-Message" className="text-red-500">
        {errors.cardNumber}
      </p>
    );
  }
};
export const ExpirationDateErrorMessage = ({ errors, touched }: ErrorMessageType) => {
  if (touched.ExpirationDate && errors.ExpirationDate) {
    return (
      <p data-cy="ExpirationDate-Error-Message" className="text-red-500">
        {errors.ExpirationDate}
      </p>
    );
  }
};
export const SecurityCodeErrorMessage = ({ errors, touched }: ErrorMessageType) => {
  if (touched.securityCode && errors.securityCode) {
    return (
      <p data-cy="SecurityCode-Error-Message" className="text-red-500">
        {errors.securityCode}
      </p>
    );
  }
};
export const CardCountry = ({ errors, touched }: ErrorMessageType) => {
  if (touched.country && errors.country) {
    return (
      <p data-cy="Country-Error-Message" className="text-red-500">
        {errors.country}
      </p>
    );
  }
};
