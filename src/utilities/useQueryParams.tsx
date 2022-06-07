import { useState, useEffect } from "react";

const getQueryParams = <T extends object>(): Partial<T> => {
  // server side rendering
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);

  return new Proxy(params, {
    get(target, prop, receiver) {
      return target.get(prop as string) || undefined;
    },
  }) as T;
};

const useQueryParams = <T extends object = any>(): Partial<T> => {
  const [queryParams, setQueryParams] = useState(getQueryParams());

  const str = typeof window === "undefined"
    ? "once"
    : window.location.search;
  useEffect(() => {
    setQueryParams(getQueryParams());
  }, [str]);

  return queryParams;
};

export default useQueryParams;
