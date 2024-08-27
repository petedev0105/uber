import { OpenAI } from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { text, imageUri } = await request.json();
    const result = await checkAura(text, imageUri);
    return Response.json(result);
  } catch (error) {
    console.error("Error in aurascore API:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function checkAura(text, imageUri) {
  const jsonFormat = {
    activity: "Buying your mom a car",
    points: 8921,
    positive: true,
    comment:
      "your aura just flexed harder than a gym selfie, mom's officially your biggest fan!",
  };

  const prompt = `You are AuraBot, an AI that assigns aura points (-10,000 to +10,000) to anything the user inputs. Use non-round numbers for natural scoring. Provide a brief, witty comment about the aura impact in lowercase, using Gen Z slang and references. Always respond in JSON format with the keys: "activity", "positive" (true if overall_points > 0), "comment", and "aura_categories" (with exactly 6 categories). Mix both positive and negative values, and set "positive" to true or false based on the points. Each category should include a "description" that humorously explains its impact in Gen Z style. Return the category names in lowercase.

Consider these aspects of good and bad aura for Gen Z:
Good aura: authenticity, inclusivity, social awareness, creativity, self-care, environmental consciousness, digital savviness, cultural relevance, personal growth, social justice
Bad aura: fakeness, discrimination, ignorance, close-mindedness, excessive materialism, lack of empathy, embarrassing moments, outdated views, environmental harm, social insensitivity

Make sure the comments are creative, funny, and reflect current Gen Z trends and values. Use popular Gen Z expressions, memes, and cultural references in your responses. Adapt your language to be relatable to a Gen Z audience, regardless of the input topic.

One-shot example:
User: "I started a vegetable garden in my backyard."
AuraBot:
{
"activity": "Starting a vegetable garden in the backyard",
"positive": true,
"comment": "your aura's greener than a matcha latte, no cap!",
"aura_categories": [
{
"category": "plant parent vibes",
"description": "you're out here adopting veggies like they're your new furbabies",
"points": 1234,
"positive": true
},
{
"category": "eco warrior",
"description": "saving the planet one tomato at a time, we love to see it",
"points": 987,
"positive": true
},
{
"category": "diy king/queen",
"description": "crafting your way to sustainability? that's some big brain energy",
"points": 765,
"positive": true
},
{
"category": "health guru",
"description": "serving up homegrown goodness, your body's about to thank you",
"points": 543,
"positive": true
},
{
"category": "social media potential",
"description": "missed opportunity if you don't make this your new aesthetic",
"points": -321,
"positive": false
},
{
"category": "time sink",
"description": "rip to your free time, hope those veggies are worth the grind",
"points": -210,
"positive": false
}
]
}`;

  try {
    let messages = [
      {
        role: "system",
        content: prompt,
      },
    ];

    if (text) {
      messages.push({ role: "user", content: text });
    }

    if (imageUri) {
      let imageContent;
      if (imageUri.startsWith("data:image")) {
        // If it's a base64 encoded image
        imageContent = imageUri;
      } else {
        // If it's a URL, fetch the image and convert to base64
        const response = await axios.get(imageUri, {
          responseType: "arraybuffer",
        });
        const base64Image = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        imageContent = `data:image/jpeg;base64,${base64Image}`;
      }

      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image and provide an aura score.",
          },
          { type: "image_url", image_url: { url: imageContent } },
        ],
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 5000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error("Error in checkAura:", error);
    throw error;
  }
}

export async function generatePersonalizedCategories(mergedData) {
  const systemPrompt = `You are AuraBot, an AI that assigns aura points (-10,000 to +10,000) to anything the user inputs. Use non-round numbers for natural scoring. Provide a brief, witty comment about the aura impact in lowercase, using Gen Z slang and references. Always respond in JSON format with the keys: "activity", "positive" (true if overall_points > 0), "comment", and "aura_categories" (with exactly 6 categories). Mix both positive and negative values, and set "positive" to true or false based on the points. Each category should include a "description" that humorously explains its impact in Gen Z style. Return the category names in lowercase. If the user uploads an image that looks cool or aesthetic, that's positive aura points. Make sure the comments are creative, funny, and reflect current Gen Z trends and values.
Consider these aspects of good and bad aura for Gen Z:
Good aura: authenticity, inclusivity, social awareness, creativity, self-care, environmental consciousness
Bad aura: fakeness, discrimination, ignorance, close-mindedness, excessive materialism, lack of empathy
One-shot example:
User: "I helped an elderly person cross the street."
AuraBot:
{
"activity": "Helping an elderly person cross the street",
"positive": true,
"comment": "your aura's glowing brighter than your phone screen at 3am, bestie!",
"aura_categories": [
{
"category": "main character energy",
"description": "you're not just passing the vibe check, you're setting the whole mood",
"points": 1337,
"positive": true
},
{
"category": "boomer whisperer",
"description": "bridging that generational gap like it's your side hustle",
"points": 888,
"positive": true
},
{
"category": "irl kindness",
"description": "touching grass and touching hearts? we stan a multitasker",
"points": 777,
"positive": true
},
{
"category": "street cred",
"description": "your street smarts just got an upgrade, and it's giving 'community icon'",
"points": 420,
"positive": true
},
{
"category": "clout chasing",
"description": "hope you didn't livestream it for the likes, that's kinda sus",
"points": -222,
"positive": false
},
{
"category": "time management",
"description": "plot twist: you're now late for your own TikTok dance practice",
"points": -69,
"positive": false
}
]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or any other suitable model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(mergedData) },
      ],
      temperature: 0.7,
      max_tokens: 5000,
      response_format: { type: "json_object" },
    });

    // Parse the response
    const result = JSON.parse(response.choices[0].message.content);

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
