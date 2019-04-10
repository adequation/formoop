<template>
  <div :class="['copy-link-wrapper', {pulse: justCopied}]">
    <input title=""
           class="copy-link-input"
           type="text"
           :value=" justCopied ? 'Lien copié !' : textToCopy"
           :size="textToCopy.length"
           readonly
           ref="formLinkInput"/>
    <div
      class="copy-link-button"
      @click="copyToClipBoard">
      <i class="material-icons md-16">file_copy</i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CopyToClipboardInput",
    data() {
      return {
        justCopied: false,
      }
    },
    props: {
      textToCopy: {
        type: String,
        required: true
      }
    },
    methods: {

      copyToClipBoard() {
        const copyText = this.$refs['formLinkInput'];

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("copy");

        this.copiedToClipBoard();
      },

      //animate the button
      copiedToClipBoard() {
        this.justCopied = true;
        setTimeout(() => {
          this.justCopied = false;
        }, 1000);
      },
    }
  }
</script>

<style scoped>
  @import '../../style/animations.css';

  .copy-link-wrapper {
    width: 90%;
    margin:0 auto;

    border-radius: 10px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    box-shadow: 0 0 0 0 #4286f488;

    outline: none;
  }

  .copy-link-input {
    height: 50px;

    width: 75%;

    border: none;
    background: #eeeeee;

    padding: 0 5px 0 5px;

    margin: 0;

    border-radius: 10px 0 0 10px;

    text-align: center;

    outline: none;
  }

  .copy-link-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;

    min-width: 50px;
    min-height: 50px;

    border-radius: 0 10px 10px 0;

    padding: 0;
    margin: 0;

    color: white;

    background: #4286f4;
    border: none;

    outline: none;

    cursor: pointer;
  }
</style>
