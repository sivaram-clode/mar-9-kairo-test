import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Sarah Chen",
        email: "sarah@example.com",
        password,
        headline: "Senior Software Engineer at Google",
        summary: "Passionate about building scalable distributed systems. 10+ years of experience in backend engineering. Love mentoring junior engineers and contributing to open source.",
        location: "San Francisco, CA",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
    }),
    prisma.user.create({
      data: {
        name: "James Wilson",
        email: "james@example.com",
        password,
        headline: "Product Manager at Meta",
        summary: "Building products that connect people. Previously at Stripe and Airbnb. Stanford MBA.",
        location: "Menlo Park, CA",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Patel",
        email: "priya@example.com",
        password,
        headline: "Data Scientist at Netflix",
        summary: "Using data to drive decisions. PhD in Machine Learning from MIT. Speaker at NeurIPS and ICML.",
        location: "Los Gatos, CA",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      },
    }),
    prisma.user.create({
      data: {
        name: "Marcus Johnson",
        email: "marcus@example.com",
        password,
        headline: "UX Designer at Apple",
        summary: "Designing intuitive experiences that delight users. 8 years in product design. Previously at Figma.",
        location: "Cupertino, CA",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
      },
    }),
    prisma.user.create({
      data: {
        name: "Elena Rodriguez",
        email: "elena@example.com",
        password,
        headline: "Engineering Manager at Amazon",
        summary: "Leading teams that build AWS infrastructure. Former IC turned manager. Advocate for diversity in tech.",
        location: "Seattle, WA",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Kim",
        email: "david@example.com",
        password,
        headline: "Full Stack Developer at Stripe",
        summary: "Building the economic infrastructure for the internet. TypeScript enthusiast. Open source contributor.",
        location: "San Francisco, CA",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
    }),
    prisma.user.create({
      data: {
        name: "Lisa Thompson",
        email: "lisa@example.com",
        password,
        headline: "VP of Engineering at Shopify",
        summary: "Scaling engineering orgs from 50 to 500+. Passionate about developer experience and platform engineering.",
        location: "Toronto, ON",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      },
    }),
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@example.com",
        password,
        headline: "DevOps Engineer at Microsoft",
        summary: "Cloud infrastructure and CI/CD pipelines. Kubernetes certified. Terraform advocate.",
        location: "Redmond, WA",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Add experiences
  const experiences = [
    { userId: users[0].id, title: "Senior Software Engineer", company: "Google", startDate: new Date("2021-03-01"), description: "Leading backend development for Google Cloud Platform services." },
    { userId: users[0].id, title: "Software Engineer", company: "Microsoft", startDate: new Date("2018-01-01"), endDate: new Date("2021-02-01"), description: "Built distributed systems for Azure DevOps." },
    { userId: users[1].id, title: "Product Manager", company: "Meta", startDate: new Date("2022-06-01"), description: "Leading product strategy for Facebook Marketplace." },
    { userId: users[1].id, title: "Associate PM", company: "Stripe", startDate: new Date("2019-09-01"), endDate: new Date("2022-05-01"), description: "Managed payment processing features." },
    { userId: users[2].id, title: "Data Scientist", company: "Netflix", startDate: new Date("2020-08-01"), description: "Building recommendation models that serve 200M+ users." },
    { userId: users[3].id, title: "Senior UX Designer", company: "Apple", startDate: new Date("2021-01-01"), description: "Designing human interfaces for iOS and macOS." },
    { userId: users[4].id, title: "Engineering Manager", company: "Amazon", startDate: new Date("2020-04-01"), description: "Managing a team of 15 engineers building AWS Lambda." },
    { userId: users[5].id, title: "Full Stack Developer", company: "Stripe", startDate: new Date("2022-01-01"), description: "Building checkout and payment UIs." },
    { userId: users[6].id, title: "VP of Engineering", company: "Shopify", startDate: new Date("2019-06-01"), description: "Overseeing platform engineering and developer tools." },
    { userId: users[7].id, title: "DevOps Engineer", company: "Microsoft", startDate: new Date("2021-07-01"), description: "Managing Kubernetes clusters and CI/CD pipelines for Azure." },
  ];
  await Promise.all(experiences.map((e) => prisma.experience.create({ data: e })));
  console.log(`✅ Created ${experiences.length} experiences`);

  // Add educations
  const educations = [
    { userId: users[0].id, school: "Stanford University", degree: "M.S.", field: "Computer Science", startDate: new Date("2015-09-01"), endDate: new Date("2017-06-01") },
    { userId: users[0].id, school: "UC Berkeley", degree: "B.S.", field: "EECS", startDate: new Date("2011-09-01"), endDate: new Date("2015-06-01") },
    { userId: users[1].id, school: "Stanford GSB", degree: "MBA", field: "Business", startDate: new Date("2017-09-01"), endDate: new Date("2019-06-01") },
    { userId: users[2].id, school: "MIT", degree: "Ph.D.", field: "Machine Learning", startDate: new Date("2016-09-01"), endDate: new Date("2020-06-01") },
    { userId: users[3].id, school: "RISD", degree: "B.F.A.", field: "Industrial Design", startDate: new Date("2013-09-01"), endDate: new Date("2017-06-01") },
    { userId: users[4].id, school: "Georgia Tech", degree: "B.S.", field: "Computer Science", startDate: new Date("2012-09-01"), endDate: new Date("2016-06-01") },
    { userId: users[5].id, school: "Carnegie Mellon", degree: "B.S.", field: "Computer Science", startDate: new Date("2017-09-01"), endDate: new Date("2021-06-01") },
    { userId: users[6].id, school: "University of Waterloo", degree: "B.A.Sc.", field: "Software Engineering", startDate: new Date("2010-09-01"), endDate: new Date("2014-06-01") },
  ];
  await Promise.all(educations.map((e) => prisma.education.create({ data: e })));
  console.log(`✅ Created ${educations.length} educations`);

  // Add skills
  const skillsData: { userId: string; names: string[] }[] = [
    { userId: users[0].id, names: ["Go", "Kubernetes", "gRPC", "PostgreSQL", "System Design"] },
    { userId: users[1].id, names: ["Product Strategy", "A/B Testing", "SQL", "Figma"] },
    { userId: users[2].id, names: ["Python", "TensorFlow", "PyTorch", "SQL", "Statistics"] },
    { userId: users[3].id, names: ["Figma", "Sketch", "User Research", "Prototyping", "Design Systems"] },
    { userId: users[4].id, names: ["Java", "AWS", "Team Leadership", "Architecture", "Agile"] },
    { userId: users[5].id, names: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"] },
    { userId: users[6].id, names: ["Engineering Leadership", "Platform Engineering", "Ruby", "Go"] },
    { userId: users[7].id, names: ["Kubernetes", "Terraform", "Docker", "CI/CD", "Linux"] },
  ];
  for (const sd of skillsData) {
    await Promise.all(sd.names.map((name) => prisma.skill.create({ data: { userId: sd.userId, name } })));
  }
  console.log("✅ Created skills");

  // Create connections (accepted)
  const connectionPairs = [
    [0, 1], [0, 2], [0, 4], [0, 5],
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [3, 4], [3, 6],
    [4, 5], [4, 7],
    [5, 6], [6, 7],
  ];
  for (const [a, b] of connectionPairs) {
    await prisma.connection.create({
      data: { requesterId: users[a].id, addresseeId: users[b].id, status: "ACCEPTED" },
    });
  }
  // Add a pending connection
  await prisma.connection.create({
    data: { requesterId: users[7].id, addresseeId: users[0].id, status: "PENDING" },
  });
  console.log(`✅ Created ${connectionPairs.length + 1} connections`);

  // Create posts
  const posts = [
    { authorId: users[0].id, content: "Excited to share that we just open-sourced our distributed tracing library at Google! 🎉\n\nAfter 2 years of internal use, we've made it available for the community. It handles 10M+ spans/second with minimal overhead.\n\nCheck it out and let me know what you think! #OpenSource #DistributedSystems" },
    { authorId: users[1].id, content: "5 lessons I learned transitioning from engineering to product management:\n\n1. Your technical background is your superpower, not your identity\n2. Learn to say no — it's your most important skill\n3. Data tells you what, users tell you why\n4. Ship fast, learn faster\n5. Great PMs are great storytellers\n\nWhat would you add? 👇" },
    { authorId: users[2].id, content: "Just published my paper on large-scale recommendation systems at NeurIPS 2024! 📄\n\nWe achieved a 15% improvement in user engagement while reducing compute costs by 40%. The key insight was combining collaborative filtering with transformer-based content understanding.\n\n#MachineLearning #AI #Research" },
    { authorId: users[3].id, content: "Redesigned the Settings app for iOS 18. Here are my principles:\n\n✨ Every setting should be findable in 3 taps or less\n✨ Group by user intent, not by technical category\n✨ Progressive disclosure — show simple first, complex on demand\n\nDesign is about making the complex feel simple. #UXDesign #Apple" },
    { authorId: users[4].id, content: "Hiring update: My team at AWS is looking for senior backend engineers! 🚀\n\nWe're building the next generation of serverless compute. You'll work on systems that handle millions of requests per second.\n\nRequirements: Strong systems programming, distributed systems experience. Remote-friendly.\n\nDM me if interested!" },
    { authorId: users[5].id, content: "Hot take: TypeScript is the best language for full-stack development in 2024.\n\nShared types between frontend and backend, amazing tooling, huge ecosystem, and the DX keeps getting better.\n\nI've built 3 production apps with Next.js + tRPC this year and the productivity is unmatched.\n\nChange my mind 😄 #TypeScript #WebDev" },
    { authorId: users[6].id, content: "We just hit 1 million developers on our platform! 🎯\n\nWhen I joined Shopify, we had 50 engineers. Now we have 500+ and serve over 1M merchants worldwide.\n\nThe key to scaling an engineering org? Invest in developer experience FIRST. Everything else follows.\n\nGrateful for this incredible team. 💚" },
    { authorId: users[0].id, content: "Mentoring tip: The best way to grow as an engineer is to review other people's code.\n\nYou learn different approaches, develop taste for good design, and practice giving constructive feedback.\n\nI try to review at least 3 PRs a day outside my immediate team. It's made me a significantly better engineer." },
    { authorId: users[7].id, content: "Migrated our entire infrastructure from AWS to Azure in 6 months with zero downtime. Here's how we did it:\n\n1. Built a multi-cloud abstraction layer\n2. Ran both clouds in parallel for 3 months\n3. Gradually shifted traffic using feature flags\n4. Automated rollback at every stage\n\nThe hardest part? Convincing people it was possible. #DevOps #Cloud" },
  ];
  const createdPosts = [];
  for (let i = 0; i < posts.length; i++) {
    const p = await prisma.post.create({
      data: {
        ...posts[i],
        createdAt: new Date(Date.now() - (posts.length - i) * 3600000 * 6),
      },
    });
    createdPosts.push(p);
  }
  console.log(`✅ Created ${createdPosts.length} posts`);

  // Add likes
  const likes = [
    { postId: createdPosts[0].id, userId: users[1].id },
    { postId: createdPosts[0].id, userId: users[2].id },
    { postId: createdPosts[0].id, userId: users[4].id },
    { postId: createdPosts[0].id, userId: users[5].id },
    { postId: createdPosts[1].id, userId: users[0].id },
    { postId: createdPosts[1].id, userId: users[3].id },
    { postId: createdPosts[1].id, userId: users[6].id },
    { postId: createdPosts[2].id, userId: users[0].id },
    { postId: createdPosts[2].id, userId: users[4].id },
    { postId: createdPosts[3].id, userId: users[1].id },
    { postId: createdPosts[3].id, userId: users[6].id },
    { postId: createdPosts[4].id, userId: users[5].id },
    { postId: createdPosts[5].id, userId: users[0].id },
    { postId: createdPosts[5].id, userId: users[2].id },
    { postId: createdPosts[5].id, userId: users[7].id },
    { postId: createdPosts[6].id, userId: users[0].id },
    { postId: createdPosts[6].id, userId: users[1].id },
    { postId: createdPosts[6].id, userId: users[4].id },
    { postId: createdPosts[6].id, userId: users[5].id },
    { postId: createdPosts[6].id, userId: users[7].id },
    { postId: createdPosts[8].id, userId: users[0].id },
    { postId: createdPosts[8].id, userId: users[4].id },
  ];
  await Promise.all(likes.map((l) => prisma.like.create({ data: l })));
  console.log(`✅ Created ${likes.length} likes`);

  // Add comments
  const comments = [
    { postId: createdPosts[0].id, userId: users[2].id, content: "This is amazing! Can't wait to try it out. We've been looking for something like this at Netflix." },
    { postId: createdPosts[0].id, userId: users[5].id, content: "Just starred the repo. The documentation looks great. Any plans for a Node.js SDK?" },
    { postId: createdPosts[1].id, userId: users[0].id, content: "Great list! I'd add: 'Understand the business model deeply.' Without that context, it's hard to prioritize effectively." },
    { postId: createdPosts[1].id, userId: users[4].id, content: "Number 2 resonates so much. Learning to say no was the hardest part of becoming a PM." },
    { postId: createdPosts[2].id, userId: users[0].id, content: "Congrats Priya! The results are impressive. Would love to chat about the transformer architecture you used." },
    { postId: createdPosts[5].id, userId: users[0].id, content: "Agreed! tRPC + Next.js is a game changer for developer productivity." },
    { postId: createdPosts[5].id, userId: users[2].id, content: "For data-heavy applications, Python still has the edge. But for web apps, TypeScript is unbeatable." },
    { postId: createdPosts[6].id, userId: users[4].id, content: "Incredible milestone! Your talk on scaling engineering orgs at LeadDev was one of the best I've attended." },
    { postId: createdPosts[8].id, userId: users[5].id, content: "Zero downtime migration is incredibly hard. Impressive work! How did you handle database migrations?" },
  ];
  for (let i = 0; i < comments.length; i++) {
    await prisma.comment.create({
      data: {
        ...comments[i],
        createdAt: new Date(Date.now() - (comments.length - i) * 1800000),
      },
    });
  }
  console.log(`✅ Created ${comments.length} comments`);

  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Demo accounts (all use password: password123):");
  for (const u of users) {
    console.log(`   ${u.email} — ${u.name} (${u.headline})`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
