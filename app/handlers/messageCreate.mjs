import { getNowDate } from "../modules/getDate.mjs";
import checkGrouping from "../modules/checkGrouping.mjs";
import {
  TARGET_CREATE_THREAD,
  REACTION_EMOJI,
  ROTATION_CH_ID,
  PRIVATE_CH_ID,
  PROFILE_CH_ID,
  PROFILE_EMOJI,
  LATE_NIGHT_MENTION_ID,
} from "../consts.mjs";
import { sendLog } from "../modules/sendLog.mjs";

/**
 * メッセージ送信時の処理
 * @param {*} message 
 */
export default async (message) => {
  const channelId = message.channel.id;
  try {
    // キャッシュ
    await message.author.fetch();
    // 各種チャンネルに対応したメンションのみスレ立て
    for (const { ch, mention } of TARGET_CREATE_THREAD) {
      if (channelId === ch && (message.mentions.roles.has(mention) || message.mentions.roles.has(LATE_NIGHT_MENTION_ID))) {
        const now = getNowDate();
        // スレッド作成
        if (!message.thread) {
          const thread = await message.startThread({
            name: `返信スレッド - ${message.author.globalName}さんの募集_${now}`,
          });
          console.log(message.channel);
          sendLog(false, `<#${channelId}>`, `スレッド作成しました: ${thread.name}`);
        } else {
          console.log(`既にスレッドが作成されている or スレッド内のメッセージ`);
        }
      }
    }
  } catch (e) {
    await message.reply(
      "スレッドが作成できませんでした。\n手動で作成をお願いします。"
    );
    sendLog(true, `<#${channelId}>`, "message", e);
    console.error("エラー:", e);
  }

  // チェック
  try {
    if (
      message.content.startsWith("!Check") &&
      message.channel.isThread() &&
      (message.channel.parentId == ROTATION_CH_ID ||
        message.channel.parentId == PRIVATE_CH_ID)
    ) {
      checkGrouping(message);
    }
  } catch (e) {
    await message.reply("!Check使用中にエラーが発生しました。");
    sendLog(true, `<#${channelId}>`, "message", e);
  }

  try {
    if (channelId === PROFILE_CH_ID) {
      await message.react(`<:${PROFILE_EMOJI.name}:${PROFILE_EMOJI.id}>`);
    }
  } catch (e) {
    sendLog(true, `<#${channelId}>`, "message", e);
  }
};
