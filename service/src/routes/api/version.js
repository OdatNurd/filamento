/******************************************************************************/


export const $get = async (ctx) => {
  return ctx.json({
    "version": process.env.VERSION ,
    "date": process.env.BUILD_DATE,
    "environment": process.env.BUILD_ENV,
  });
}


/******************************************************************************/
