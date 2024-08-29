import { neon } from "@neondatabase/serverless";

export async function POST(request: Request, { userId }: { userId: string }) {
  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const initialTasks = [
      {
        id: "1",
        title: "Create Viral TikTok Dance",
        points: 500,
        category: "Social Media",
        description:
          "Choreograph and perform a dance that has the potential to go viral on TikTok.",
        difficulty: "Medium",
        tips: "Study current trends, use popular music, and keep the moves simple yet catchy. Practice until you can perform it flawlessly.",
        is_completed: false,
      },
      {
        id: "2",
        title: "Rooftop Movie Night",
        points: 400,
        category: "Social",
        description:
          "Organize and host a movie night for friends on a rooftop or outdoor space.",
        difficulty: "Medium",
        tips: "Choose a crowd-pleasing movie, set up comfortable seating, and don't forget snacks and blankets. Check weather forecasts and have a backup plan.",
        is_completed: false,
      },
      {
        id: "3",
        title: "Design Streetwear Outfit",
        points: 600,
        category: "Fashion",
        description:
          "Create and wear your own unique streetwear outfit, showcasing your personal style.",
        difficulty: "Hard",
        tips: "Research current streetwear trends, mix and match pieces creatively, and consider customizing existing items for a truly unique look.",
        is_completed: false,
      },
      {
        id: "4",
        title: "Thrift Flip Project",
        points: 350,
        category: "DIY",
        description:
          "Transform a thrifted item into a fashionable piece and share the process online.",
        difficulty: "Medium",
        tips: "Choose items with potential, learn basic sewing skills, and document your process with before and after photos or videos.",
        is_completed: false,
      },
      {
        id: "5",
        title: "Organize Flash Mob",
        points: 800,
        category: "Performance",
        description:
          "Plan and execute a surprise flash mob performance in a public place.",
        difficulty: "Hard",
        tips: "Choose a popular location, recruit participants through social media, and practice the routine thoroughly. Ensure you have necessary permissions.",
        is_completed: false,
      },
      {
        id: "6",
        title: "Create Digital Art",
        points: 300,
        category: "Art",
        description:
          "Design a piece of digital art and share it on social media platforms.",
        difficulty: "Medium",
        tips: "Experiment with different digital art tools, develop a unique style, and use relevant hashtags when sharing to increase visibility.",
        is_completed: false,
      },
      {
        id: "7",
        title: "Learn to DJ",
        points: 700,
        category: "Music",
        description:
          "Master basic DJ skills and host a house party to showcase your new talent.",
        difficulty: "Hard",
        tips: "Start with free DJ software, practice beat matching and transitions, and create playlists that flow well together.",
        is_completed: false,
      },
      {
        id: "8",
        title: "Start a Travel Vlog",
        points: 900,
        category: "Adventure",
        description:
          "Document your travels and experiences through a vlog shared on YouTube or social media.",
        difficulty: "Medium",
        tips: "Invest in a good camera, plan your content ahead, and engage with your audience through storytelling.",
        is_completed: false,
      },
      {
        id: "9",
        title: "Host a Themed Potluck Dinner",
        points: 250,
        category: "Social",
        description:
          "Plan a potluck dinner with a creative theme (e.g., 80s, futuristic) and invite friends.",
        difficulty: "Easy",
        tips: "Encourage guests to dress according to the theme and bring dishes that fit. Prepare decorations to enhance the atmosphere.",
        is_completed: false,
      },
      {
        id: "10",
        title: "Learn to Skateboard",
        points: 300,
        category: "Sports",
        description:
          "Pick up skateboarding and document your progress through videos or social media.",
        difficulty: "Medium",
        tips: "Start with safety gear, practice in a safe area, and learn basic tricks gradually. Join a local skate community for support.",
        is_completed: false,
      },
    ];

    const tasksJson = JSON.stringify(initialTasks);

    const insertedTasks = await sql`
      INSERT INTO aura_tasks (user_id, tasks)
      VALUES (${userId}, ${tasksJson})
      RETURNING *
    `;

    return Response.json({ data: insertedTasks }, { status: 201 });
  } catch (error) {
    console.error("Error creating initial tasks:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
