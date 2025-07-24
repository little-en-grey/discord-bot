let consts;
if (process.env.NODE_ENV === 'production') {
  consts = await import('./consts_prod.mjs');
} else {
  consts = await import('./consts_dev.mjs');
}

// 必要に応じてエクスポート
export const {
  // サーバーID
  GUILD_ID,

  // スレッド作成対象チャンネルID
  PRIVATE_CH_ID,
  OPEN_CH_ID,
  BATTLE_CH_ID,
  ROTATION_CH_ID,

  // 自己紹介
  PROFILE_CH_ID,

  // 出席簿
  DAILY_CH_ID,

  // スレッド作成対象メンション
  PRIVATE_MENTION_ID,
  OPEN_MENTION_ID,
  BATTLE_MENTION_ID,
  LATE_NIGHT_MENTION_ID,

  // リアクション用カスタム絵文字
  REACTION_EMOJI,

  // クローズ用絵文字
  CLOSE_EMOJI,

  // 自己紹介につけるやつ
  PROFILE_EMOJI,

  // 不参加用絵文字
  NON_PART,

  // チャンネルとメンションの組み合わせリスト
  TARGET_CREATE_THREAD,

  // ローテーションルール
  ROTATION_RULE,
} = consts;
