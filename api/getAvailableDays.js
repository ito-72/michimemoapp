// /api/getAvailableDays.js

const GAS_URL = "https://script.google.com/macros/s/AKfycbxxCQHPgqIpg7sKjWm6Je0uiCJPvIBnS-dDAckND0bQ2G3ZLmTqUewi8NULFDbsZaZH/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドで送信してください" });
  }

  const { sheetName } = req.body;
  if (!sheetName) {
    return res.status(400).json({ message: "sheetNameが指定されていません" });
  }

  try {
    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "getAvailableDays", sheetName })
    });

    const result = await gasRes.json();
    return res.status(200).json({ days: result.days });

  } catch (error) {
    console.error("GAS連携エラー:", error);
    return res.status(500).json({ message: "GASとの通信に失敗", error: error.message });
  }
}
