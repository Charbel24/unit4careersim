const router = require("express").Router();
const prisma = require("../db/prisma");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { title, text, rating, itemId } = req.body;
    const userId = req.user.id;

    if (!title || !text || !rating || !itemId) {
      return res
        .status(400)
        .json({ error: "Title, text, rating, and itemId are required." });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_itemId: {
          userId: userId,
          itemId: parseInt(itemId),
        },
      },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this item." });
    }

    const newReview = await prisma.review.create({
      data: { title, text, rating, userId, itemId: parseInt(itemId) },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the review." });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, rating } = req.body;
    const userId = req.user.id;

    if (!title && !text && !rating) {
      return res
        .status(400)
        .json({
          error:
            "At least one field (title, text, or rating) is required for update.",
        });
    }

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this review." });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { title, text, rating },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the review." });
  }
});

// DELETE
router.delete("/:id", auth,async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this review." });
    }

    await prisma.review.delete({ where: { id: parseInt(id) } });
    res.status(200).send({message: "Review Deleted!"});
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the review." });
  }
});

module.exports = router;
