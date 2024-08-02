const sendResponse = (res, statusCode, status, data = null, message = null) => {
  const response = { status };

  if (data) response.data = data;
  if (message) response.message = message;

  res.status(statusCode).json(response);
};

module.exports = sendResponse;
