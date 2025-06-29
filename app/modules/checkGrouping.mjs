import { getNowDate } from "../modules/getDate.mjs";
import {
  TARGET_CREATE_THREAD,
  REACTION_EMOJI,
  ROTATION_CH_ID,
  PRIVATE_CH_ID,
} from "../consts.mjs";

export default async (message) => {
  try {
    const parentMessage = await message.channel.fetchStarterMessage();
    // 元メッセージが取得できなかった
    if (!parentMessage) {
      await message.channel.send("元のメッセージを取得できませんでした。");
      return;
    }

    REACTION_EMOJI.forEach(async (emoji) => {
      // 埋め込みのメンションを格納する
      let userIds = new Set();
      const fetchedMessages = await message.channel.messages.fetch({
        limit: 100,  // MAX100件(これ以上は増やせない)
      });

      // メッセージを昇順に並び替え
      const botMessages = Array.from(
        fetchedMessages.filter((msg) => msg.author.bot).values()
      ).reverse();

      botMessages.forEach((msg) => {
        // 埋め込みがあれば
        if (msg.embeds.length > 0) {
          msg.embeds.forEach((embed) => {
            // embedの中にdescriptionがあり、且つ対象の絵文字が含まれている場合
            if (embed.description) {
              if (embed.description.includes(`<:${emoji.name}:${emoji.id}>`)) {
                const mentionRegex = /<@(\d+)>/g;
                const matches = [...embed.description.matchAll(mentionRegex)];

                // mentionRegexにマッチしたものがあれば
                if (matches.length > 0) {
                  matches.forEach((match) => {
                    const userId = match[1];

                    // 0x008000(参加カラー)は追加、0xdc143c(取り消しカラー)は削除
                    if (embed.color === 0x008000) {
                      userIds.add(userId);
                    } else if (embed.color === 0xdc143c) {
                      userIds.delete(userId);
                    }
                  });
                }
              }
            }
          });
        }
      });

      // userIdsを配列に変換
      const userList = Array.from(userIds);
      if (userList.length > 0) {
        const groups = splitIntoGroups(userList);
        console.log(groups);
        // グループをメッセージとして送信
        let response = `**<:${emoji.name}:${emoji.id}> リアクションユーザーをグループ分けしました:**\n`;
        groups.forEach((group, index) => {
          if (group.length < 8) {
            response += `**解散:** ${group
              .map((user) => `<@${user}>`)
              .join("、")}\n`;
          } else {
            response += `**グループ ${index + 1}:** ${group
              .map((user) => `<@${user}>`)
              .join("、")}\n`;
          }
        });
        await message.channel.send(response);
      } else {
        console.log(
          `<:${emoji.name}:${emoji.id}>リアクションを押したユーザーがいませんでした`
        );
      }
    });
  } catch (error) {
    await message.channel.send("!Check使用中にエラーが発生しました。");
    console.error("!Checkエラー:", error);
  }
};

function splitIntoGroups(array) {
  let num = array.length;
  let result = [];

  if (num < 8) {
    return createTeams(array, 1, 8);
  }
  for (let n = 8; n <= 10; n++) {
    if (num % n == 0) {
      return createTeams(array, Math.floor(num / n), n);
    }
  }

  for (let n = 8; n <= 10; n++) {
    for (let i = 1; i < n; i++) {
      if (num % n == i) {
        let cnt = Math.floor(num / n);
        if (n != 10 && cnt - i < 0) {
          continue;
        }
        if (n != 10) {
          return [
            ...createTeams(array.slice(0, (cnt - i) * n), cnt - i, n),
            ...createTeams(array.slice((cnt - i) * n), i, n + 1),
          ];
        } else {
          return [
            ...createTeams(array.slice(0, cnt * n), cnt, n),
            ...createTeams(array.slice(cnt * n), 1, i),
          ];
        }
      }
    }
  }
}

function createTeams(array, count, size, startTeamNumber) {
  let teams = [];
  for (let i = 0; i < count; i++) {
    teams.push(array.slice(size * i, size * (i + 1)));
  }
  return teams;
}
