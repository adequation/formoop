export function getGenericQuestionTitle(blocks) {
  return blocks.map(b => {
    if(b.type === 'variable') return `@${b.content}`;
    return b.content;
  }).join(' ');
}

export function getPropArrayFromBlock(block){
  if(!block) return [];

  if(block.type === 'variable') return block.content.split('.');

  return [];
}

export function isFormGeneric(entries) {

  return !!entries.find(e => e.generic);

}
