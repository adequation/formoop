<template>
  <div class="generic-question-block">

    <div class="generic-question-block-grouped">
      <input title="" class="grouped-checkbox" type="checkbox" v-model="entry.grouped"> Question groupée ?
      <input v-if="entry.grouped"
             class="generic-question-block-group-question"
             type="text"
             placeholder="Question générale"
             v-model="entry.groupQuestion"/>
    </div>

    <div contenteditable
         class="generic-question-block-input"
         ref="genericTitleInput"
         @input="textUpdate($event)"
         @keypress.enter="setBlocks"
         @blur="setBlocks($event)">

    </div>

  </div>
</template>

<script>
  import * as uuid from "uuid";

  export default {
    name: "CreatorGenericQuestionBlock",
    data() {
      return {
        variableFinder: /((?:^|[^@]*))@([^@| ]+)(?!\w)/g,
        rawTextContent: '',
        defaultContent: 'Question avec @variable ?'
      }
    },
    props: {
      entry: {
        type: Object,
        required: true
      },
    },
    mounted() {
      const blocksAsText = this.entry.question.blocks.map(b =>
        `${b.type === 'variable' ? '@' : ''}${b.content}`
      ).join(' ');

      if (!this.entry.question.blocks) {
        this.textUpdate({target: {innerText: this.defaultContent}});
      } else {
        this.textUpdate({
          target: {
            innerText: blocksAsText
          }
        });
      }
      this.setBlocks();
    },
    methods: {
      textUpdate(event) {
        this.rawTextContent = event.target.innerText;
      },

      setBlocks(e) {
        if (e) e.preventDefault();
        const input = this.$refs.genericTitleInput;

        const blocks = this.splitIntoBlocks(this.rawTextContent.trim()).map(b => b.trim()).filter(b => !!b);

        input.innerHTML =
          blocks.map(b => this.isVariableBlock(b) ?
            `<span style="color: dodgerblue; font-weight: bold;">${b}</span>`
            : b
          ).join(' ');

        this.entry.question.blocks = [];

        blocks.forEach(b => {
          this.entry.question.blocks.push({
            id: uuid.v4(),
            type: this.isVariableBlock(b) ? 'variable' : 'text',
            content: this.isVariableBlock(b) ? b.substring(1)  : b,
          });
        });


      },

      isVariableBlock(block) {
        if (block.length > 2) return block[0] === '@' && block[1] !== '@';
        return block[0] === '@';
      },

      splitIntoBlocks(rawText) {
        const matches = [];
        let match;
        let lastMatch = null;
        while (match = this.variableFinder.exec(rawText)) {

          //what is between 2 variables
          matches.push(match[1]);

          //what is in a variable
          matches.push(`@${match[2]}`);
          lastMatch = match;
        }

        let lastCheckIndex = 0;

        if (lastMatch) {
          lastCheckIndex = lastMatch.index + lastMatch[1].length + lastMatch[2].length + 1;
        }

        if (rawText.length > lastCheckIndex) {
          matches.push(rawText.substring(lastCheckIndex));
        }

        return matches;
      },

    }
  }
</script>

<style scoped>

  .generic-question-block-input {
    border: 1px solid #00000033;
    border-radius: 5px;
    background: white;
    padding: 5px;

    cursor: text;
  }

  .generic-question-block {
    margin-bottom: 0.5em;
  }


  .grouped-checkbox{
    margin-bottom: 15px;
  }

</style>
