import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  console.log("POST /user API route called");
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    console.log("Received user data:", { name, email, clerkId });

    if (!name || !email || !clerkId) {
      console.log("Missing required fields");
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Attempting to insert user into database");
    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
     );`;

    console.log("User successfully inserted into database", response);
    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
