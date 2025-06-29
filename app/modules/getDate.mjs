// 現在の日付を取得(yyyy_mm_ddの形式でレスポンス)
export function getNowDate() {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  };
  const formatter = new Intl.DateTimeFormat("ja-JP", options);
  const now = formatter.format(new Date());

  return now.replace(/\//g, "_");
}

// 日:0、月:1、火:2、水:3、木:4、金:5、土:6
const TARGET_DAY = 3;

// 対象の曜日を取得
export function getThisWeekDay() {
  const today = new Date();
  today.setHours(today.getHours() + 9); // 日本時間に
  const dayOfWeek = today.getDay(); // 0:日, 1:月, ..., 5:金, 6:土
  const daysUntilFriday = (TARGET_DAY - dayOfWeek + 7) % 7; // 対象の曜日までの差分
  const friday = new Date(today); // 現在の日付をコピー
  friday.setDate(today.getDate() + daysUntilFriday); // 今週の対象の曜日の日付を取得

  return {
    year: friday.getFullYear(),
    month: friday.getMonth() + 1, // JavaScriptの月は0-indexedなので+1
    day: friday.getDate(),
  };
}

// 対象の曜日がその月の何回目にあたるかを取得
export function getFridayCountInMonth(friday) {
  const { year, month, day } = friday;

  // その月の最初の曜日を探す
  const firstDayOfMonth = new Date(year, month - 1, 1); // 月の初日
  let firstFriday = new Date(year, month - 1, 1);

  while (firstFriday.getDay() !== TARGET_DAY) {
    firstFriday.setDate(firstFriday.getDate() + 1);
  }

  // 何回目の対象の曜日かを計算
  let count = 1;
  let currentFriday = new Date(firstFriday);

  while (currentFriday.getDate() < day) {
    currentFriday.setDate(currentFriday.getDate() + 7);
    count++;
  }

  return count;
}

// 日本時間で昨日の日付（YYYY-MM-DD）を取得
export function getYesterdayJST() {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 9); // UTC+9 に変換
  now.setDate(now.getDate() - 1); // 1日前にする
  return now.toISOString().split("T")[0]; // YYYY-MM-DD 形式で返す
}
