import { FindChallenge_programmingLanguages } from "../../../generated/FindChallenge";

const DEFAULT_PROGRAMMING_LANGUAGE_LOCALSTORAGE = "programmingLanguage";

export const getDefaultProgrammingLangOrFirstFromArray = (
  availableProgrammingLanguages: FindChallenge_programmingLanguages[]
) => {
  const userDefaultLanguageLocalStorage = localStorage.getItem(
    DEFAULT_PROGRAMMING_LANGUAGE_LOCALSTORAGE
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
  language: FindChallenge_programmingLanguages
) => {
  localStorage.setItem(
    DEFAULT_PROGRAMMING_LANGUAGE_LOCALSTORAGE,
    JSON.stringify(language)
  );
};
