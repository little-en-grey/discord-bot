import { config } from 'dotenv';
config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Client,
  Collection,
  ActivityType,
  GatewayIntentBits,
  Events
} from "discord.js";
import CommandsRegister from "./regist-commands.mjs";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

import {
  TARGET_CREATE_THREAD,
} from "./consts.mjs";

// 現在のファイルの絶対パスを取得
const __filename = fileURLToPath(import.meta.url);
// 現在のファイルのディレクトリ
const __dirname = path.dirname(__filename);


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// スプレッドシート
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

//   ハンドラーの読み込み
const handlers = new Map();
const handlersPath = path.join(__dirname, "handlers");
const handlerFiles = fs
  .readdirSync(handlersPath)
  .filter((file) => file.endsWith(".mjs"));

for (const file of handlerFiles) {
  const filePath = path.join(handlersPath, file);
  import(filePath).then((module) => {
    handlers.set(file.slice(0, -4), module);
  });
}

// #region スラッシュコマンド登録
client.commands = new Collection();
const categoryFoldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(categoryFoldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(categoryFoldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".mjs"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    import(filePath).then((module) => {
      client.commands.set(module.data.name, module);
    });
  }
}

client.once(Events.ClientReady, async () => {
  TARGET_CREATE_THREAD.forEach(async (channel) => {
    await client.channels.cache.get(channel.ch).messages.fetch();
  });
  await client.user.setActivity({
    name: "スプラトゥーン3",
    type: ActivityType.Playing,
  });
  console.log(`${client.user.tag} がログインしました！`);

  // 定期実行
  await handlers.get("periodicExecution").default(client, doc);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`「${interaction.commandName}」コマンドは見つかりませんでした。`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'コマンド実行中にエラーが発生しました。', ephemeral: true });
    } else {
      await interaction.reply({ content: 'コマンド実行中にエラーが発生しました。', ephemeral: true });
    }
  }
});
// #endregion



// メッセージ送信時の挙動
client.on(Events.MessageCreate, async (message) => {
  if (message.author.id == client.user.id || message.author.bot) return;
  await handlers.get("messageCreate").default(message);
});

// リアクション追加時の挙動
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.id == client.user.id || user.bot) return;
  await handlers.get("messageReactionAdd").default(reaction, user);
});

// リアクション削除時の挙動
client.on("messageReactionRemove", async (reaction, user) => {
  if (user.id == client.user.id || user.bot) return;
  await handlers.get("messageReactionRemove").default(reaction, user);
});

// 新規メンバー参加時
client.on("guildMemberAdd", async (member) => {
  if (member.user.id == client.user.id || member.user.bot) return;
  await handlers.get("guildMemberAdd").default(member, doc);
});

CommandsRegister();
client.login(process.env.DISCORD_BOT_TOKEN);
