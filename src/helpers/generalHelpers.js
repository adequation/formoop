export function clipText(text, size, dots=false) {
  if(text.length <= size) return text;

  if(!dots)
    return text.substring(0, size);

  return text.substring(0, Math.max(size-3, 0)).concat('...');
}
