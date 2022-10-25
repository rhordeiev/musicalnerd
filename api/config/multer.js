const multer = require('multer');

const storage = multer.diskStorage({});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const acceptedTypes = file.mimetype.split('/');
    if (acceptedTypes[0] === 'image') {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Файл повинен бути зображенням'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = upload;
