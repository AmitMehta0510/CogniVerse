import "dotenv/config";

const getOpenAiAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    }),
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API Error:", data);
      return data?.error?.message || "Error from OpenAI API";
    }

    return data.choices?.[0]?.message?.content || "No response generated";
  } catch (error) {
    console.error("Error:", error);
    return "Error calling OpenAI API";
  }
};


export default getOpenAiAPIResponse;
