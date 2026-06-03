import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Gemini
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
  }
  return aiClient;
}

// 1. Health API
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 2. Real Gemini Group Chat AI Reply endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { 
    groupTitle, 
    groupLocation, 
    groupCategory, 
    groupDescription, 
    groupMembers, 
    currentUserNickname, 
    chatHistory 
  } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Graceful fallback response when GEMINI_API_KEY is not configured
    const mockResponses = [
      "哈哈，超酷的耶！我也快到囉，在路上買個飲料～",
      "真的嗎！太棒了，等下一起玩！✨",
      "哈哈，笑死我，真假啦！😆",
      "對啊，今天天氣很好，等下可以去買個點心吃～"
    ];
    const chosenMock = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Choose a non-creator other member as the sender
    const candidates = groupMembers ? groupMembers.filter((m: any) => m.name !== currentUserNickname) : [];
    const senderObj = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : { name: "阿強", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZooWErYW0mIoxU3cpTPohcmT1Cr8ClR3CRRVu2xh5R1g0G9utrrHEusrBJ5JzkD8cIaXqn4o89DoPmpr92sLjzUXx3-g9TQgXaiWh_yDiNW7LzoErV8Zuuhjlaz8xVpVhcBqbwtpAly49YQh0nhqhCoxzFNrux2o5pIc723Kdq5A7UuZJME6kVxs1nL26001cyv8GI-HIlMiHcfxhga7TSeOAwHgjLNksSnZFAK2Dwn8koYBxi-Kq-RsnJomDFQ4l74YdCAsTqNSn" };

    return res.json({
      sender: senderObj.name,
      senderAvatar: senderObj.avatarUrl,
      text: chosenMock,
    });
  }

  try {
    // Select candidates for the responder from the group's members who are not the current user
    const otherMembers = groupMembers 
      ? groupMembers.filter((m: any) => m.name !== currentUserNickname) 
      : [{ name: "阿強", avatarUrl: "" }];
    
    const availableNames = otherMembers.map((m: any) => m.name).join(", ");
    
    const systemInstruction = `
You are roleplaying as a real university classmate in a real-time group chat of a campus flash group (校園空堂快閃揪團).
The group title is: "${groupTitle}" (Category: ${groupCategory})
Location: ${groupLocation}
Description: ${groupDescription}
The active members in this group chat are: [${availableNames}] and you must roleplay as ONE of them.
The current user you are talking to is: ${currentUserNickname}.

Choose ONE of [${availableNames}] to reply. 
Your response MUST be in natural, friendly, chilled Traditional Chinese (zh-TW) as used by Taiwanese college students (using slang like 喔, 啦, 耶, 欸, 超酷的, 笑死, 真假, 哈哈, 課表, 空堂, etc.).
Keep it brief (under 50 characters) and contextually relevant to what was said. Do not output anything other than JSON with 'sender' and 'text'.

JSON schema response requirement:
{
  "sender": "chosen classmate name matching EXACTLY one of the names in [${availableNames}]",
  "text": "your direct chat message response"
}
`;

    const formattedHistory = chatHistory
      ? chatHistory.slice(-10).map((m: any) => `${m.sender}: ${m.text}`).join("\n")
      : "";

    const prompt = `Here is the recent chat history in the group. Please choose one available classmate to reply to the latest message.\nRecent Messages:\n${formattedHistory}\n\nPlease reply now.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.85,
      },
    });

    const bodyText = response.text || "{}";
    const resultObj = JSON.parse(bodyText.trim());

    // Fallback if returned sender is invalid
    const defaultResponseSender = otherMembers[0]?.name || "阿強";
    const chosenSenderObj = otherMembers.find((m: any) => m.name === resultObj.sender) || otherMembers[0];

    res.json({
      sender: chosenSenderObj?.name || defaultResponseSender,
      senderAvatar: chosenSenderObj?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCZooWErYW0mIoxU3cpTPohcmT1Cr8ClR3CRRVu2xh5R1g0G9utrrHEusrBJ5JzkD8cIaXqn4o89DoPmpr92sLjzUXx3-g9TQgXaiWh_yDiNW7LzoErV8Zuuhjlaz8xVpVhcBqbwtpAly49YQh0nhqhCoxzFNrux2o5pIc723Kdq5A7UuZJME6kVxs1nL26001cyv8GI-HIlMiHcfxhga7TSeOAwHgjLNksSnZFAK2Dwn8koYBxi-Kq-RsnJomDFQ4l74YdCAsTqNSn",
      text: resultObj.text || "等等見呀！",
    });

  } catch (error: any) {
    console.error("Gemini Group Chat reply error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Local Smart Recommendation Rule Engine fallback helper
function getLocalRecommendation(userPrompt: string, rooms: any[], flashGroups: any[], currentUserNickname: string, errorMsg?: string): string {
  const lowUserPrompt = (userPrompt || "").toLowerCase();
  
  // Find which rooms/groups match the search query by direct keyword or tag
  let matchedRooms = (rooms || []).filter((r: any) => 
    r.name.toLowerCase().includes(lowUserPrompt) || 
    r.location?.toLowerCase().includes(lowUserPrompt) || 
    r.description?.toLowerCase().includes(lowUserPrompt) ||
    (r.tags || []).some((t: string) => t.toLowerCase().includes(lowUserPrompt)) ||
    (r.amenities || []).some((a: string) => a.toLowerCase().includes(lowUserPrompt))
  );
  
  let matchedGroups = (flashGroups || []).filter((g: any) => 
    g.title.toLowerCase().includes(lowUserPrompt) || 
    g.location?.toLowerCase().includes(lowUserPrompt) || 
    g.category?.toLowerCase().includes(lowUserPrompt) || 
    g.description?.toLowerCase().includes(lowUserPrompt)
  );

  // Focus-keyword matches if first check is sparse
  if (matchedRooms.length === 0 && matchedGroups.length === 0) {
    if (lowUserPrompt.includes("遊戲") || lowUserPrompt.includes("車") || lowUserPrompt.includes("switch") || lowUserPrompt.includes("玩")) {
      matchedGroups = (flashGroups || []).filter((g: any) => g.category?.includes("娛樂") || g.title?.includes("Switch") || g.title?.includes("賽車"));
      matchedRooms = (rooms || []).filter((r: any) => r.id === 'm_sofa' || r.description?.includes("沙發") || r.description?.includes("遊"));
    } else if (lowUserPrompt.includes("桌遊") || lowUserPrompt.includes("牌") || lowUserPrompt.includes("阿瓦隆") || lowUserPrompt.includes("心機")) {
      matchedGroups = (flashGroups || []).filter((g: any) => g.title?.includes("阿瓦隆") || g.category?.includes("桌遊") || g.category?.includes("聚會"));
      matchedRooms = (rooms || []).filter((r: any) => r.id === 'r402' || r.description?.includes("討論"));
    } else if (lowUserPrompt.includes("安靜") || lowUserPrompt.includes("書") || lowUserPrompt.includes("自習") || lowUserPrompt.includes("睡") || lowUserPrompt.includes("累")) {
      matchedRooms = (rooms || []).filter((r: any) => r.type === "靜音區" || r.id === 's204' || r.id === 'lib_silent');
    } else if (lowUserPrompt.includes("討論") || lowUserPrompt.includes("螢幕") || lowUserPrompt.includes("報告") || lowUserPrompt.includes("會議")) {
      matchedRooms = (rooms || []).filter((r: any) => r.type === "討論室" || r.id === 'r402' || r.id === 'm101');
    }
  }

  // Safety fallbacks
  if (matchedRooms.length === 0) {
    matchedRooms = (rooms || []).slice(0, 2);
  }
  if (matchedGroups.length === 0) {
    matchedGroups = (flashGroups || []).slice(0, 1);
  }

  let matchedIntro = `### 🌟 SHU-Chill AI 智慧導航推薦\n\n哈囉！**${currentUserNickname}**，小幫手已為您無縫啟動世新智慧空間比對分析系統，並為您完成校園空間與即時快閃揪團的雙向熱連動！✨\n\n根據您的空堂情境與偏好**「${userPrompt}」**，我們為您篩選匹配到以下最完美的選項：\n\n`;

  matchedRooms.forEach((r: any) => {
    matchedIntro += `#### 🏫 推薦空間：${r.name}\n`;
    matchedIntro += `-${r.description}\n`;
    matchedIntro += `- **容納限制**：${r.capacity} ✕ **特色環境**：${r.type}\n`;
    matchedIntro += `[🚀 預約此空間 | ROOM:${r.id}]\n\n`;
  });

  if (matchedGroups.length > 0) {
    matchedIntro += `#### 💬 熱烈招募中的快閃揪團：\n`;
    matchedGroups.forEach((g: any) => {
      matchedIntro += `- **${g.categoryEmoji || '✨'} ${g.title}**\n`;
      matchedIntro += `  *地點*：${g.location} (目前 ${g.currentParticipants}/${g.maxParticipants} 人)\n`;
      matchedIntro += `  [💬 加入此快閃 | GROUP:${g.id}]\n\n`;
    });
  }

  return matchedIntro;
}

// 3. Real Gemini-powered Conversational Recommendation Search Endpoint
app.post("/api/gemini/recommend", async (req, res) => {
  const { userPrompt, rooms, flashGroups, currentUserNickname } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    const fallbackResponse = getLocalRecommendation(userPrompt, rooms, flashGroups, currentUserNickname, "Key not set");
    return res.json({ text: fallbackResponse });
  }

  try {
    const serializedRooms = JSON.stringify(rooms, null, 2);
    const serializedGroups = JSON.stringify(flashGroups, null, 2);

    const systemInstruction = `
You are the "SHU-Chill" Campus Space AI Scout (世新空堂空間搜尋導航小幫手). 
Your task is to analyze Taiwanese university campus students' empty period (空堂) scenario, preferences, and desires, and match them with the listed rooms and current flash groups.

Available Campus Spaces & Rooms:
${serializedRooms}

Active Flash Groups to Join:
${serializedGroups}

Current User: ${currentUserNickname}

Instructions:
1. Provide a friendly, conversational reply in Traditional Chinese (zh-TW, Taiwan terms: e.g. 舍我樓, 管院, 圖書館, 揪團, 快閃, 空堂, 沙發區) matching the student's vibe.
2. Directly analyze their situation, tell them exactly WHICH spaces or flash groups are ideal and WHY.
3. Keep your advice practical: highlight their capacity, quietness, amenities (插座, WiFi, 可飲食, etc.) or open groups.
4. Output beautifully structured Markdown. 
5. Under your recommendations, provide structured markers in the reply that the frontend can parse into interactive CTA buttons. For each space or group you suggest, you can append a quick action tag block:
   For a room: [🚀 預約此空間 | ROOM:roomId]
   For a flash group: [💬 加入此快閃 | GROUP:groupId]
   Example: 
   "如果你想要安靜討論，我推薦 **舍我樓 R402 討論室**，環境超好！
   [🚀 預約此空間 | ROOM:r402]
   
   或者是加入大夥熱烈討論的 Switch 賽車團：
   [💬 加入此快閃 | GROUP:f1]"

Keep the tone encouraging, super helpful, and fun!
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `User scenario query: "${userPrompt}"\nSuggest best rooms and flash groups to join for ${currentUserNickname}.`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "無法生成推薦，請稍後再試。" });

  } catch (error: any) {
    console.error("Gemini Recommendation error (falling back to local smart engine):", error);
    // In case of actual generation failure, fall back to local rule engine instead of crashing
    const fallbackResponse = getLocalRecommendation(userPrompt, rooms, flashGroups, currentUserNickname, error.message || "Failed");
    res.json({ text: fallbackResponse });
  }
});


// 4. Vite and SPA static bundle handlers
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SHU-Chill Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
