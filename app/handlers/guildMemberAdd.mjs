import { GUILD_ID } from "../consts.mjs";

export default async (member, doc) => {
  if (member.guild.id !== GUILD_ID) return;
  try {
    //シート情報
    await doc.loadInfo();
    const sheet = await doc.sheetsByTitle["ノルマ"];

    await sheet.addRow({
      ID: member.user.id,
      名前: member.user.globalName,
    });
  } catch (err) {
    console.error(err)
  }
};
