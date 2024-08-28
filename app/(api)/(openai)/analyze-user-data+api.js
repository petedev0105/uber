import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { userResponses, selectedPlan } = await request.json();

    // Prepare the prompt for OpenAI
    const prompt = `Analyze the following user responses and selected plan for a personalized aura improvement app:

User Responses:
${JSON.stringify(userResponses, null, 2)}

Selected Plan:
${JSON.stringify(selectedPlan, null, 2)}

Analyze this information and provide:
6 aspects of the user's life and a score of 
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Analyze the following user responses to the onboarding questionnaire for an aura improvement app. Based on their answers, provide a rating from 1 to 100 for each of the six categories: Posture, Mindfulness, Communication, Style, Wellness, and Creativity. Consider the following guidelines:
A score of 1-20 indicates a significant need for improvement.
21-40 suggests below average performance or awareness.
41-60 represents an average level.
61-80 indicates above average performance or awareness.
81-100 suggests excellent performance or high awareness.
Take into account both direct and indirect indicators from the user's responses. For example, their energy levels might indirectly reflect their wellness, or their communication skills might hint at their posture confidence.
Provide a brief explanation (1-2 sentences) for each rating, highlighting key factors that influenced the score.
User Responses:
[Insert user's answers to the questionnaire here]
Based on these responses, please provide ratings and brief explanations for:
Posture: [Rating] - [Explanation]
Mindfulness: [Rating] - [Explanation]
Communication: [Rating] - [Explanation]
Style: [Rating] - [Explanation]
Wellness: [Rating] - [Explanation]
Creativity: [Rating] - [Explanation]
Additionally, provide a short overall summary (2-3 sentences) of the user's aura profile based on these ratings.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const analysis = response.choices[0].message.content;

    return Response.json({ analysis });
  } catch (error) {
    console.error("Error in analyze-user-data API:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
