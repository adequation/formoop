<template>
  <div class="generic-question-block">

    <div class="generic-question-block-grouped">
      <input title="" type="checkbox" v-model="entry.grouped"> Question groupée ?
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


    <!--
    <input class="generic-question-block-property" type="text" placeholder="Champ concerné"
           v-model="entry.genericProperty"/>

    <div class="generic-question-block-question-title">

      <div v-for="block in entry.question.blocks"
           :class="getClassFromType(block.type)"
           @contextmenu="swapType(block, $event)">

        <input title="" type="text" v-model="block.content" size="12"/>
        <button type="button" class="generic-question-delete-block" @click="deleteBlock(block)">
          <i class="material-icons md-18">close</i>
        </button>

      </div>

      <button type="button" @click="addVariable">variable</button>
      <button type="button" @click="addText">texte</button>
    </div>

    !-->
  </div>
</template>

<script>
  import * as uuid from "uuid";

  export default {
    name: "CreatorGenericQuestionBlock",
    data() {
      return {
        variableFinder: /(?<before>(?:^|[^@]*))@(?<variable>[^@| ]+)(?!\w)/g,
        rawTextContent: '',
        defaultContent: 'Question avec @variable.nichée ?'
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
          matches.push(match.groups.before);

          //what is in a variable
          matches.push(`@${match.groups.variable}`);
          lastMatch = match;
        }

        let lastCheckIndex = 0;

        if (lastMatch) {
          lastCheckIndex = lastMatch.index + lastMatch.groups.before.length + lastMatch.groups.variable.length + 1;
        }

        if (rawText.length > lastCheckIndex) {
          matches.push(rawText.substring(lastCheckIndex));
        }

        return matches;
      },

      /*addVariable() {
        const newVariable = {
          id: uuid.v4(),
          type: 'variable',
          content: "nom_variable"
        };

        this.entry.question.blocks.push(newVariable);
      },

      addText() {
        const newText = {
          id: uuid.v4(),
          type: 'text',
          content: "Texte standard"
        };

        this.entry.question.blocks.push(newText);
      },

      deleteBlock(block) {
        if (this.entry.question.blocks.length > 1) {
          const blocIndex = this.entry.question.blocks.findIndex(b => b.id === block.id);

          if (blocIndex >= 0) this.entry.question.blocks.splice(blocIndex, 1);
        }
      },

      swapType(block, e) {
        const blockIndex = this.entry.question.blocks.findIndex(b => b.id === block.id);

        if (blockIndex >= 0) {
          const foundBlock = this.entry.question.blocks[blockIndex];
          this.entry.question.blocks[blockIndex].type = foundBlock.type === 'text' ? 'variable' : 'text';
        }

        e.preventDefault();
      },

      getClassFromType(type) {
        if (type === 'variable') return 'block variable-block-input';
        return 'block text-block-input';
      }*/
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

  .generic-question-block-question-title {
    margin-top: 0.5em;
  }

  .block {
    width: auto;
    display: inline-block;
    padding: 0.2em 0.5em 0.2em 0.5em;
    margin: 0.1em;
    font-size: large;
    border-radius: 20px 20px 20px 20px;
  }

  .block input[type=text] {
    background: none;
    border: none;
    width: auto;
  }

  .block button {
    border: none;
    background: none;
    font-size: large;
    color: rgba(0, 0, 0, 0.3);
  }

  .block button:hover {
    color: rgba(0, 0, 0, 0.7);
  }

  .text-block-input {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .text-block-input:focus {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .variable-block-input {
    background-color: rgba(100, 175, 255, 0.5);
  }

  .variable-block-input:focus {
    background-color: rgba(100, 175, 255, 1);
  }

  .generic-question-block-grouped {

  }

  .variable-block-title {
    color: steelBlue;
    font-weight: bold;
  }

</style>
