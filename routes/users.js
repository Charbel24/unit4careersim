const router = require("express").Router();
const prisma = require("../db/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

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

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user[0].password
    );

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user[0].id }, process.env.TOKEN_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal error has occured" });
  }
});

router.get(`/:id`, auth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          include: {
            item: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        comments: {
          include: {
            review: {
              select: {
                id: true,
                title: true,
                item: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      reviews: user.reviews.map((review) => ({
        id: review.id,
        title: review.title,
        text: review.text,
        rating: review.rating,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        item: {
          id: review.item.id,
          title: review.item.title,
        },
      })),
      comments: user.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        review: {
          id: comment.review.id,
          title: comment.review.title,
          item: {
            id: comment.review.item.id,
            title: comment.review.item.title,
          },
        },
      })),
    };

    res.json(formattedUser);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user details." });
  }
});
module.exports = router;
