const dryFruitsData = require(".././dev-data/data/dryfruits.json");
const catchAsync = require(".././util/catch-async");
const AppError = require(".././util/app-errors");
const OpenAI = require("openai");
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

exports.askQuestion = catchAsync(async (req, res, next) => {
  const { question } = req.body;
  if (!question) return next(new AppError("Please provide a question.", 400));

  const fruits = [
    "Almond",
    "Pistachio",
    "Cashew",
    "Walnut",
    "Fig",
    "Raisin",
    "Peanut",
  ];

  // Find which fruit the question is about
  const fruitFound = fruits.find((f) =>
    question.toLowerCase().includes(f.toLowerCase())
  );

  if (!fruitFound)
    return res.status(200).json({ answer: "I only know about 7 dry fruits." });

  // Determine country from question
  let country = "Afghanistan"; // default
  if (question.toLowerCase().includes("pakistan")) country = "Pakistan";
  else if (question.toLowerCase().includes("afghanistan"))
    country = "Afghanistan";

  // Check if user is asking about local names
  if (question.toLowerCase().includes("local name")) {
    const localNames = dryFruitsData[country][fruitFound].localNames;

    // Detect specific language in question
    let lang = null;
    if (question.toLowerCase().includes("pashto")) lang = "pashto";
    else if (question.toLowerCase().includes("dari")) lang = "dari";
    else if (question.toLowerCase().includes("urdu")) lang = "urdu";

    let answer = "";
    if (lang) {
      answer = `The local name of the ${fruitFound} in ${
        lang.charAt(0).toUpperCase() + lang.slice(1)
      } is ${localNames[lang]}.`;
    } else {
      answer = `The local names of the ${fruitFound} in ${country} are ${localNames.pashto} in Pashto, ${localNames.dari} in Dari, and ${localNames.urdu} in Urdu.`;
    }

    return res.status(200).json({ answer });
  }

  // If not a local name question, fallback to OpenAI (only if key is configured)
  if (!openai) {
    return res.status(200).json({
      answer:
        "AI is disabled on the server. Ask about local names or contact admin to enable OpenAI.",
    });
  }

  // Proceed with OpenAI
  const prompt = `
You are a dry fruit QA assistant. Only use the information strictly from this JSON:
${JSON.stringify(dryFruitsData)}

If the user's question requires information that is NOT present in the JSON, reply with:
"Sorry, this information is not available in the data."

Do NOT use outside knowledge. Do NOT guess. Do NOT invent explanations.

When responding, convert arrays into natural language.
User question: "${question}"
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const answer = completion.choices[0].message.content;
  res.status(200).json({ answer });
});
