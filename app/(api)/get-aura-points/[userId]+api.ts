import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { userId }: { userId: string }) {
  //   const { userId } = params;

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
      SELECT total_points FROM user_aura_points WHERE user_id = ${userId};
    `;

    console.log("user aura points", result);

    if (result.length === 0) {
      return Response.json({ totalPoints: 0 });
    }

    return Response.json({ totalPoints: result[0].total_points });
  } catch (error) {
    console.error("Error fetching aura points:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
