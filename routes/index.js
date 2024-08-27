const path = require('path')
const router = require('express').Router()
const  userRoutes = require('./users')
const  itemRouter = require('./items')
const  reviewRouter = require('./reviews')
const  commentRouter = require('./comments')

router.use('/users',userRoutes)
router.use('/items',itemRouter)
router.use('/reviews',reviewRouter)
router.use('/comments',commentRouter)

router.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
module.exports = router;