export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドで送信してください" });
  }

  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "緯度または経度が不足しています" });
  }

  const GAS_URL = process.env.GAS_URL;

  // 現在日時（日本時間ベース）
  const now = new Date();
  const month = now.getMonth() + 1; // 0月始まりなので+1
  const day = now.getDate();
  const time = now.toLocaleTimeString("ja-JP", { hour12: false });

  const payload = {
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
      raw: result // 必要に応じて全体を返す
    });

  } catch (error) {
    console.error("GAS連携エラー:", error);
    return res.status(500).json({
      message: "GASへの送信に失敗しました",
      error: error.message
    });
  }
}
