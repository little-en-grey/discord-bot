import { SlashCommandBuilder, MessageFlags } from "discord.js";
import setDaily from "../../utils/sendDailyMessage.mjs";
import { ChatInputCommandInteraction, Client } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("その他ノルマメッセージ送信");

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
export async function execute(interaction, client) {
  setDaily(client);
  await interaction.reply({ content: "その他ノルマのメッセージを送信しました", flags: MessageFlags.Ephemeral });
}
