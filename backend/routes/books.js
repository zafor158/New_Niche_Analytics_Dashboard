const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { validateBook } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Get all books for the authenticated user
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { sales: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// Get a specific book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        sales: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Failed to fetch book' });
  }
});

// Create a new book
router.post('/', validateBook, async (req, res) => {
  try {
    const { title, isbn, description, coverImage, publishedAt } = req.body;


    const book = await prisma.book.create({
      data: {
        title,
        isbn: isbn || null,
        description: description || null,
        coverImage: coverImage || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
});

// Update a book
router.put('/:id', validateBook, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isbn, description, coverImage, publishedAt } = req.body;

    // Check if book exists and belongs to user
    const existingBook = await prisma.book.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        isbn,
        description,
        coverImage,
        publishedAt: publishedAt ? new Date(publishedAt) : null
      }
    });

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists and belongs to user
    const existingBook = await prisma.book.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete book (sales will be deleted due to cascade)
    await prisma.book.delete({
      where: { id }
    });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

// Get book statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists and belongs to user
    const book = await prisma.book.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get sales statistics
    const sales = await prisma.sale.findMany({
      where: { bookId: id },
      select: {
        date: true,
        units: true,
        revenue: true,
        royalty: true,
        platform: true
      }
    });

    // Calculate statistics
    const totalUnits = sales.reduce((sum, sale) => sum + sale.units, 0);
    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.revenue), 0);
    const totalRoyalty = sales.reduce((sum, sale) => sum + parseFloat(sale.royalty), 0);

    // Group by platform
    const platformStats = sales.reduce((acc, sale) => {
      if (!acc[sale.platform]) {
        acc[sale.platform] = { units: 0, revenue: 0, royalty: 0 };
      }
      acc[sale.platform].units += sale.units;
      acc[sale.platform].revenue += parseFloat(sale.revenue);
      acc[sale.platform].royalty += parseFloat(sale.royalty);
      return acc;
    }, {});

    // Group by month
    const monthlyStats = sales.reduce((acc, sale) => {
      const month = sale.date.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { units: 0, revenue: 0, royalty: 0 };
      }
      acc[month].units += sale.units;
      acc[month].revenue += parseFloat(sale.revenue);
      acc[month].royalty += parseFloat(sale.royalty);
      return acc;
    }, {});

    res.json({
      book: {
        id: book.id,
        title: book.title
      },
      stats: {
        totalSales: sales.length,
        totalUnits,
        totalRevenue,
        totalRoyalty,
        platformStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get book stats error:', error);
    res.status(500).json({ message: 'Failed to fetch book statistics' });
  }
});

module.exports = router;
