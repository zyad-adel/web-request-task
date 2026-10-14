module.exports = (err, req, res, next) => {
 
  if (err.code === "23505") {
    return res.status(409).json({ success: false, message: "Email already exists" });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.status ? err.message : "Internal server error",
  });
};