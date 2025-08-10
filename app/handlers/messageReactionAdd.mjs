import { EmbedBuilder } from "discord.js";
import {
  TARGET_CREATE_THREAD,
  REACTION_EMOJI,
  CLOSE_EMOJI,
} from "../consts.mjs";


/**
 * リアクション追加時の処理
 * @param {*} reaction 
 * @param {*} user 
 */
export default async (reaction, user) => {
  try {
    if (user.bot) return; // Botのリアクションは無視

    // リアクションしたチャンネルが対象のチャンネルか
    const channelId = reaction.message.channelId;
    const taegetChannel = TARGET_CREATE_THREAD.find(
      (taeget) => taeget.ch == channelId
    );

    // 対象外のチャンネルには反応しない
    if (!taegetChannel) return;

    // ユーザー情報取得
    const member = await reaction.message.guild.members.fetch(user.id);

    // 〆：スレッドをクローズする
    if (reaction.emoji.name == CLOSE_EMOJI.name) {
      if (reaction.message.thread) {
        await reaction.message.thread.setArchived(true);
        // TODO:ロックの方が良い？案件が終わってから書き込みが発生する可能性？
        return;
      }
    }

    const reactionName = reaction.emoji.name;
    const joinReaction = REACTION_EMOJI.find(
      (emoji) => emoji.name == reactionName
    );
    if (joinReaction) {
      // 埋め込みメッセージ作成
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.globalName, iconURL: user.displayAvatarURL() })
        .setDescription(`参加表明 <:${joinReaction.name}:${joinReaction.id}> <@${user.id}>`)
        .setColor(0x008000);

      // スレッドにメッセージ送信
      if (reaction.message.thread) {
        const thread = reaction.message.thread;
        await thread.send({ content: `<@${user.id}>`, embeds: [embed] });
      }
    }
  } catch (e) {
    console.error("リアクション追加時のエラー:", e);
  }
};
