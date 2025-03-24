//checkApiUsage.js

const GAS_URL = "https://script.google.com/macros/s/AKfycby8UGsJ_65JvZwD3S5xudzjFbFnwKYxYDe6OutmHvHa4iprCcdPwkxaxn0GGuS9NLBW/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドで送信してください" });
  }

  try {
    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "checkApiUsage" })
    });

    const result = await gasRes.json();
    return res.status(200).json(result); // { count: 7, limit: 200 } など

  } catch (error) {
    console.error("API使用状況取得エラー:", error);
    return res.status(500).json({ message: "GASとの通信に失敗しました" });
  }
}