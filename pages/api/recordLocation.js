export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTのみ対応しています" });
  }

  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "緯度または経度が不足しています" });
  }

  const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;
  const GAS_WEBHOOK_URL = process.env.GAS_WEBHOOK_URL;

  try {
    // 1. Geocoding API で住所を取得
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GEOCODING_API_KEY}`
    );
    const geoData = await geoRes.json();

    const address =
      geoData.results?.[0]?.formatted_address || "住所が取得できませんでした";

    // 2. GASにデータをPOST
    const now = new Date().toISOString(); // ISO形式の時刻（日本時間にしたければ要調整）

    const gasResponse = await fetch(GAS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: now,
        lat,
        lng,
        address
      })
    });

    const gasResult = await gasResponse.json();

    // 3. 成功レスポンスを返す
    return res.status(200).json({
      message: gasResult.status || "記録に成功しました",
      address
    });
  } catch (error) {
    console.error("APIエラー:", error);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
}
