const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    const err = new Error("Not authenticated");
    err.status = 401;
    return next(err);
  }
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    next(err);
  }
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    const err = new Error("You don't have permission");
    err.status = 403;
    return next(err);
  }
  next();
};