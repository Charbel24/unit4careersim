const router = require("express").Router();
const prisma = require("../db/prisma");
const auth = require("../middleware/auth");


// Add Comment
router.post("/",auth, async (req, res) => {
  try {
    const { content, reviewId } = req.body;
    const userId = req.user.id; 

    if (!content || !reviewId) {
      return res
        .status(400)
        .json({ error: "Content and reviewId are required." });
    }

    const newComment = await prisma.comment.create({
      data: { content, userId, reviewId },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment." });
  }
});


// Update
router.put("/:id",auth,  async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment." });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the comment." });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get userId from authenticated user

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment." });
    }

    await prisma.comment.delete({ where: { id: parseInt(id) } });
    res.status(200).send({message: "Comment Deleted"});
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment." });
  }
});

module.exports = router;
