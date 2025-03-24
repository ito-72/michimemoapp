export default function handler(req, res) {
  if (req.method === "POST") {
    const { lat, lng } = req.body;

    // 緯度・経度がなければエラー
    if (!lat || !lng) {
      return res.status(400).json({ message: "緯度または経度が送られていません" });
    }

    // 送られてきた緯度・経度をそのまま返す
    return res.status(200).json({
      message: `緯度: ${lat}, 経度: ${lng} を受け取りました`
    });
  }

  // POST以外は拒否
  res.status(405).json({ message: "POSTメソッドで送信してください" });
}
