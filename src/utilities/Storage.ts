import { IFocusActivity } from '../@types/focus-activity';

/* AUTH TOKENS */

export const storeTokens = (token?: string, idToken?: string, refreshToken?: string): void => {
  localStorage.setItem('FGPE_TOKEN', token ?? '');
  localStorage.setItem('FGPE_REFRESH_TOKEN', refreshToken ?? '');
  localStorage.setItem('FGPE_ID_TOKEN', idToken ?? '');
};

export const restoreTokens = (): { token?: string; idToken?: string; refreshToken?: string; } => {
  return {
    token: localStorage.getItem('FGPE_TOKEN') || undefined,
    refreshToken: localStorage.getItem('FGPE_REFRESH_TOKEN') || undefined,
    idToken: localStorage.getItem('FGPE_ID_TOKEN') || undefined,
  };
};

export const clearTokens = (): void => {
  localStorage.removeItem('FGPE_TOKEN');
  localStorage.removeItem('FGPE_REFRESH_TOKEN');
  localStorage.removeItem('FGPE_ID_TOKEN');
};

/* FOCUS MODE */

export const saveFocusMode = (focusActivity: IFocusActivity) => {
  if (focusActivity) {
    sessionStorage.setItem('FGPE_FOCUS_ACTIVITY', JSON.stringify(focusActivity));
  } else {
    sessionStorage.removeItem('FGPE_FOCUS_ACTIVITY');
  }
};

export const restoreFocusMode = (): IFocusActivity | null => {
  const focusActivity = sessionStorage.getItem('FGPE_FOCUS_ACTIVITY');
  if (focusActivity) {
    return JSON.parse(focusActivity);
  }
  return null;
};

export const clearFocusMode = (): void => {
  sessionStorage.removeItem('FGPE_FOCUS_ACTIVITY');
};
