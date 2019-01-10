<template>
  <div class="generic-question-block">
    <input class="generic-question-block-property" type="text" placeholder="Champ concerné"
           v-model="entry.genericProperty"/>

    <div class="generic-question-block-question-title">

      <div v-for="block in entry.question.blocks"
           :class="getClassFromType(block.type)"
           @contextmenu="swapType(block, $event)">

        <input type="text" v-model="block.content" size="7"/>
        <button @click="deleteBlock(block)">✖</button>

      </div>

      <select>
        <option>+</option>
        <option @click="addVariable">variable</option>
        <option @click="addText">texte</option>
      </select>
    </div>
  </div>
</template>

<script>
  import * as uuid from "uuid";

  export default {
    name: "CreatorGenericQuestionBlock",
    data() {
      return {}
    },
    props: {
      entry: {
        type: Object,
        required: true
      },
    },
    methods: {
      addVariable() {
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
        const blocIndex = this.entry.question.blocks.findIndex(b => b.id === block.id);


        if (blocIndex >= 0) this.entry.question.blocks.splice(blocIndex, 1);
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
      }
    }
  }
</script>

<style scoped>

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
    margin: 0 0.1em 0 0.1em;
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

</style>
