import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { userId }: { userId: string }) {
  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
      SELECT tasks FROM aura_tasks
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (result.length === 0) {
      return Response.json({ data: [] });
    }

    // No need to parse, as it's already an object
    const tasks = result[0].tasks;
    console.log("Raw result:", result);
    console.log("Tasks:", tasks);

    return Response.json({ data: tasks });
  } catch (error) {
    console.error("Error fetching aura tasks:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
