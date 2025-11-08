import Media from '../models/Media.js';

export const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newMedia = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/media/${req.file.filename}`,
      user: req.user.userId 
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: newMedia,
    });
  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({ message: 'An error occurred during the upload' });
  }
};

export const list = async (req, res) => {
  try {
    const userMedia = await Media.find({ user: req.user.userId });
    res.json(userMedia);
  } catch (error) {
    console.error('List media error:', error);
    res.status(500).json({ message: 'Failed to list media' });
  }
};

export const listByUser = async (req, res) => {
  try {
    const userMedia = await Media.find({ user: req.params.userId });
    res.json(userMedia);
  } catch (error) {
    console.error('List media by user error:', error);
    res.status(500).json({ message: 'Failed to list media for user' });
  }
};