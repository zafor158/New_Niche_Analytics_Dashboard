const express = require('express');
const { PrismaClient, Prisma } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { validateSale } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Get all sales for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { bookId, platform, startDate, endDate, limit = 100, offset = 0 } = req.query;

    const whereClause = {
      book: {
        userId: req.user.id
      }
    };

    if (bookId) {
      whereClause.bookId = bookId;
    }

    if (platform) {
      whereClause.platform = platform;
    }

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const totalCount = await prisma.sale.count({
      where: whereClause
    });

    res.json({
      sales,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: totalCount > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Failed to fetch sales' });
  }
});

// Get a specific sale by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findFirst({
      where: {
        id,
        book: {
          userId: req.user.id
        }
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json({ sale });
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({ message: 'Failed to fetch sale' });
  }
});

// Create a new sale
router.post('/', validateSale, async (req, res) => {
  try {
    const { bookId, date, units, revenue, royalty, platform } = req.body;

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
        userId: req.user.id
      }
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const sale = await prisma.sale.create({
      data: {
        bookId,
        date: new Date(date),
        units: parseInt(units),
        revenue: parseFloat(revenue),
        royalty: parseFloat(royalty),
        platform
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Sale created successfully',
      sale
    });
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ message: 'Failed to create sale' });
  }
});

// Update a sale
router.put('/:id', validateSale, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, units, revenue, royalty, platform } = req.body;

    // Check if sale exists and belongs to user
    const existingSale = await prisma.sale.findFirst({
      where: {
        id,
        book: {
          userId: req.user.id
        }
      }
    });

    if (!existingSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const sale = await prisma.sale.update({
      where: { id },
      data: {
        date: new Date(date),
        units: parseInt(units),
        revenue: parseFloat(revenue),
        royalty: parseFloat(royalty),
        platform
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      message: 'Sale updated successfully',
      sale
    });
  } catch (error) {
    console.error('Update sale error:', error);
    res.status(500).json({ message: 'Failed to update sale' });
  }
});

// Delete a sale
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if sale exists and belongs to user
    const existingSale = await prisma.sale.findFirst({
      where: {
        id,
        book: {
          userId: req.user.id
        }
      }
    });

    if (!existingSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    await prisma.sale.delete({
      where: { id }
    });

    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Delete sale error:', error);
    res.status(500).json({ message: 'Failed to delete sale' });
  }
});

// Get sales analytics
router.get('/analytics/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {
      book: {
        userId: req.user.id
      }
    };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    }

    // Get total statistics
    const totalStats = await prisma.sale.aggregate({
      where: whereClause,
      _sum: {
        units: true,
        revenue: true,
        royalty: true
      },
      _count: {
        id: true
      }
    });

    // Get platform breakdown
    const platformStats = await prisma.sale.groupBy({
      by: ['platform'],
      where: whereClause,
      _sum: {
        units: true,
        revenue: true,
        royalty: true
      },
      _count: {
        id: true
      }
    });

    // Get monthly breakdown using Prisma aggregation instead of raw SQL
    const monthlyStats = await prisma.sale.groupBy({
      by: ['date'],
      where: {
        book: {
          userId: req.user.id
        },
        ...(startDate && { date: { gte: new Date(startDate) } }),
        ...(endDate && { date: { lte: new Date(endDate) } })
      },
      _sum: {
        units: true,
        revenue: true,
        royalty: true
      },
      _count: {
        id: true
      }
    });

    // Group by month
    const monthlyData = monthlyStats.reduce((acc, sale) => {
      const month = sale.date.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          month: new Date(month + '-01'),
          total_units: 0,
          total_revenue: 0,
          total_royalty: 0,
          total_sales: 0
        };
      }
      acc[month].total_units += sale._sum.units || 0;
      acc[month].total_revenue += parseFloat(sale._sum.revenue || 0);
      acc[month].total_royalty += parseFloat(sale._sum.royalty || 0);
      acc[month].total_sales += sale._count.id || 0;
      return acc;
    }, {});

    const monthlyStatsFormatted = Object.values(monthlyData).sort((a, b) => b.month - a.month);

    res.json({
      overview: {
        totalSales: totalStats._count.id || 0,
        totalUnits: totalStats._sum.units || 0,
        totalRevenue: totalStats._sum.revenue || 0,
        totalRoyalty: totalStats._sum.royalty || 0
      },
      platformBreakdown: platformStats,
      monthlyBreakdown: monthlyStatsFormatted
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;
