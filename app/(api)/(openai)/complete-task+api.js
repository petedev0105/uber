import { neon } from "@neondatabase/serverless";

export async function PATCH(request, { params }) {
  const { taskId } = params;
  const { is_completed } = await request.json();

  if (!taskId) {
    return Response.json({ error: "Task ID is required" }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const updatedTask = await sql`
      UPDATE aura_tasks
      SET is_completed = ${is_completed}
      WHERE id = ${taskId}
      RETURNING *;
    `;

    return Response.json({ data: updatedTask[0] });
  } catch (error) {
    console.error("Error updating aura task:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
