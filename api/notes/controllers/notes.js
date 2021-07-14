
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
   * Create a record.
   *
   * @return {Object}
   */

     async create(ctx) {
      let entity;
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        data.user = ctx.state.user.id;
        entity = await strapi.services.notes.create(data, { files });
      } else {
        ctx.request.body.user = ctx.state.user.id;
        entity = await strapi.services.notes.create(ctx.request.body);
      }
      //console.log(ctx)
      return sanitizeEntity(entity, { model: strapi.models.notes });
    },


    /**
* List all the categories beloinging to the requesting user
*
* @param {*} ctx the request context
*/
 
async find(ctx) {
let entities;
 
if (ctx.query._q) {
entities = await strapi.services.notes.search({
...ctx.query,
'user.id': ctx.state.user.id
});
} else {
entities = await strapi.services.notes.find({
...ctx.query,
'user.id': ctx.state.user.id
});
}

//console.log(ctx)
 
return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.notes}));
 
},

async update(ctx) {
  const { id } = ctx.params;

  let entity;
  if (ctx.is('multipart')) {
    const { data, files } = parseMultipartData(ctx);
    entity = await strapi.services.notes.update({ id }, data, {
      files,
    });
  } else {
    entity = await strapi.services.notes.update({ id }, ctx.request.body);
  }

  return sanitizeEntity(entity, { model: strapi.models.notes });
},

async delete(ctx) {
  const { id } = ctx.params;

  const entity = await strapi.services.notes.delete({ id });
  return sanitizeEntity(entity, { model: strapi.models.notes });
},

};
