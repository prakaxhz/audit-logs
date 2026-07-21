const validate = (schema, source = "body") => {
    return async (req, res, next) => {
        try {
            req.validatedData = await schema.parseAsync(req[source]);
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validate;