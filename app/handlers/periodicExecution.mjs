import { Client } from "discord.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';

import cron from "node-cron";
import getTarget from "../utils/getTarget.mjs";
import setDaily from "../utils/sendDailyMessage.mjs";
import sendWeeklyNotice from "../utils/sendWeeklyNotice.mjs";
import sendReminder from "../utils/sendReminder.mjs";
import { sendLog } from "../modules/sendLog.mjs";

/**
 * 
 * @param {Client} client 
 * @param {GoogleSpreadsheet} doc 
 */
export default async (client, doc) => {
  try {
    // 毎日10時に実行
    cron.schedule("0 10 * * *", async () => {
      // 参加ログ取得
      getTarget(client, doc);
      // 日次メッセージ送信
      setDaily(client);
    }, { timezone: "Asia/Tokyo", });

    // 毎週月曜日12時に実行
    cron.schedule("0 12 * * 1", async () => {
      await sendWeeklyNotice(client);
    }, { timezone: "Asia/Tokyo", });

    // 毎週水曜日12時に実行
    cron.schedule("0 12 * * 3", async () => {
      await sendReminder(client);
    }, { timezone: "Asia/Tokyo", });
  } catch (error) {
    sendLog(true, `定時実行`, "message", error);
  }
};
