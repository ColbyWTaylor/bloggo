import { useState, useEffect } from "react";

const useFetch = (url) => {
  const abortCont = new AbortController();

  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  // npx json-server --watch data/db.json --port 8000  <<<< in new port to avoid conflict with port running node
  useEffect(() => {
    setTimeout(() => {
      fetch(url, { signal: abortCont.signal })
        .then((res) => {
          if (!res.ok) {
            throw Error("could not fetch data for source");
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("fetch aborted");
          } else {
            setIsPending(false);
            setError(err.message);
          }
        });
    }, 1000);

    return () => abortCont.abort();
  }, []);

  return { data, isPending, error };
};

export default useFetch;
