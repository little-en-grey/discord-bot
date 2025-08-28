import {
    getYesterdayJST
} from "../modules/getDate.mjs";
import {
    TARGET_CREATE_THREAD,
    REACTION_EMOJI,
    ROTATION_CH_ID,
    LATE_NIGHT_MENTION_ID,
    DAILY_CH_ID
} from "../consts.mjs";
import { sendLog } from "../modules/sendLog.mjs";
import { Client } from 'discord.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';

/**
 * 参加ログ取得
 * @param {Client} client 
 * @param {GoogleSpreadsheet} doc 
 */
export default async (client, doc) => {
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

            console.log(ch)
            console.log(ROTATION_CH_ID)
            console.log(dayOfWeek)
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
                console.log("定例チェック")
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

        // 日次
        const dailyChannel = await client.channels.fetch(DAILY_CH_ID);
        if (dailyChannel && dailyChannel.isTextBased()) {
            console.log("日次チェック")
            let messages = await dailyChannel.messages.fetch({
                limit: 3,
            });

            let botMessage = messages.find(msg => {
                const createdAtJST = new Date(msg.createdAt);
                createdAtJST.setUTCHours(createdAtJST.getUTCHours() + 9);
                const createdAtJSTString = createdAtJST
                    .toISOString()
                    .split("T")[0];

                return (createdAtJSTString === yesterday && msg.author.bot)
            });

            console.log('botMessage')
            console.log(botMessage)

            if (botMessage) {
                for (const reaction of botMessage.reactions.cache.values()) {
                    console.log(reaction)
                    const users = await reaction.users.fetch();
                    users.forEach((user) => {
                        if (!user.bot) userIds.add(user.id); // ボットは除外
                    });
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
}