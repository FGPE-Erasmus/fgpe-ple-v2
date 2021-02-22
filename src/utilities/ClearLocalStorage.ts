const ClearLocalStorage = () => {
  // Notice change here
  let keys = Object.keys(localStorage);
  let i = keys.length;

  while (i--) {
    if (keys[i].substring(0, 4) === "FGPE") {
      const item = localStorage.getItem(keys[i]);
      if (item) {
        const userData = JSON.parse(item);
        const date1 = new Date();
        const date2 = new Date(userData.time);
        const diff = Math.abs(date1.getTime() - date2.getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

        if (diffDays > 30) {
          localStorage.removeItem(keys[i]);
        }
      }
    }
  }
};

export default ClearLocalStorage;
