const sendResponse = (res, statusCode, status, data = null, message = null) => {
  // Create a response object with the status
  const response = { status };

  // Add data to the response object if provided
  if (data) response.data = data;

  // Add message to the response object if provided
  if (message) response.message = message;

  // Send the JSON response with the specified status code
  res.status(statusCode).json(response);
};

module.exports = sendResponse;
