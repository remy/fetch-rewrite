/**
 * @param {string} target
 * @param {string | RegExp} matcher
 * @returns {boolean}
 */
export function eqOrMatch(target, matcher) {
  if (typeof matcher === 'string') {
    if (matcher === '*') {
      return true;
    }

    return matcher === target;
  }

  if (matcher instanceof RegExp) {
    return matcher.test(target);
  }

  return false;
}

/**
 *
 * @param {import("./types").Rules} rules
 * @param {URL} url
 * @param {import("./types").FetchOptions} [options]
 * @returns {import("./types").Rule | false}
 */
export function matcher(rules, url, options = {}) {
  return (
    rules.find((item) => {
      let { path, query, origin, method } = item;

      const tests = [
        [origin, url.origin],
        [method, options.method],
        [path, url.pathname],
        [query, url.search?.substring(1)],
      ];

      for (let [test, target] of tests) {
        if (test && !eqOrMatch(target, test)) {
          return false;
        }
      }

      return true;
    }) || false
  );
}

/**
 * @param {import("./types").Rules} rules
 */
export default function rewriteFetch(rules) {
  const $_fetch = fetch;

  // hacky
  if (!Array.isArray(rules)) {
    rules = [rules];
  }

  // modify the global fetch
  // eslint-disable-next-line no-global-assign
  fetch = async (url, options = {}) => {
    // if we're in a browser, then we can use the location origin
    const execOrigin =
      (typeof window !== 'undefined' && window.location.origin) || undefined;
    if (typeof url === 'string') url = new URL(url, execOrigin);

    // find the first matching rules based on origin, pathname, and query
    const matched = matcher(rules, url, options);

    if (!matched) {
      return $_fetch(url, options);
    }

    if (matched.rewrite) {
      // FIXME add support for rewrite options / modifying the entire request
      if (typeof matched.rewrite === 'function') {
        return matched.rewrite($_fetch, url, options);
      }
      return $_fetch(matched.rewrite, options);
    }

    const { modify } = matched;

    const res = await $_fetch(url, options);

    const rewrites = {};
    for (let key in modify) {
      if (key in res) {
        // create a bound backup of the original function
        rewrites[key] = res[key].bind(res);

        // overwrite the original function with our own
        res[key] = (...args) =>
          rewrites[key](...args).then((res) => {
            try {
              return modify[key](res);
            } catch (e) {
              return res;
            }
          });
      }
    }

    return res;
  };
}
