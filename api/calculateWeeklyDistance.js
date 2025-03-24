// GASのエンドポイントURL（★あなたのURLに差し替えてください）
const GAS_URL ="https://script.google.com/macros/s/AKfycbx6648qHNjOOZ0jGymU8dQAZluhtj017aDuUEVVqwpEagVpu4_l2stvv2MMaHUgyrkg/exec"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POSTメソッドを使用してください。" });
  }

  // 日本時間で現在の日付を取得
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // GASへ送るペイロード（年月日だけでOK）
  const payload = {
    mode: "calculateDistance", // 処理判定用（GAS側で分岐）
    year,
    month,
    day
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
      message: result.message || "GASからの返答を受信しました。",
      raw: result
    });

  } catch (error) {
    console.error("GAS通信エラー:", error);
    return res.status(500).json({ message: "GASへの通信に失敗しました。" });
  }
}
