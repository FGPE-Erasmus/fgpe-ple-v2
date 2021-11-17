import { FindChallenge_programmingLanguages } from "../../../generated/FindChallenge";
import Cookies from "js-cookie";

const DEFAULT_PROGRAMMING_LANGUAGE_COOKIE = "programmingLanguage";

export const getDefaultProgrammingLangOrFirstFromArray = (
  availableProgrammingLanguages: FindChallenge_programmingLanguages[],
  gameId: string
) => {
  const userDefaultLanguageLocalStorage = Cookies.get(
    DEFAULT_PROGRAMMING_LANGUAGE_COOKIE + gameId
  );

  if (userDefaultLanguageLocalStorage) {
    const userDefaultLanguage = JSON.parse(userDefaultLanguageLocalStorage);

    const isAvailable = availableProgrammingLanguages.some(
      (lang) => lang.id === userDefaultLanguage.id
    );

    if (isAvailable) {
      return userDefaultLanguage;
    } else {
      return availableProgrammingLanguages[0];
    }
  } else {
    return availableProgrammingLanguages[0];
  }
};

export const setDefaultProgrammingLanguage = (
  language: FindChallenge_programmingLanguages,
  gameId: string
) => {
  Cookies.set(
    DEFAULT_PROGRAMMING_LANGUAGE_COOKIE + gameId,
    JSON.stringify(language),
    {
      expires: 30,
    }
  );
};
