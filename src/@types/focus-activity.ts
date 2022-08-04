export interface IFocusActivity {
  ltik: string;
  gameId: string;
  challengeId: string;
  activityId?: string | null;
}

export type FocusActivityContextType = {
  focusActivity: IFocusActivity | null;
  activate: (focusActivity: IFocusActivity) => void;
  deactivate: () => Promise<void>;
};
