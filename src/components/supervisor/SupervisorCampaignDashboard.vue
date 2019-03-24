<template>
  <div>


    <div>
      <table>
        <th></th>
        <th></th>
        <th></th>
        <tr v-for="v in values" :key="v.name">
          <td>{{v.name}}</td>
          <td><SupervisorCampaignProgressChart :data="[v]"/></td>
          <td>{{v.value}}</td>
        </tr>
      </table>
    </div>

    <SupervisorProgressChart :percentage="values.reduce( ( sum, { value } ) => sum + value , 0)/ values.length"></SupervisorProgressChart>

    <button @click="randValues">rand</button>

  </div>
</template>

<script>
  import SupervisorCampaignProgressChart from "@/components/supervisor/SupervisorCampaignProgressChart";
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart";

  export default {
    name: "SupervisorCampaignDashboard",
    components: {SupervisorProgressChart, SupervisorCampaignProgressChart},

    data() {
      return {

        values: [
          {"name": "E", "value": Math.random() * 100},
          {"name": "T", "value": Math.random() * 100},
          {"name": "A", "value": Math.random() * 100},
          {"name": "O", "value": Math.random() * 100},
          {"name": "I", "value": Math.random() * 100}
        ],

      }
    },

    methods: {
      randValues() {
        this.values = [
          {"name": "E", "value": Math.random() * 100},
          {"name": "T", "value": Math.random() * 100},
          {"name": "A", "value": Math.random() * 100},
          {"name": "O", "value": Math.random() * 100},
          {"name": "I", "value": Math.random() * 100}
        ]
      },
    }
  }
</script>

<style scoped>

</style>
