const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Upload and parse CSV file
router.post('/csv', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const { bookId, platform } = req.body;

    if (!bookId || !platform) {
      return res.status(400).json({ 
        message: 'Book ID and platform are required' 
      });
    }

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

    const results = [];
    const errors = [];

    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Validate and transform row data
            const saleData = {
              date: new Date(row.date || row.Date || row.sale_date),
              units: parseInt(row.units || row.Units || row.quantity || row.Quantity || 1),
              revenue: parseFloat(row.revenue || row.Revenue || row.price || row.Price || 0),
              royalty: parseFloat(row.royalty || row.Royalty || row.earnings || row.Earnings || 0),
              platform: platform
            };

            // Validate required fields
            if (isNaN(saleData.date.getTime())) {
              errors.push(`Invalid date: ${row.date || row.Date || row.sale_date}`);
              return;
            }

            if (isNaN(saleData.units) || saleData.units < 0) {
              errors.push(`Invalid units: ${row.units || row.Units || row.quantity || row.Quantity}`);
              return;
            }

            if (isNaN(saleData.revenue) || saleData.revenue < 0) {
              errors.push(`Invalid revenue: ${row.revenue || row.Revenue || row.price || row.Price}`);
              return;
            }

            if (isNaN(saleData.royalty) || saleData.royalty < 0) {
              errors.push(`Invalid royalty: ${row.royalty || row.Royalty || row.earnings || row.Earnings}`);
              return;
            }

            results.push(saleData);
          } catch (error) {
            errors.push(`Error processing row: ${error.message}`);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (results.length === 0) {
      return res.status(400).json({ 
        message: 'No valid sales data found in CSV file',
        errors 
      });
    }

    // Insert sales data into database
    const createdSales = [];
    for (const saleData of results) {
      try {
        const sale = await prisma.sale.create({
          data: {
            bookId,
            date: saleData.date,
            units: saleData.units,
            revenue: saleData.revenue,
            royalty: saleData.royalty,
            platform: saleData.platform
          }
        });
        createdSales.push(sale);
      } catch (error) {
        errors.push(`Failed to create sale record: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'CSV file processed successfully',
      summary: {
        totalRows: results.length,
        createdSales: createdSales.length,
        errors: errors.length
      },
      sales: createdSales,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('CSV upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: 'Failed to process CSV file' });
  }
});

// Get CSV template
router.get('/template', (req, res) => {
  const template = [
    'date,units,revenue,royalty',
    '2024-01-15,5,24.99,8.75',
    '2024-01-20,3,14.99,5.25',
    '2024-02-01,8,39.99,14.00'
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sales_template.csv"');
  res.send(template);
});

// Get supported platforms
router.get('/platforms', (req, res) => {
  const platforms = [
    'Amazon KDP',
    'Gumroad',
    'BookBaby',
    'IngramSpark',
    'Draft2Digital',
    'Smashwords',
    'Apple Books',
    'Google Play Books',
    'Kobo',
    'Barnes & Noble',
    'Other'
  ];

  res.json({ platforms });
});

module.exports = router;
