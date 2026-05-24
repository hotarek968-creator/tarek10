import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL parsing body middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API endpoints go here FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Chatbot endpoint with Gemini API
  app.post("/api/chatbot", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const systemInstruction = `You are "Mens Grooming BD AI Consultant" - a friendly, highly knowledgeable hair and beard growth advisor representing "Men's Grooming BD" (Contact phone: 01606716918).
Your character and guidelines:
- Answer questions primarily in Bengali (or English if the user asks in English).
- Promote the main solutions: Kirkland Minoxidil 5% (৳১,১৯৯) for hair and beard growth, Premium Dermaroller (৳৪৫০), and the Combo Kit (৳১,৫০০).
- Scientifically explain how Minoxidil stimulates follicle blood circulation to regrow hair. Explain that Minoxidil should be used twice daily (applied on dry clean scalp/beard) and Dermaroller should be used gently twice a week (0.5mm stimulates collagen and opens channels for better Minoxidil absorption).
- Be extremely encouraging, humble, and professional. Mention rapid courier delivery in Bangladesh (inside Dhaka ৳৮০, outside ৳১৫০).
- Keep responses concise, clear, and perfectly formatted using Markdown or bullet points. Avoid paragraphs that are too long.
`;

      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // High quality fallback replying mechanism for full client compatibility
        let text = "";
        const lower = message.toLowerCase();
        if (lower.includes("hello") || lower.includes("হাই") || lower.includes("সালাম") || lower.includes("salam")) {
          text = "আসসালামু আলাইকুম! Men's Grooming BD AI কনসাল্টেশন সার্ভিসে আপনাকে স্বাগতম। দাড়ি গজানো বা চুল পড়া বন্ধ করার জন্য আমাদের সর্বোচ্চ গুণগত মানের কিরকল্যান্ড মিনোক্সিডিল এবং ডার্মারোলার রয়েছে। পণ্য সম্পর্কে জানতে বা কোনো বিষয় পরামর্শ পেতে সরাসরি আমাদের জিজ্ঞেস করুন! অথবা আমাদের হটলাইনে ফোন দিতে পারেন: 01606716918।";
        } else if (lower.includes("price") || lower.includes("দাম") || lower.includes("টাকা")) {
          text = "আমাদের পণ্যগুলোর মূল্য তালিকা নিচে দেওয়া হলো:\n\n* **কিরকল্যান্ড মিনোক্সিডিল ৫% (Kirkland Minoxidil 5%):** ৳১,১৯৯ (প্রতি বোতল)\n* **প্রিমিয়াম ডার্মারোলার (Premium Dermaroller 0.5mm):** ৳৪৫০\n* **ফুল কম্বো কিট (১টি মিনোক্সিডিল + ১টি ডার্মারোলার):** ৳১,৫০০ (আপনার জন্য ৳১৪৯ সাশ্রয়!)\n\nডেলিভারি চার্জ: ঢাকা সিটির ভেতরে ৳৮০, ঢাকার বাইরে ৳১৫০। আপনি খুব সহজেই ওয়েবসাইটে ক্যাশ অন ডেলিভারি বা বিকাশ/নগদে অর্ডার সম্পূর্ণ করতে পারবেন।";
        } else if (lower.includes("ব্যবহার") || lower.includes("rule") || lower.includes("how to use") || lower.includes("নিয়ম")) {
          text = "ব্যবহারের সঠিক নিয়ম নিম্নরূপ:\n\n১. **মিনোক্সিডিল:** প্রতিদিন সকাল এবং রাতে শুষ্ক ও পরিষ্কার দাড়ি বা মাথায় ১ মিলি করে স্প্রে বা ড্রপার দিয়ে মেখে নিন। লাগানোর পর স্ক্রিন আলতোভাবে ম্যাসাজ করুন এবং কমপক্ষে ৪ ঘণ্টা মুখ ধুবেন না।\n২. **ডার্মারোলার:** সপ্তাহে ২-৩ বার রাতে মিনোক্সিডিল ব্যবহারের ২০-৩০ মিনিট আগে হালকা চাপে ব্যবহার করুন। এটি ফলিকলকে উদ্দীপিত করে এবং মিনোক্সিডিল শোষণ ক্ষমতা অনেকাংশে বাড়িয়ে দেয়।";
        } else if (lower.includes("side effect") || lower.includes("পার্শ্বপ্রতিক্রিয়া") || lower.includes("সমস্যা")) {
          text = "প্রাথমিক অবস্থায় ব্যবহার শুরু করলে হালকা শুষ্কতা বা চামড়া উঠা হতে পারে, যা খুবই স্বাভাবিক। তদারকির জন্য পর্যাপ্ত ময়েশ্চারাইজার ব্যবহার করা ভাল। কোনো অ্যালার্জি টেস্ট করতে প্রথমে ত্বকের অল্প জায়গায় লাগিয়ে দেখতে পারেন। আমাদের সামগ্রী বিশ্বখ্যাত কিরকল্যান্ড সিগনেচার ব্রান্ডের আমদানিকৃত এবং শতভাগ অরিজিনাল।";
        } else {
          text = "অত্যন্ত দারুণ একটি প্রশ্ন করেছেন! চুল ও দাড়ি গজাতে মিনোক্সিডিল ৫% (Kirkland Minoxidil 5%) বিশ্বব্যাপী ডার্মাটোলজিস্টদের দ্বারা স্বীকৃত একমাত্র বিজ্ঞানসম্মত সমাধান। আমাদের প্রিমিয়াম ০.৫মিমি ডার্মারোলার চুলের গোড়ায় কোলাজেন বৃদ্ধি করে মিনোক্সিডিলের শোষণকে তিনগুণ বৃদ্ধি করে। আপনি কি আমাদের কম্বো প্যাকটি (মাত্র ৳১,৫০০) অর্ডার করতে আগ্রহী? আমরা সারা বাংলাদেশে দ্রুততম সময়ে হোম ডেলিভারি দিয়ে থাকি!";
        }
        return res.json({ text });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "আমি আপনার কথা ঠিক বুঝতে পারিনি। দয়া করে আবারো জিজ্ঞেস করুন।" });
    } catch (e: any) {
      console.error("Gemini server-side route error: ", e);
      res.status(500).json({ error: "Gemini server response error. Please try again!" });
    }
  });

  // Location/mapping optimization endpoint
  app.post("/api/delivery/route", (req, res) => {
    const { userLat, userLng } = req.body;
    // BD Men's Grooming hub coords: (approx center of Dhaka)
    const hubLat = 23.8103;
    const hubLng = 90.4125;

    let distanceKm = 15; // default
    if (userLat && userLng) {
      // Direct haversine approximation
      const R = 6371; // km
      const dLat = (userLat - hubLat) * Math.PI / 180;
      const dLng = (userLng - hubLng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(hubLat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distanceKm = R * c;
    }

    // Estimate rapid delivery duration based on distance
    // In Dhaka average speed 15km/h, simple delivery factor
    const estimatedHours = Math.max(1, Math.min(48, Math.round(distanceKm * 1.5)));
    res.json({
      hubLocation: { lat: hubLat, lng: hubLng },
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      estimatedHours,
      fastDeliveryEligible: distanceKm < 25
    });
  });

  // Serve Vite app based on Environment Mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MensGroomingBD] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
