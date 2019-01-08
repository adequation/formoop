<template>
  <div class="grouped-question">
    <Collapse :initialy-opened="true">

      <h3 slot="header" class="group-title">lkjhgfd</h3>

      <div slot="body" class="group-content">

        <form class="group-form">

          <label>
            Question concernant :
            <input title="" type="text" class="text-property" placeholder="Nom du champ concerné"/>
          </label>

          <CreatorGenericQuestionBlock/>

        </form>
      </div>

    </Collapse>
  </div>
</template>

<script>
  import Collapse from "@/components/containers/Collapse";
  import CreatorGenericQuestionBlock from "@/components/creator/CreatorGenericQuestionBlock";

  export default {
    name: "CreatorGroupedQuestion",
    components: {CreatorGenericQuestionBlock, Collapse}
  }
</script>

<style itemscope>

  .text-before-var {
    width: 30%;
  }

  .text-variable {

  }

  .text-after-var {

  }

</style>
