export function setCacheHeaders(res, value) {
  res.setHeader('Cache-Control', value);
}
