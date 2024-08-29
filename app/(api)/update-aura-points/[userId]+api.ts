import { neon } from "@neondatabase/serverless";

const MAX_RETRIES = 3;

// Remove the executeWithRetry function
// async function executeWithRetry(sqlQuery: any, retries: number = MAX_RETRIES) {
//   for (let attempt = 0; attempt < retries; attempt++) {
//     try {
//       return await sqlQuery();
//     } catch (error: unknown) {
//       const errorMessage = (error as Error).message; // Type assertion
//       console.warn(`Attempt ${attempt + 1} failed: ${errorMessage}`);
//     }
//   }
// }

export async function PATCH(request: Request, { userId }: { userId: string }) {
  const { totalPoints } = await request.json();

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    console.log("calling update aura points api route...");
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Fetch the current total points directly
    const currentPointsResult = await sql`
      SELECT total_points FROM user_aura_points WHERE user_id = ${userId};
    `;

    const currentTotalPoints =
      currentPointsResult.length > 0 ? currentPointsResult[0].total_points : 0;

    // Calculate new total points once
    const newTotalPoints = currentTotalPoints + totalPoints;

    // Update the total points in the database directly
    await sql`
      INSERT INTO user_aura_points (user_id, total_points)
      VALUES (${userId}, ${newTotalPoints})
      ON CONFLICT (user_id) DO UPDATE SET total_points = ${newTotalPoints};
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating aura points:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
