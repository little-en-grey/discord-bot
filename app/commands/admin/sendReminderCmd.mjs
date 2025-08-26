import { SlashCommandBuilder, MessageFlags } from "discord.js";
import sendReminder from "../../utils/sendReminder.mjs";
import { ChatInputCommandInteraction, Client } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName("reminder")
  .setDescription("定例プラベリマインダー送信");

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
export async function execute(interaction, client) {
  await sendReminder(client);
  await interaction.reply({ content: "定例プラベリマインダーを送信しました", flags: MessageFlags.Ephemeral });
}
