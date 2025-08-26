import { getThisWeekDay, } from "../modules/getDate.mjs";
import { PRIVATE_MENTION_ID, ROTATION_CH_ID } from "../consts.mjs";
import { sendLog } from "../modules/sendLog.mjs";

/**
 * 
 * @param {*} client 
 * @returns 
 */
export default async (client) => {
  try {
    const channel = await client.channels.fetch(ROTATION_CH_ID);
    if (!channel || !channel.isTextBased()) {
      console.error(
        "チャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }
    const friday = getThisWeekDay();
    const fridayStr = `${friday.month}_${friday.day}`;

    const messages = await channel.messages.fetch({ limit: 10 });
    let targetThread = null;

    for (const message of messages.values()) {
      if (message.hasThread) {
        const thread = message.thread;

        // スレッド名の末尾チェック (xxxxxxx_m_d)
        const match = thread.name.match(/_(\d+)_(\d+)$/);
        if (match) {
          const [, m, d] = match;
          if (`${m}_${d}` === fridayStr) {
            targetThread = thread;
            break;
          }
        }
      }
    }

    if (!targetThread) {
      console.log("条件に合うスレッドが見つかりませんでした");
      return;
    }

    // スレッドにメッセージを送信
    await targetThread.send(
      `### <@&${PRIVATE_MENTION_ID}>\n定例ローテプラベリマインドです！`
    );

    console.log(`メッセージを送信しました: ${targetThread.name}`);
  } catch (e) {
    sendLog(true, `プラベリマインド送信`, "message", e);
  }
}
