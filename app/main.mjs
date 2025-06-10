import { config } from 'dotenv';
import {
    Client,
    GatewayIntentBits,
    Events
} from "discord.js";
config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, async () => {
    console.log(`${client.user.tag} がログインしました！`);
});

// メッセージ送信時の挙動
client.on(Events.MessageCreate, async (message) => {
    try {
        if (message.content === 'ping!') {
            await message.reply(
                "pong!"
            );
        }
    } catch (e) {

    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
