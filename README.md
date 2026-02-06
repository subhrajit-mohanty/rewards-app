# Employee Rewards Application

An employee appreciation and rewards system where employees can vote for colleagues.

## ✨ Key Feature: Auto-Seeding Database

The backend **automatically seeds the database** on startup if no users exist. No manual seeding required!

---

## 🚀 Quick Start

```bash
# Extract and run
unzip rewards-app.zip
cd rewards-app
docker-compose up --build
```

That's it! The database will be seeded automatically.

**Access the app:** http://localhost:3000

---

## 🔑 Login Credentials

**Password for ALL users: `admin123`**

| Role | Email | Permissions |
|------|-------|-------------|
| **Admin** | admin@company.com | Full access |
| **HR** | hr@company.com | HR functions |
| **Leader** | sarah.chen@company.com | Team lead |
| **Employee** | alex.t@company.com | Standard |
| **Employee** | jessica.w@company.com | Standard |
| **Employee** | david.k@company.com | Standard |
| **Employee** | rachel.g@company.com | Standard |

---

## 📊 Sample Data

The leaderboard shows pre-seeded votes:

| Rank | Name | Votes | Earnings |
|------|------|-------|----------|
| 🥇 | Alex Thompson | 4 | ₹400 |
| 🥈 | Jessica Wang | 3 | ₹300 |
| 🥉 | David Kim | 2 | ₹200 |

---

## ✨ Features

- **Vote**: Each employee can vote for up to 4 colleagues per month
- **Rewards**: Each vote = ₹100 reward
- **Leaderboard**: See top performers
- **Dashboard**: View your stats

---

## 🛠️ How Auto-Seeding Works

The backend checks if the database is empty on every startup:

```javascript
// backend/src/seed.js
const userCount = await User.countDocuments();
if (userCount > 0) {
  console.log('Database already has users. Skipping seed.');
  return;
}
// Otherwise, create users and votes...
```

This means:
- First run: Database is seeded automatically
- Subsequent runs: Existing data is preserved
- Reset: Just delete the volume and restart

---

## 🔧 Troubleshooting

### Reset the database

```bash
docker-compose down -v
docker-compose up --build
```

### Check if seeding worked

Look for this in the logs:
```
rewards-api | DATABASE SEEDED SUCCESSFULLY!
```

### Check backend logs

```bash
docker logs rewards-api
```

### Port conflicts

```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

---

## 📁 Project Structure

```
rewards-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js          # Main app + calls seedDatabase()
│       ├── seed.js         # Auto-seeds if empty
│       ├── models/
│       ├── routes/
│       └── middleware/
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── pages/
```

---

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB 7.0
- **Auth**: JWT
