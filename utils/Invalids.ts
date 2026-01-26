import { computed } from "vue";

export const isEmailValid = (email: string): boolean => {
  if (!email || email.trim() === "") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isPhoneNumberValid = (phoneNumber: string): boolean => {
  if (!phoneNumber || phoneNumber.trim() === "") return false;
  
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phoneNumber.trim());
};
