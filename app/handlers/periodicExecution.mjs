import { ThreadAutoArchiveDuration, User, EmbedBuilder } from "discord.js";
import cron from "node-cron";
import {
  getNowDate,
  getThisWeekDay,
  getFridayCountInMonth,
  getYesterdayJST
} from "../modules/getDate.mjs";
import {
  TARGET_CREATE_THREAD,
  REACTION_EMOJI,
  ROTATION_RULE,
  PRIVATE_MENTION_ID,
  ROTATION_CH_ID,
  LATE_NIGHT_MENTION_ID
} from "../consts.mjs";
import { sendLog } from "../modules/sendLog.mjs";

export default async (client, doc) => {
  try {
    // 毎日10時に実行
    cron.schedule("0 10 * * *",
      async () => {
        try {
          let userIds = new Set();
          const yesterday = getYesterdayJST();

          const today = new Date();
          today.setHours(today.getHours() + 9); // 日本時間に
          const dayOfWeek = today.getDay();

          for (const { ch, mention } of TARGET_CREATE_THREAD) {
            const channel = await client.channels.fetch(ch);
            if (!channel || !channel.isTextBased()) {
              console.log(
                `チャンネル ${ch} が見つからないか、テキストチャンネルではありません。`
              );
              continue;
            }

            if (ch != ROTATION_CH_ID) {
              let fetchedMessages = await channel.messages.fetch({
                limit: 100,
              });
              let filteredMessages = fetchedMessages.filter((msg) => {
                // 日本時間での作成日を取得
                const createdAtJST = new Date(msg.createdAt);
                createdAtJST.setUTCHours(createdAtJST.getUTCHours() + 9);
                const createdAtJSTString = createdAtJST
                  .toISOString()
                  .split("T")[0];
                return (
                  createdAtJSTString === yesterday &&
                  (msg.mentions.roles.has(mention) ||
                    msg.mentions.roles.has(LATE_NIGHT_MENTION_ID))
                );
              });

              for (const message of filteredMessages.values()) {
                for (const { id } of REACTION_EMOJI) {
                  const reaction = message.reactions.cache.get(id);
                  if (reaction) {
                    const users = await reaction.users.fetch();
                    users.forEach((user) => {
                      if (!user.bot) userIds.add(user.id); // ボットは除外
                    });
                  }
                }
              }
            } else if (ch === ROTATION_CH_ID && dayOfWeek == 4) {
              let fetchedMessages = await channel.messages.fetch({
                limit: 10,
              });
              let botMessage = fetchedMessages.find(msg => msg.author.bot);

              if (botMessage) {
                for (const { id } of REACTION_EMOJI) {
                  const reaction = botMessage.reactions.cache.get(id);
                  if (reaction) {
                    const users = await reaction.users.fetch();
                    users.forEach((user) => {
                      if (!user.bot) userIds.add(user.id); // ボットは除外
                    });
                  }
                }
              }
            }
          }

          // ノルマ書き込み
          const userList = Array.from(userIds);
          await doc.loadInfo();
          // シート名を配列に指定
          const sheet = doc.sheetsByTitle["案件チェック"];
          // データをスプレッドシートに追加
          for (let i = 0; i < userList.length; i++) {
            await sheet.addRow({
              Date: yesterday,
              ID: userList[i],
            });
          }
          sendLog(false, `ノルマログの取得`, `先日の参加者を取得しました`);
        } catch (e) {
          sendLog(true, `ノルマログの取得`, "message", e);
        }
      },
      {
        timezone: "Asia/Tokyo",
      }
    );

    // 定例プラベ
    const rotateChannel = await client.channels.fetch(ROTATION_CH_ID);
    if (!rotateChannel || !rotateChannel.isTextBased()) {
      console.error(
        "チャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }

    // 毎週月曜日12時に実行
    cron.schedule("0 12 * * 1",
      async () => {
        await weeklyNotice(rotateChannel);
      },
      {
        timezone: "Asia/Tokyo",
      }
    );

    // 毎週水曜日12時に実行
    cron.schedule("0 12 * * 3",
      async () => {
        await reminder(rotateChannel);
      },
      {
        timezone: "Asia/Tokyo",
      }
    );
  } catch (error) {
    sendLog(true, `活動ログ取得`, "message", error);
  }
};

async function weeklyNotice(channel) {
  try {
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

async function reminder(channel) {
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
}
