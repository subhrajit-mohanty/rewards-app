const bcrypt = require('bcrypt');
const User = require('./models/User');
const Vote = require('./models/Vote');

async function seedDatabase() {
  try {
    // Check if users already exist
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log(`Database already has ${userCount} users. Skipping seed.`);
      return;
    }

    console.log('No users found. Seeding database...');

    // Hash password for all users
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: passwordHash,
      role: 'admin',
      group: 'Management'
    });

    const hr = await User.create({
      name: 'HR Manager',
      email: 'hr@company.com',
      password: passwordHash,
      role: 'hr',
      group: 'Human Resources'
    });

    const leader = await User.create({
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      password: passwordHash,
      role: 'leader',
      group: 'Engineering'
    });

    const alex = await User.create({
      name: 'Alex Thompson',
      email: 'alex.t@company.com',
      password: passwordHash,
      role: 'employee',
      group: 'Engineering'
    });

    const jessica = await User.create({
      name: 'Jessica Wang',
      email: 'jessica.w@company.com',
      password: passwordHash,
      role: 'employee',
      group: 'Engineering'
    });

    const david = await User.create({
      name: 'David Kim',
      email: 'david.k@company.com',
      password: passwordHash,
      role: 'employee',
      group: 'Product'
    });

    const rachel = await User.create({
      name: 'Rachel Green',
      email: 'rachel.g@company.com',
      password: passwordHash,
      role: 'employee',
      group: 'Design'
    });

    console.log('Created 7 users');

    // Create votes
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Alex gets 4 votes
    await Vote.create({ from_user: jessica._id, to_user: alex._id, month, year, message: 'Great work!' });
    await Vote.create({ from_user: david._id, to_user: alex._id, month, year, message: 'Awesome!' });
    await Vote.create({ from_user: rachel._id, to_user: alex._id, month, year, message: 'Amazing!' });
    await Vote.create({ from_user: leader._id, to_user: alex._id, month, year, message: 'Outstanding!' });

    // Jessica gets 3 votes
    await Vote.create({ from_user: alex._id, to_user: jessica._id, month, year, message: 'Brilliant!' });
    await Vote.create({ from_user: david._id, to_user: jessica._id, month, year, message: 'Great code!' });
    await Vote.create({ from_user: hr._id, to_user: jessica._id, month, year, message: 'Excellent!' });

    // David gets 2 votes
    await Vote.create({ from_user: alex._id, to_user: david._id, month, year, message: 'Nice work!' });
    await Vote.create({ from_user: jessica._id, to_user: david._id, month, year, message: 'Good job!' });

    console.log('Created 9 votes');

    console.log('');
    console.log('========================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log('');
    console.log('LOGIN CREDENTIALS (password: admin123)');
    console.log('');
    console.log('  Admin:    admin@company.com');
    console.log('  HR:       hr@company.com');
    console.log('  Leader:   sarah.chen@company.com');
    console.log('  Employee: alex.t@company.com');
    console.log('  Employee: jessica.w@company.com');
    console.log('  Employee: david.k@company.com');
    console.log('  Employee: rachel.g@company.com');
    console.log('');
    console.log('LEADERBOARD:');
    console.log('  #1 Alex Thompson - 4 votes (₹400)');
    console.log('  #2 Jessica Wang - 3 votes (₹300)');
    console.log('  #3 David Kim - 2 votes (₹200)');
    console.log('========================================');
    console.log('');

  } catch (error) {
    console.error('Seed error:', error);
  }
}

module.exports = seedDatabase;
