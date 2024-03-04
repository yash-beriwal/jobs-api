const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')
const Job = require('../models/Job')
const {BadRequestError,NotFoundError} = require('../errors/index')
const getAllJobs = async(req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userID}).sort('createdAt')
    if(jobs.length==0)
        throw new NotFoundError("No Jobs Found - Pls create a job first")
    res.status(StatusCodes.OK).json({jobs})
}

const getJob = async(req,res)=>{

   /* For this endpoint we do not use the authentication middleware
   Instead we follow the traditional approach of adding authorizationHeader code logic here first
   Better solution would be to use a middleware like we have done for the other endpoints
    */ 
   const authorizationHeader = req.headers.authorization
   if(!authorizationHeader || !authorizationHeader.startsWith('Bearer'))
    res.status(401).json('Authorization Invalid')
   const token = authorizationHeader.split(' ')[1]
   try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    // console.log(decoded)
    req.user = {userID:decoded.userID, username:decoded.username}


    const job = await Job.findOne({_id:req.params.id,createdBy:req.user.userID})
    //NotFoundError handled here since it's not working above
    if(job==null)
        throw new NotFoundError("No Job Found - check the Job ID")
    res.status(StatusCodes.OK).json({job})
   }catch(error){
    if(error.statusCode==404)
        throw new NotFoundError("No Job Found - check the Job ID")
    res.status(401).json("Not authorized to access this route")
   }
}

const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userID
    const job = await Job.create({...req.body})
    // console.log(job)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res)=>{
    if(req.body.company=="" || req.body.position==""  )
        throw new BadRequestError('Company and Position cannot be empty')
    const job = await Job.findOneAndUpdate({_id:req.params.id,createdBy:req.user.userID},req.body,{
        new:true,
        runValidators:true
    })
    if(!job)
        throw new NotFoundError('Job Not Found')
    res.status(StatusCodes.OK).json({job})
}

const deletedJob = async(req,res)=>{
    const job = await Job.findOneAndDelete({_id:req.params.id})
    if(job===null)
    throw new NotFoundError("No Job Found - check the Job ID")
    res.status(StatusCodes.OK).json({job}) //returns deleted job
}

module.exports = {getAllJobs,getJob,createJob,updateJob,deletedJob}