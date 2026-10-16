const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors ? error.errors.map((e) => e.message) : error.message,
      });
    }
  };
};

module.exports = validate;
