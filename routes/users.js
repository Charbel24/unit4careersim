const router = require("express").Router();
const prisma = require("../db/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth")

router.post("/", async (req, res) => {
  try {
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashpassword,
      },
    });
    delete user.password;
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal error has occured" });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email and Password Required " });
    }
    const user = await prisma.user.findMany({
      where: { email: req.body.email },
    });
    if (!user.length) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isValidPassword = await bcrypt.compare(req.body.password,user[0].password)
    
    if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

    const token = jwt.sign({id:user[0].id},process.env.TOKEN_SECRET,{expiresIn:"30d"})
    res.json({token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal error has occured" });
  }
});

router.get(`/:id`,auth,async(req,res)=>{
    try {
        const user = await prisma.user.findUnique({where:{id:+req.params.id}})
        delete user.password
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: "internal error has occured" });
        console.log(error)
    }
})
module.exports = router;
