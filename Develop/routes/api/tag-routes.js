const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: {
        model: Product,
        through: ProductTag,
        as: 'products'
      }
    });

    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: {
        model: Product,
        through: ProductTag,
        as: 'products'
      }
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body; 
    const newTag = await Tag.create({ tag_name });

    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const { tag_name } = req.body; // Assuming the request body contains the updated tag information

    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    await tag.update({ tag_name });

    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    await tag.destroy();

    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
