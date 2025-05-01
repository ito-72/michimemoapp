// /api/getTotalDistanceForMonth.js
import { GAS_URL } from "./config.js";

export default async function handler(req, res) {
  // POSTメソッド以外は拒否
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドで送信してください" });
  }

  const { year, month } = req.body;

  // パラメータ確認
  if (!year || !month) {
    return res.status(400).json({ message: "year または month が不足しています" });
  }

  try {
    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "getTotalDistanceForMonth",
        year,
        month
      })
    });

    const result = await gasRes.json();
    return res.status(200).json({ total: result.total });

  } catch (error) {
    console.error("GAS通信エラー:", error);
    return res.status(500).json({
      message: "GASとの通信に失敗しました",
      error: error.message
    });
  }
}
