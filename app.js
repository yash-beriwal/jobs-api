require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const auth_router = require('./routes/auth')
const jobs_router = require('./routes/jobs')
const authenticationMiddleWare = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});
app.use('/api/v1',auth_router)
app.use('/api/v1',jobs_router)
/* app.use('/api/v1',authenticationMiddleWare,jobs_router) - We are using authentication middleware for all the routes for the jobs 
If we want to use for specific route for jobs, we can use the middleware in routes.js/jobs.js for a route specifically
*/
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
