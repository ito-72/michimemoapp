// /api/getSheetNames.js

const GAS_URL = "https://script.google.com/macros/s/AKfycbxlsibzExm6gm76tVjWq9X4MAnRqKnIcw4tokxCgVHBxlLixcokj8Y39C4XXxpaQw_I/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドで送信してください" });
  }

  try {
    // ✅ GASに mode を指定してPOST
    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "getSheetNames" })
    });

    const result = await gasRes.json();
    return res.status(200).json({ sheetNames: result.sheetNames });
  } catch (error) {
    console.error("GAS連携エラー:", error);
    return res.status(500).json({ message: "GAS連携に失敗しました", error: error.message });
  }
}
