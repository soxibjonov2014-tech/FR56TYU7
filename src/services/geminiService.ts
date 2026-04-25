import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function sendMessage(history: { role: string; content: string }[]) {
  const model = "gemini-3-flash-preview";
  
  const contents = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: "Sening isming Jang-Kong AI. Sen o'zbek tilida gaplashadigan aqlli va foydali sun'iy intellekt yordamchisisan. Foydalanuvchilarga doimo xushmuomala bo'l va ularning savollariga aniq va batafsil javob ber. \n\nAgar foydalanuvchi biror narsaning rasmini so'rasa, markdown formatida rasm linkini taqdim et. Rasm manbai: https://source.unsplash.com/featured/800x600?{keyword}. \n\nMUHIM: {keyword} qismiga rasmning mazmuniga mos keladigan eng aniq inglizcha so'zni yoki so'zlarni yoz (masalan: 'lion' yoki 'luxury,car'). Bu rasmning aynan so'ralgan narsa bo'lishini ta'minlaydi.",
    },
  });

  return response.text;
}
