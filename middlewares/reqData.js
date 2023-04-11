const reqDetails = (req, res, next) => {
  const method = req.method;
  const url = req.url;
  const time = new Date().toUTCString();
  const params = req.params;
  const query = req.query;
  const body = req.body;
  console.log({ time, method, url, body, params, query });
  next();
};

module.exports = reqDetails;
