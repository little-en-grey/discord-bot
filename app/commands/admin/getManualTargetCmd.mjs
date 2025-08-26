import { SlashCommandBuilder, MessageFlags } from "discord.js";
import getTarget from "../../utils/getTarget.mjs";
import { ChatInputCommandInteraction, Client } from 'discord.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export const data = new SlashCommandBuilder()
  .setName("target")
  .setDescription("ノルマ取得");

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 * @param {GoogleSpreadsheet} doc 
 */
export async function execute(interaction, client, doc) {
  getTarget(client, doc);
  await interaction.reply({ content: "詳細はログをご確認ください", flags: MessageFlags.Ephemeral });
}
