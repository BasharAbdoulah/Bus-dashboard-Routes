import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { startLogout } from "redux/auth/action";
const useFetch = (
  url = "",
  method = "post",
  params = {},
  immediate = true,
  headers = {},
  token = true
) => {
  const dispatch = useDispatch();

  const states = useSelector((state) => state.auth);

  // states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const source = axios.CancelToken.source();

  // useCallBack for post submit ..
  const executeFetch = useCallback(
    async (data) => {
      setLoading(true);
      setData(null);
      setError(null);
      try {
        const { data: response } = await axios({
          method: method,
          url: url,
          data: {
            ...params,
            ...data,
          },
          headers: {
            ...headers,
            lang: "en",
            Authorization: `Bearer ${states.token}`,
          },
          timeout: 1000 * 10, // wait to 10 seconds for response or cancel the request ..
        });
        setLoading(false);
        if (response.status === true) {
          setData(response); // setting incomed data here
        } else {
          setError(response?.description); // setting error here
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(startLogout());
        }
      }
    },
    [url, method, params, headers, token]
  );

  // useEffects
  useEffect(async () => {
    if (immediate) {
      immediate = false;
      executeFetch();
    }
    return () => {
      source.cancel(); // clear axios when this hook unmounted
    };
  }, [immediate]);

  return { data, loading, error, executeFetch };
};

export default useFetch;
