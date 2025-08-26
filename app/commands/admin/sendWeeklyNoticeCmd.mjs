import { SlashCommandBuilder, MessageFlags } from "discord.js";
import sendWeeklyNotice from "../../utils/sendWeeklyNotice.mjs";
import { ChatInputCommandInteraction, Client } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName("weekly")
  .setDescription("定例プラベ案内送信");

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
export async function execute(interaction, client) {
  await sendWeeklyNotice(client);
  await interaction.reply({ content: "定例プラベ案内を送信しました", flags: MessageFlags.Ephemeral });
}
