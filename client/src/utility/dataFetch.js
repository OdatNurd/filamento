/******************************************************************************/

/*
 * This is a simple wrapper around the native fetch() API to allow for more
 * easily faking responses for canned data, for test purposes.
 *
 * The function behaves as the native fetch() API does, except that it takes
 * additional arguments in its configuration that allow for faking the response.
 *
 * The options can contain the keys "fakeResult", "fakeDelay", and "schema".
 *
 * If the global __CANNED_REQUESTS__ is not set to the string value "true",
 * then this function behaves identically to fetch() in ever regard, with the
 * exception that it logs what it's doing to the console.
 *
 * When __CANNED_REQUESTS__ is set, then instead of carrying out the actual
 * fetch operation, the value in fakeResult is used to formulate the result.
 *
 * When fakeResult is a string, it is assumed to be a URL; the fetch will do a
 * GET fetch to that URL and return the response.
 *
 * For all other values of fakeResult, the value is encoded to a JSON string
 * and a fake response is returns that carries that JSON as a payload. In this
 * case the fakeDelay value indicates how long to wait before this happens; a
 * default of 500ms is applied if this is not set.
 *
 * If a Zod schema is provided in the options, the JSON data will be parsed
 * against it. If validation fails, an error is thrown.
 */
export const dataFetch = async (input, options) => {
  const { fakeResult, fakeDelay, schema, ...fetchOptions } = options || {};

  // Pluck the URL that we're ostensibly being asked to fetch; this is for
  // debug logging.
  const requestURL = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  // First, check if the environment variable is set to use debug mode.
  const isDebug = __CANNED_REQUESTS__ == 'true';

  // A helper to parse and validate the JSON response.
  const parseAndValidate = async response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok for ${requestURL}`);
    }
    const jsonData = await response.json();
    if (schema) {
      try {
        const parsedData = schema.parse(jsonData);
        if (parsedData.success) {
          return parsedData.data;
        }
        throw new Error(`API request failed: ${parsedData.message}`);
      } catch (err) {
        console.error(`Schema validation failed for ${requestURL}:`, err.errors);
        throw new Error(`Schema validation failed: ${err.message}`);
      }
    }
    return jsonData;
  };

  // If debug is not being forced, make the real request now.
  if (isDebug == false) {
    console.log(`[dataFetch] performing REAL fetch for: ${requestURL}`);
    const response = await fetch(input, fetchOptions);
    return parseAndValidate(response);
  }

  // If debug is on, and fakeResult is an object, serve it directly after a delay.
  if (typeof fakeResult !== 'string' && fakeResult != null) {
    const delay = fakeDelay ?? 500;
    console.log(`[dataFetch] faking fetch for ${requestURL} with ${delay}ms delay using static data`);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const response = new Response(JSON.stringify(fakeResult), {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          parseAndValidate(response).then(resolve).catch(reject);
        } catch (err) {
          reject(err);
        }
      }, delay);
    });
  }

  // Otherwise (if debug is on) fetch from the provided URL, which could be
  // the original request or a faked one. This allows for canned JSON files.
  const urlToFetch = typeof fakeResult === 'string' ? fakeResult : requestURL;
  console.log(`[dataFetch] performing DEBUG fetch for ${requestURL} via ${urlToFetch}`);
  const response = await fetch(urlToFetch);
  return parseAndValidate(response);
};

/******************************************************************************/
