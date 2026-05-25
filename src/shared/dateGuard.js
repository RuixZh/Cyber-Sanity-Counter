/**
 * 本地日期守卫：跨天自动清零检测
 */

function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function needsDailyReset(lastResetDate, now = new Date()) {
  const today = getLocalDateString(now);
  if (!lastResetDate) return true;
  return lastResetDate !== today;
}

/**
 * 若日期已变，将计数归零并更新 lastResetDate
 * @param {{ count: number, lastResetDate: string }} state
 * @returns {{ count: number, lastResetDate: string, didReset: boolean }}
 */
function applyDailyResetIfNeeded(state, now = new Date()) {
  const today = getLocalDateString(now);
  if (!needsDailyReset(state.lastResetDate, now)) {
    return { ...state, didReset: false };
  }
  return {
    count: 0,
    lastResetDate: today,
    didReset: true,
  };
}

module.exports = {
  getLocalDateString,
  needsDailyReset,
  applyDailyResetIfNeeded,
};
