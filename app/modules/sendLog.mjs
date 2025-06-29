import fetch from "node-fetch";
import { LOG_WEBHOOK_URL } from "../consts.mjs";

export async function sendLog(isError, source, message = "", error = null) {
  try {
    const today = new Date();
    // today.setHours(today.getHours() + 9);

    let payload = "";
    if (isError) {
      payload = {
        embeds: [
          {
            title: "🚨 TEST:エラー発生",
            color: 0xff0000, // 赤色
            fields: [
              { name: "発生場所", value: source, inline: true },
              {
                name: "エラーメッセージ",
                value: `\`\`\`${error.stack || error}\`\`\``,
              },
            ],
            timestamp: today,
          },
        ],
      };
    } else {
      payload = {
        embeds: [
          {
            title: "TEST:ログ",
            color: 0xffd700, // 金
            fields: [
              { name: "場所", value: source, inline: true },
              {
                name: "メッセージ",
                value: `${message}`,
              },
            ],
            timestamp: today,
          },
        ],
      };
    }

    await fetch(LOG_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("エラーログを Webhook に送信しました。");
  } catch (err) {
    console.error("Webhook 送信失敗:", err);
  }
}
