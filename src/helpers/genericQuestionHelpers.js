export function getGenericQuestionTitle(blocks) {
  return blocks.map(b => {
    if(b.type === 'variable') return `(${b.content})`;
    return b.content;
  }).join(' ');
}

export function isFormGeneric(entries) {

  return !!entries.find(e => e.generic);

}
