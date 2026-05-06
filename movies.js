const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET /api/movies - Fetch all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// POST /api/movies - Add a new movie
router.post('/', async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// GET /api/movies/:id - Get one movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// PUT /api/movies/:id - Update movie details
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// DELETE /api/movies/:id - Delete a movie
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, message: `"${movie.title}" deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

module.exports = router;
