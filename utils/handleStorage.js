const multer = require("multer");

const memory = multer.memoryStorage();
const uploadMiddlewareMemory = multer({storage: memory, limits: {fileSize: 5*1024*1024}});

module.exports = { uploadMiddlewareMemory};