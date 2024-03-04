const {getAllJobs,getJob,createJob,updateJob,deletedJob} = require('../controllers/jobs')
const express = require('express')
const router = express.Router()
const authenticationMiddleWare = require('../middleware/authentication')

/*Here we are using authentication middleware. Ideally it should be used for all routes in app.js
But to demonstrate it here, we can use here as well
We are using auth middleware for all the APIs here
But for getJob API we are doing it without adding the middleware but the coding logic is the same
*/
router.route('/jobs').get(authenticationMiddleWare,getAllJobs).post(authenticationMiddleWare,createJob)
router.route('/jobs/:id').get(getJob).patch(authenticationMiddleWare,updateJob).delete(authenticationMiddleWare,deletedJob)

module.exports = router