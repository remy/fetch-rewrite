if (typeof fetch === 'undefined') {
  console.warn('fetch is not defined on the global scope');
}

export default function rewriteFetch(rules) {
  const $_fetch = fetch;

  // modify the global
  fetch = async (url, options = {}) => {
    const matched = rules.find((item) => {
      let { url: _url, query } = item;

      if (typeof url === 'string') {
        if (typeof window !== 'undefined') {
          url = new URL(url, window.location.origin);
        } else {
          url = new URL(url);
        }
      }

      if (url.pathname !== _url) return false;

      // if there's no query, then we match all on the url
      if (!query) return true;

      const searchParams = url.search.substring(1);

      if (typeof query === 'string') {
        // test after the "?" and then do a full match
        return query === searchParams;
      }

      if (query instanceof RegExp) {
        return query.test(searchParams);
      }

      // unsupported
      return false;
    });

    const res = await $_fetch(url, options);

    if (!matched) {
      return res;
    } else if (!matched.rewrite) {
      return res;
    }

    const { rewrite } = matched;

    const rewrites = {};
    for (let key in rewrite) {
      if (key in res) {
        // create a bound backup of the original function
        rewrites[key] = res[key].bind(res);

        // overwrite the original function with our own
        res[key] = (...args) =>
          rewrites[key](...args).then((res) => {
            try {
              return rewrite[key](res);
            } catch (e) {
              // silently fail
              console.warn(`rewrite function (${key}) failed`, e);
              return res;
            }
          });
      }
    }

    return res;
  };

  return fetch;
}
