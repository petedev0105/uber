import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { userResponses, selectedPlan } = await request.json();

    // Prepare the prompt for OpenAI
    const prompt = `
        User Responses:
        ${JSON.stringify(userResponses, null, 2)}

        Selected Plan:
        ${JSON.stringify(selectedPlan, null, 2)}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Analyze the following user responses to the aura improvement app questionnaire. Based on their answers, determine their aura type and provide ratings from 1 to 100 for six categories: Posture, Mindfulness, Communication, Style, Wellness, and Creativity. Use these guidelines:

1-20: Significant need for improvement
21-40: Below average
41-60: Average
61-80: Above average
81-100: Excellent

Make sure the scores are not over 70

Consider both direct and indirect indicators in the user's responses. Provide a brief explanation (1-2 sentences) for each rating.

Please provide your analysis in the following JSON format:
{
  "analysis": {
    "auraType": {
      "type": "Radiant Innovator",
      "explanation": "Your aura reflects a vibrant blend of creativity and forward-thinking energy. You possess a unique ability to inspire and influence those around you with your innovative ideas and positive outlook."
    },
    "categories": {
      "posture": {
        "rating": 72,
        "explanation": "Your posture indicates confidence and openness to new experiences. There's room for improvement in maintaining consistent alignment throughout the day."
      },
      "mindfulness": {
        "rating": 85,
        "explanation": "You exhibit a strong awareness of your thoughts and emotions, practicing regular mindfulness techniques. This contributes significantly to your overall well-being and decision-making skills."
      },
      "communication": {
        "rating": 68,
        "explanation": "Your communication style is generally clear and effective, but there's potential to enhance your ability to convey complex ideas and listen more actively in challenging situations."
      },
      "style": {
        "rating": 79,
        "explanation": "Your personal style reflects your creative nature and individuality. You have a knack for expressing yourself through your appearance, though there's room to refine your aesthetic further."
      },
      "wellness": {
        "rating": 63,
        "explanation": "While you prioritize your well-being, there's opportunity to develop a more consistent wellness routine, particularly in areas of physical activity and stress management."
      },
      "creativity": {
        "rating": 91,
        "explanation": "Your creativity shines brightly, showcasing an exceptional ability to think outside the box and generate innovative solutions. This is a significant strength in your aura profile."
      }
    },
    "overallSummary": "As a Radiant Innovator, your aura emanates a powerful blend of creativity, mindfulness, and potential for growth. Your strongest attributes lie in your innovative thinking and self-awareness, while areas like physical wellness and communication present opportunities for further development. By focusing on these areas, you can amplify your already impressive aura and maximize your positive impact on the world around you."
  }
}

Ensure all explanations are concise and the JSON is properly formatted. Use the provided example as a guide for the level of detail and style of analysis expected.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2500,
    });

    const analysis = response.choices[0].message.content;

    return Response.json({ analysis });
  } catch (error) {
    console.error("Error in analyze-user-data API:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
