// サーバーID
export const GUILD_ID = "1341629229254840382";

// スレッド作成対象チャンネルID
export const PRIVATE_CH_ID = "1344960889316577321";     // プラベ
export const OPEN_CH_ID = "1344960914838786090";        // オープン
export const BATTLE_CH_ID = "1352495429530423346";      // 対抗戦
export const ROTATION_CH_ID = "1344986714174918747";    // 定例プラベ

export const PROFILE_CH_ID = "1344953725864640562";     // 自己紹介

// スレッド作成対象メンション
export const PRIVATE_MENTION_ID = "1341629229262966834";   // プラベ
export const OPEN_MENTION_ID = "1341629229254840391";      // オープン
export const BATTLE_MENTION_ID = "1344956434697158747";    // 対抗戦
export const LATE_NIGHT_MENTION_ID = "1344956335619444817";// 深夜

// リアクション用カスタム絵文字
export const REACTION_EMOJI = [
  { name: "join_1", id: "1347242670837469275" },
  { name: "join_2", id: "1347242678873620560" },
  { name: "join_3", id: "1347242685446226070" },
];
// クローズ用絵文字
export const CLOSE_EMOJI = { name: "shime", id: "1344654704453484564" };
// 自己紹介につけるやつ
export const PROFILE_EMOJI = { name: "blob_smile_happy_eyes", id: "1347190479162183733" };
// 不参加用絵文字
export const NON_PART = { name: "non_participation", id: "1344654595992977489" };


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
