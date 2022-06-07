import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FocusActivityContextType, IFocusActivity } from '../@types/focus-activity';
import { clearFocusMode, clearTokens, restoreFocusMode, saveFocusMode } from '../utilities/Storage';

const FocusActivityContext = React.createContext<FocusActivityContextType | null>(null);

const FocusActivityContextProvider = ({ children }: any) => {
  const history = useHistory();
  const [focusActivity, setFocusActivity] = useState<IFocusActivity | null>(restoreFocusMode());

  const activate = (focusActivity: IFocusActivity) => {
    console.log("activating ...");
    setFocusActivity(focusActivity);
    saveFocusMode(focusActivity);
  };

  const deactivate = async () => {
    console.log('deactivating ...');

    await axios.post(`${process.env.REACT_APP_API_URI}/lti/grade`, {
      game: focusActivity?.gameId,
      challenge: focusActivity?.challengeId,
      activity: focusActivity?.activityId,
    }, {
      headers: {
        Authorization: `Bearer ${focusActivity?.ltik}`
      }
    });

    setFocusActivity(null);
    clearFocusMode();
    clearTokens();

    history.replace('/');

    window.close();
  };

  useEffect(() => {
    if (focusActivity && focusActivity.gameId && focusActivity.challengeId) {
      let toPath = `/game/${focusActivity.gameId}/challenge/${focusActivity.challengeId}`;
      if (focusActivity.activityId) {
        toPath += `/${focusActivity.activityId}`;
      }
      history.push(toPath)
    }
  }, [focusActivity, history]);

  return (
    <FocusActivityContext.Provider value={{ focusActivity, activate, deactivate }}>
      {children}
    </FocusActivityContext.Provider>
  );
};

export { FocusActivityContext, FocusActivityContextProvider };
