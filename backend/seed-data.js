const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Starting to seed the database...');

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.upsert({
      where: { email: 'demo@author.com' },
      update: {},
      create: {
        email: 'demo@author.com',
        username: 'demo_author',
        password: hashedPassword,
        firstName: 'Demo',
        lastName: 'Author'
      }
    });

    console.log('✅ User created:', user.email);

    // Create sample books
    const books = await Promise.all([
      prisma.book.upsert({
        where: { id: 'book1' },
        update: {},
        create: {
          id: 'book1',
          title: 'The Art of Storytelling',
          isbn: '978-1234567890',
          description: 'A comprehensive guide to crafting compelling narratives that captivate readers.',
          publishedAt: new Date('2023-01-15'),
          userId: user.id
        }
      }),
      prisma.book.upsert({
        where: { id: 'book2' },
        update: {},
        create: {
          id: 'book2',
          title: 'Digital Marketing for Authors',
          isbn: '978-0987654321',
          description: 'Learn how to effectively market your books in the digital age.',
          publishedAt: new Date('2023-06-20'),
          userId: user.id
        }
      }),
      prisma.book.upsert({
        where: { id: 'book3' },
        update: {},
        create: {
          id: 'book3',
          title: 'Self-Publishing Success',
          isbn: '978-1122334455',
          description: 'A step-by-step guide to successful self-publishing.',
          publishedAt: new Date('2024-01-10'),
          userId: user.id
        }
      })
    ]);

    console.log('✅ Books created:', books.length);

    // Create sample sales data
    const salesData = [
      // January 2024
      { bookId: 'book1', date: '2024-01-05', units: 12, revenue: 59.88, royalty: 20.96, platform: 'Amazon KDP' },
      { bookId: 'book1', date: '2024-01-12', units: 8, revenue: 39.92, royalty: 13.97, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-01-15', units: 5, revenue: 24.95, royalty: 8.73, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-01-20', units: 15, revenue: 74.85, royalty: 26.20, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-01-25', units: 3, revenue: 14.97, royalty: 5.24, platform: 'BookBaby' },

      // February 2024
      { bookId: 'book1', date: '2024-02-03', units: 18, revenue: 89.82, royalty: 31.44, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-02-08', units: 7, revenue: 34.93, royalty: 12.23, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-02-14', units: 22, revenue: 109.78, royalty: 38.42, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-02-18', units: 6, revenue: 29.94, royalty: 10.48, platform: 'BookBaby' },
      { bookId: 'book2', date: '2024-02-22', units: 4, revenue: 19.96, royalty: 6.99, platform: 'IngramSpark' },

      // March 2024
      { bookId: 'book1', date: '2024-03-05', units: 25, revenue: 124.75, royalty: 43.66, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-03-10', units: 9, revenue: 44.91, royalty: 15.72, platform: 'Gumroad' },
      { bookId: 'book3', date: '2024-03-15', units: 8, revenue: 39.92, royalty: 13.97, platform: 'BookBaby' },
      { bookId: 'book1', date: '2024-03-20', units: 16, revenue: 79.84, royalty: 27.94, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-03-25', units: 6, revenue: 29.94, royalty: 10.48, platform: 'IngramSpark' },

      // April 2024
      { bookId: 'book1', date: '2024-04-02', units: 20, revenue: 99.80, royalty: 34.93, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-04-08', units: 12, revenue: 59.88, royalty: 20.96, platform: 'BookBaby' },
      { bookId: 'book2', date: '2024-04-12', units: 8, revenue: 39.92, royalty: 13.97, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-04-18', units: 14, revenue: 69.86, royalty: 24.45, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-04-25', units: 5, revenue: 24.95, royalty: 8.73, platform: 'IngramSpark' },

      // May 2024
      { bookId: 'book1', date: '2024-05-05', units: 30, revenue: 149.70, royalty: 52.40, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-05-10', units: 15, revenue: 74.85, royalty: 26.20, platform: 'BookBaby' },
      { bookId: 'book2', date: '2024-05-15', units: 11, revenue: 54.89, royalty: 19.21, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-05-20', units: 18, revenue: 89.82, royalty: 31.44, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-05-25', units: 7, revenue: 34.93, royalty: 12.23, platform: 'IngramSpark' },

      // June 2024
      { bookId: 'book1', date: '2024-06-03', units: 35, revenue: 174.65, royalty: 61.13, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-06-08', units: 20, revenue: 99.80, royalty: 34.93, platform: 'BookBaby' },
      { bookId: 'book2', date: '2024-06-12', units: 13, revenue: 64.87, royalty: 22.70, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-06-18', units: 22, revenue: 109.78, royalty: 38.42, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-06-25', units: 9, revenue: 44.91, royalty: 15.72, platform: 'IngramSpark' },

      // July 2024
      { bookId: 'book1', date: '2024-07-05', units: 28, revenue: 139.72, royalty: 48.90, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-07-10', units: 18, revenue: 89.82, royalty: 31.44, platform: 'BookBaby' },
      { bookId: 'book2', date: '2024-07-15', units: 12, revenue: 59.88, royalty: 20.96, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-07-20', units: 25, revenue: 124.75, royalty: 43.66, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-07-25', units: 8, revenue: 39.92, royalty: 13.97, platform: 'IngramSpark' },

      // August 2024
      { bookId: 'book1', date: '2024-08-02', units: 32, revenue: 159.68, royalty: 55.89, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-08-08', units: 22, revenue: 109.78, royalty: 38.42, platform: 'BookBaby' },
      { bookId: 'book2', date: '2024-08-12', units: 15, revenue: 74.85, royalty: 26.20, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-08-18', units: 26, revenue: 129.74, royalty: 45.41, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-08-25', units: 10, revenue: 49.90, royalty: 17.47, platform: 'IngramSpark' },

      // September 2024
      { bookId: 'book1', date: '2024-09-05', units: 38, revenue: 189.62, royalty: 66.37, platform: 'Amazon KDP' },
      { bookId: 'book3', date: '2024-09-10', units: 25, revenue: 124.75, royalty: 43.66, platform: 'BookBaby' },
      { bookId: 'book2', date: '2024-09-15', units: 17, revenue: 84.83, royalty: 29.69, platform: 'Gumroad' },
      { bookId: 'book1', date: '2024-09-20', units: 29, revenue: 144.71, royalty: 50.65, platform: 'Amazon KDP' },
      { bookId: 'book2', date: '2024-09-25', units: 12, revenue: 59.88, royalty: 20.96, platform: 'IngramSpark' }
    ];

    // Clear existing sales for this user
    await prisma.sale.deleteMany({
      where: {
        book: {
          userId: user.id
        }
      }
    });

    // Create sales records
    const sales = await Promise.all(
      salesData.map(sale => 
        prisma.sale.create({
          data: {
            bookId: sale.bookId,
            date: new Date(sale.date),
            units: sale.units,
            revenue: sale.revenue,
            royalty: sale.royalty,
            platform: sale.platform
          }
        })
      )
    );

    console.log('✅ Sales data created:', sales.length, 'records');

    // Calculate totals
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0);
    const totalRoyalty = salesData.reduce((sum, sale) => sum + sale.royalty, 0);
    const totalUnits = salesData.reduce((sum, sale) => sum + sale.units, 0);

    console.log('\n📊 Sample Data Summary:');
    console.log('📚 Books:', books.length);
    console.log('💰 Total Revenue: $' + totalRevenue.toFixed(2));
    console.log('💵 Total Royalty: $' + totalRoyalty.toFixed(2));
    console.log('📖 Total Units Sold:', totalUnits);
    console.log('📈 Total Sales Records:', sales.length);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n🔑 Demo Login Credentials:');
    console.log('Email: demo@author.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
