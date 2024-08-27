const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice Johnson", email: "alice@example.com", password: "12345" },
      { name: "Bob Smith", email: "bob@example.com",password: "12345" },
      { name: "Charlie Brown", email: "charlie@example.com",password: "12345" },
    ],
    skipDuplicates: true,
  });

  console.log("User seeding success");

  // Create Items
  const items = await prisma.item.createMany({
    data: [
      {
        title: "Smartphone X"
      },
      {
        title: "Laptop Pro"
      },
      {
        title: "Wireless Earbuds"
      },
    ],
    skipDuplicates: true,
  });

  console.log("items Seeded");

  // Fetch created users and items to get their IDs
  const createdUsers = await prisma.user.findMany();
  const createdItems = await prisma.item.findMany();

  // Create Reviews
  const reviews = await prisma.review.createMany({
    data: [
      {
        title: "Great phone!",
        text:
          "This smartphone exceeded my expectations. The camera is amazing!",
        rating: 5,
        userId: createdUsers[0].id,
        itemId: createdItems[0].id,
      },
      {
        title: "Powerful laptop",
        text:
          "This laptop handles all my work tasks with ease. Highly recommended!",
        rating: 4,
        userId: createdUsers[1].id,
        itemId: createdItems[1].id,
      },
      {
        title: "Decent earbuds",
        text: "Good sound quality, but the battery life could be better.",
        rating: 3,
        userId: createdUsers[2].id,
        itemId: createdItems[2].id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("reviews seeded");

  // Fetch created reviews to get their IDs
  const createdReviews = await prisma.review.findMany();

  // Create Comments
  const comments = await prisma.comment.createMany({
    data: [
      {
        content: "I agree, the camera is fantastic!",
        userId: createdUsers[1].id,
        reviewId: createdReviews[0].id,
      },
      {
        content: "How's the battery life?",
        userId: createdUsers[2].id,
        reviewId: createdReviews[0].id,
      },
      {
        content: "Does it come with pre-installed software?",
        userId: createdUsers[0].id,
        reviewId: createdReviews[1].id,
      },
      {
        content: "Have you tried the noise cancellation feature?",
        userId: createdUsers[1].id,
        reviewId: createdReviews[2].id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("comments seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
