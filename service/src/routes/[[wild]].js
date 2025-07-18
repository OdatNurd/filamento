/******************************************************************************/


/* For unknown reasons at the moment, SPA routing with static assets does not
 * seem to work as one would expect; hits for things that are not actual static
 * files and are not routes, like "/app/spools" are supposed to serve the the
 * index, but they don't.
 *
 * This catch-all route hits all such items and sends back the index file
 * instead of a 404. */
export const $get = async (ctx) => {
  const url = new URL(ctx.req.url);
  url.pathname = '/';

  return fetch(url);
}


/******************************************************************************/
