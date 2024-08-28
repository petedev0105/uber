import { neon } from "@neondatabase/serverless";

export async function GET(request, { params }) {
  const { userId } = params;

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const tasks = await sql`
      SELECT * FROM aura_tasks
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `;

    return Response.json({ data: tasks });
  } catch (error) {
    console.error("Error fetching aura tasks:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
