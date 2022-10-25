const cloudinary = require('../config/cloudinary');

exports.upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({ data: result.secure_url });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Файл повинен бути зображенням та менше 2 Мб' });
  }
};

exports.remove = async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.avatar);
    res.status(200).json({ data: 'OK' });
  } catch (err) {
    res.status(500).json({ error: 'Файлу не знайдено' });
  }
};

exports.get = async (req, res) => {
  const dirArray = __dirname.split('\\');
  dirArray.pop();
  const dir = dirArray.join('\\');
  try {
    res.status(200).sendFile(`${dir}/public/images/${req.params.avatar}`);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
