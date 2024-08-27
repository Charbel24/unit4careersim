const router = require("express").Router();
const prisma = require("../db/prisma");

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const newItem = await prisma.item.create({ data: { title } });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "An error occurred while adding the item." });
  }
});

router.get(`/`, async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "internal error has occured" });
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
            comments: {
              include: {
                user: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    const totalRating = item.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      item.reviews.length > 0 ? totalRating / item.reviews.length : 0;

    const itemWithAverageRating = {
      ...item,
      averageRating: parseFloat(averageRating.toFixed(1)),
    };

    res.json(itemWithAverageRating);
  } catch (error) {
    console.error("Error fetching item details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching item details." });
  }
});
module.exports = router;
