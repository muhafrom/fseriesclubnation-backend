const Part = require('../models/Part');
const { upload } = require('../services/s3Service');

const createPart = async (req, res) => {
  const { title, description, url } = req.body;
  const image = req.file ? req.file.location : null;
  try {
    const part = await Part.create({ title, description, url, image });
    res.status(201).send(part);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getParts = async (req, res) => {
  try {
    const parts = await Part.findAll();
    res.status(200).send(parts);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updatePart = async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const image = req.file ? req.file.location : null;

  try {
    const part = await Part.findByPk(id);
    if (!part) return res.status(404).send('Part not found.');

    if (title !== undefined) part.title = title;
    if (description !== undefined) part.description = description;
    if (url !== undefined) part.url = url;
    if (image !== null) part.image = image;

    await part.save();
    res.status(200).send(part);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deletePart = async (req, res) => {
  const { id } = req.params;
  try {
    const part = await Part.findByPk(id);
    if (!part) return res.status(404).send('Part not found.');
    await part.destroy();
    res.status(200).send('Part deleted successfully.');
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createPart, getParts, updatePart, deletePart };