export const notFoundRoutesHandling = (req, res, next) => {
  res.status(404).json({
    message: "The requested resource was not found on this server.",
  });
  res.end();
  return;
};
