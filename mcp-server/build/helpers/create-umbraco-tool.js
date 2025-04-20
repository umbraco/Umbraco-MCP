export const CreateUmbracoTool = (name, description, schema, handler) => () => ({
    name: name,
    description: description,
    schema: schema,
    handler: handler,
});
