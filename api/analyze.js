export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a medical lab report interpreter.
Explain the following lab report in very simple language for a general public user.
Avoid medical jargon. Add brief health advice where relevant.

Lab Report:
${text}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    res.status(200).json({ result: output });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
