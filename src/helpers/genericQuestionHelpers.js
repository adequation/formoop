export function getGenericQuestionTitle(blocks) {
  return blocks.map(b => {
    if(b.type === 'variable') return `{{${b.content}}}`;
    return b.content;
  }).join(' ');
}
