import { neon } from "@neondatabase/serverless";

export async function PATCH(request: Request, { userId }: { userId: string }) {
  const { tasks }: { tasks: { id: string; is_completed: boolean }[] } =
    await request.json();

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    console.log(`Received PATCH request for userId: ${userId}`);
    console.log(`Tasks to update: ${JSON.stringify(tasks)}`);
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Update the tasks column in the database directly with the new tasks
    await sql`
      UPDATE aura_tasks
      SET tasks = ${JSON.stringify(tasks)} 
      WHERE user_id = ${userId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating aura tasks:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
