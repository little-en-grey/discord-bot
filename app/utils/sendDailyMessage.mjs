import {
    DAILY_CH_ID
} from "../consts.mjs";
import { sendLog } from "../modules/sendLog.mjs";
import { Client } from 'discord.js';

/**
 * 日次メッセージ送信
 * @param {Client} client
 */
export default async (client) => {
    try {
        // 日次用チャンネルを取得
        const channel = await client.channels.fetch(DAILY_CH_ID);
        if (!channel || !channel.isTextBased()) {
            sendLog(false, `日次メッセージ送信`, "チャンネルが見つからないか、テキストチャンネルではありません。");
            console.error(
                "チャンネルが見つからないか、テキストチャンネルではありません。"
            );
            return;
        }
        await channel.send(`募集案件以外で本日活動した人はこのメッセージにリアクションをお願いします`);
        sendLog(false, `日次メッセージ送信`, `日次メッセージを送信しました`);
    } catch (e) {
        sendLog(true, `日次メッセージ送信`, "message", e);
    }
}