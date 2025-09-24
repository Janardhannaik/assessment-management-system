// utils/jsonPath.js
function get(obj, path) {
  if (!path) return null;
  const tokens = path.split(".");
  let cur = obj;
  for (let t of tokens) {
    if (cur === undefined || cur === null) return null;
    // array filter or index e.g. exercises[?(@.id==235)] or arr[0]
    const arrMatch = t.match(/^([^\[]+)\[(.+)\]$/);
    if (arrMatch) {
      const arrName = arrMatch[1];
      const inside = arrMatch[2];
      cur = cur[arrName];
      if (!Array.isArray(cur)) return null;

      // filter syntax ?(@.id==235)
      const filterMatch = inside.match(/^\?\(@\.([^\=]+)==(.+)\)$/);
      if (filterMatch) {
        const key = filterMatch[1];
        let rawVal = filterMatch[2];
        // remove quotes if present
        if (/^["'].*["']$/.test(rawVal)) rawVal = rawVal.slice(1, -1);
        // try number
        const num = Number(rawVal);
        const target = isNaN(num) ? rawVal : num;
        const found = cur.find((item) => {
          return item && item[key] !== undefined && item[key] == target;
        });
        cur = found || null;
      } else {
        // assume numeric index
        const idx = parseInt(inside, 10);
        cur = cur[idx] !== undefined ? cur[idx] : null;
      }
    } else {
      cur = cur[t];
    }
  }
  return cur === undefined ? null : cur;
}

module.exports = { get };
