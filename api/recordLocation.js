// ✅ config.jsからGAS_URLを読み込み
import { GAS_URL } from "./config.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドで送信してください" });
  }

  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "緯度または経度が不足しています" });
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const time = now.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const payload = {
    mode: "recordLocation",
    month,
    day,
    time,
    lat,
    lng
  };

  try {
    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await gasRes.json();

    return res.status(200).json({
      message: result.status || "GASに送信成功",
      raw: result
    });

  } catch (error) {
    console.error("GAS連携エラー:", error);
    return res.status(500).json({
      message: "GASへの送信に失敗しました",
      error: error.message
    });
  }
}
