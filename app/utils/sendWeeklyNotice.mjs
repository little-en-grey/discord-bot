import { EmbedBuilder } from "discord.js";
import {
  getThisWeekDay,
  getFridayCountInMonth,
} from "../modules/getDate.mjs";
import {
  REACTION_EMOJI,
  ROTATION_RULE,
  PRIVATE_MENTION_ID,
  ROTATION_CH_ID
} from "../consts.mjs";
import { sendLog } from "../modules/sendLog.mjs";

/**
 * 
 * @param {*} client 
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

    const day = getThisWeekDay();
    const count = getFridayCountInMonth(day);
    const rule = ROTATION_RULE[count - 1];
    const threadName = `定例ローテプラベ_${day.month}_${day.day}`;

    const ruleText = {
      join_1: `22:00〜23:00前: ${rule.sub_rule}`,
      join_2: `23:00〜0:00: ${rule.main_rule}`,
    };
    const reactionLines = REACTION_EMOJI
      .filter(e => e.name !== "join_3")
      .map(e => `<:${e.name}:${e.id}> ${ruleText[e.name]}`)
      .join("\n");

    const message =
      "中止判断：当日21時" +
      "\n" +
      reactionLines +
      "\n\n" +
      "- 参加希望者は対象のリアクションを押すこと" +
      "\n" +
      "  - 射程申告はスレッド内にて" +
      "\n" +
      "- 部屋主は挙手制" +
      "\n" +
      "- 16人以上集まったら2部屋" +
      "\n" +
      "  - 部屋分けは「!Check」にて" +
      "\n" +
      "  - 観戦のありなしはどちらでも（集まった人数で柔軟に）" +
      "\n" +
      "- 参加人数はリアクションの数-1(botのリアクション)";

    const embed = new EmbedBuilder()
      .setTitle(
        `【定例ローテプラベ：${day.day}水】${rule.main_rule}+${rule.sub_rule}`
      )
      .setDescription(message)
      .setColor("Random");

    const sentMessage = await channel.send({
      content: `### <@&${PRIVATE_MENTION_ID}>\n定例ローテプラベのお知らせ`,
      embeds: [embed],
    });

    // リアクション
    for (const emoji of REACTION_EMOJI) {
      if (emoji.name != "join_3") {
        await sentMessage.react(`<:${emoji.name}:${emoji.id}>`);
      }
    }

    // スレッドを作成
    const thread = await sentMessage.startThread({
      name: threadName,
    });

    await thread.send(
      "参加希望の方は各リアクションを押してください。\n連絡事項がある方はスレッド内に記入をお願いします。"
    );
  } catch (e) {
    sendLog(true, `定例プラベ送信`, "message", e);
  }
}