const Media = require('../models/Media');

const createMedia = async (req, res) => {
  const { title, description, url, image } = req.body;
  try {
    const media = await Media.create({ title, description, url, image });
    res.status(201).send(media);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getMedia = async (req, res) => {
  try {
    const media = await Media.findAll();
    res.status(200).send(media);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateMedia = async (req, res) => {
  const { id } = req.params;
  const { title, description, url, image } = req.body;

  try {
    const media = await Media.findByPk(id);
    if (!media) return res.status(404).send({ error: { messeage: 'Media not found.' } });

    if (title !== undefined) media.title = title;
    if (description !== undefined) media.description = description;
    if (url !== undefined) media.url = url;
    if (image !== null) media.image = image;

    await media.save();
    res.status(200).send(media);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const media = await Media.findByPk(id);
    if (!media) return res.status(404).send({ error: { messeage: 'Media not found.' } });
    await media.destroy();
    res.status(200).send({success: { messeage: 'Media deleted successfully.'} });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createMedia, getMedia, updateMedia, deleteMedia };