import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser";
import { api } from "./index";

export const getWebAuthRegisterOptions = async (username: string) => {
  return (
    await api.post("auth/register/options", {
      username,
    })
  ).data;
};

export const verifyWebAuthRegistration = async (
  username: string,
  options: RegistrationResponseJSON
) => {
  return (await api.post(`auth/register/verify/${username}`, options)).data;
};

export const startWebAuthRegistration = async (username: string) => {
  const optionsJSON = await getWebAuthRegisterOptions(username);
  const response = await startRegistration({ optionsJSON });
  return await verifyWebAuthRegistration(username, response);
};

export const generateAuthenticationOptions = async (username: string) => {
  return (await api.post("auth/authenticate/options", { username })).data;
};

export const verifyAuthentication = async (
  username: string,
  options: AuthenticationResponseJSON
) => {
  return (await api.post(`auth/authenticate/verify/${username}`, options)).data;
};

export const startWebAuthAuthentication = async (username: string) => {
  const optionsJSON = await generateAuthenticationOptions(username);
  const response = await startAuthentication({ optionsJSON });
  return verifyAuthentication(username, response);
};
