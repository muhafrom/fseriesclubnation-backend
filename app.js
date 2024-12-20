const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/db');
const partRouter = require('./routes/parts');
const mediaRouter = require('./routes/media');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

app.use('/api/parts', authMiddleware, partRouter);
app.use('/api/media', authMiddleware, mediaRouter);
app.use('/api/auth', authRouter);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Database synchronization error:', error);
});