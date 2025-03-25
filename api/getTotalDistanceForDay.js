// /api/getTotalDistanceForDay.js
import { GAS_URL } from "./config.js";

export default async function handler(req, res) {
  // ステップ1: POSTメソッドでなければエラー
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドを使用してください" });
  }

  // ステップ2: 必要なパラメータ（sheetName, day）を確認
  const { sheetName, day } = req.body;
  if (!sheetName || day === undefined) {
    return res.status(400).json({ message: "sheetName または day が不足しています" });
  }

  try {
    // ステップ3: GASに対してモード付きでPOST
    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "getTotalDistanceForDay",
        sheetName,
        day
      })
    });

    // ステップ4: GASの返答をJSONとして解析
    const result = await gasRes.json();

    // ステップ5: 成功時はtotalをそのまま返却
    return res.status(200).json({
      total: result.total
    });

  } catch (error) {
    console.error("GAS通信エラー:", error);
    return res.status(500).json({
      message: "GASとの通信に失敗しました",
      error: error.message
    });
  }
}
