// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ errors: messages });
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `이미 사용 중인 ${field} '${value}'입니다. 다른 ${field}을 입력하세요.`;
    return res.status(400).json({ message });
  }

  res.status(500).json({ message: err.message });
};

export default errorHandler;
