// ------------------
//      研究室用
// ------------------

// サーバーID
export const GUILD_ID = "981489053134376960";

export const LOG_WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1342497168082075711/fQsoWqZ6SKlLtf0hycUEGe2wMxgO6JwUkbVGHpYhI48ywYF6WwNyrn7Lb-rRZ2BHTyGf";

// スレッド作成対象チャンネルID
export const PRIVATE_CH_ID = "1339812758719299654";     // プラベ
export const OPEN_CH_ID = "1339812684962463764";        // オープン
export const BATTLE_CH_ID = "1339812859164491777";      // 対抗戦
export const ROTATION_CH_ID = "1338731785114222624";    // 定例プラベ

export const PROFILE_CH_ID = "1386926479522271244";     // 自己紹介

// スレッド作成対象メンション
export const PRIVATE_MENTION_ID = "1337426629877829774";   // プラベ
export const OPEN_MENTION_ID = "1339816632142528562";      // オープン
export const BATTLE_MENTION_ID = "1339816697460424735";    // 対抗戦
export const LATE_NIGHT_MENTION_ID = "1355561690586026315";// 深夜

// リアクション用カスタム絵文字
export const REACTION_EMOJI = [
  { name: "join_1", id: "1339815279533883473" },
  { name: "join_2", id: "1339815281475850272" },
  { name: "join_3", id: "1339815277583405126" },
];
// クローズ用絵文字
export const CLOSE_EMOJI = { name: "shime", id: "1338747018595667968" };
// 自己紹介につけるやつ
export const PROFILE_EMOJI = { name: "hude", id: "1355562102521336040" };
// 不参加用絵文字
export const NON_PART = { name: "non_participation", id: "1388511196503867432" };


// チャンネルとメンションの組み合わせリスト
export const TARGET_CREATE_THREAD = [
  { ch: PRIVATE_CH_ID, mention: PRIVATE_MENTION_ID },
  { ch: OPEN_CH_ID, mention: OPEN_MENTION_ID },
  { ch: BATTLE_CH_ID, mention: BATTLE_MENTION_ID },
  { ch: ROTATION_CH_ID, mention: PRIVATE_MENTION_ID },
];

// ローテーションルール
export const ROTATION_RULE = [
  { main_rule: "エリア", sub_rule: "個人の希望ルルステ(エリア以外)" },
  { main_rule: "エリア", sub_rule: "個人の希望ルルステ(エリア以外)" },
  { main_rule: "エリア", sub_rule: "個人の希望ルルステ(エリア以外)" },
  { main_rule: "エリア", sub_rule: "個人の希望ルルステ(エリア以外)" },
  { main_rule: "エリア", sub_rule: "個人の希望ルルステ(エリア以外)" },
];
