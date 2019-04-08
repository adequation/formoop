<template>
  <div>
    <Modal v-if="showModal"  @close="closeModal">
      <div slot="header">
        <h2>Selectionner les formulaires à télécharger</h2>
      </div>
      <div slot="body">
        <div class="select-form-wrapper">
          <table class="select-all-option ">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" v-model="selectAll" @click="select">
                    <i class="select-form-icon"></i>
                  </label>
                </th>
                <th>Nom du formulaire</th>
                <th>Progression</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="form in openFormsToSelect" :key="'SO-' + form.id">
                <td>
                  <label class="select-form-checkbox">
                    <input type="checkbox" :value="form" v-model="selectedForms">
                    <i class="select-form-icon"></i>
                  </label>
                </td>
                <td>{{ form.title }}</td>
                <td>
                  <SupervisorCampaignProgressChart :data="[getFormProgress(form)]"/>
                </td>
                <td><i class="material-icons">lock_open</i></td>
              </tr>
              <tr v-for="form in closedFormsToSelect" :key="'SC-' + form.id">
                <td>
                  <label class="select-form-checkbox">
                    <input type="checkbox" :value="form" v-model="selectedClosedForms">
                    <i class="select-form-icon"></i>
                  </label>
                </td>
                <td>{{ form.title }}</td>
                <td>
                  <SupervisorCampaignProgressChart :data="[getFormProgress(form)]"/>
                </td>
                <td><i class="material-icons">lock</i></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div slot="footer">
        <DownloadCampaign class="download-button" title="Récupérer les résultats" :campaign="campaign" :campaign-forms="selectedForms" :campaign-closed-forms="selectedClosedForms"/>
      </div>
    </Modal>
  </div>
</template>

<script>
    import Modal from "../containers/Modal";
    import SupervisorCampaignProgressChart from "@/components/supervisor/SupervisorCampaignProgressChart";
    import DownloadCampaign from "../general/DownloadCampaign";
    import {getPercentage} from "../../helpers/userAnswersHelpers";

    export default {
      name: "DownloadCampaignModal",
      components: {DownloadCampaign, Modal, SupervisorCampaignProgressChart},
      data() {
        return {
          selectedForms: [],
          selectedClosedForms: [],
          selectAll: false,
        }
      },
      props:{
          showModal:{
            type: Boolean,
            required: true,
          },
          openFormsToSelect:{
            type: Array,
            required: true,
          },
          closedFormsToSelect:{
              type: Array,
              required: true,
          },
          campaign: {
            type: Object,
            required: true,
          }
      },
      methods: {
        closeModal() {
          this.$emit('close');
        },
        select() {
          this.selectedForms = [];
          this.selectedClosedForms = [];
          if (!this.selectAll) {
            for(let i in this.openFormsToSelect) {
              this.selectedForms.push(this.openFormsToSelect[i]);
            }
            for(let i in this.closedFormsToSelect) {
              this.selectedClosedForms.push(this.closedFormsToSelect[i]);
            }
          }
        },
        getFormProgress(form){
          return {
            name: form.title,
            id: form.id,
            value: getPercentage('answered',
              Object.keys(form.entries).map(formEntryKey => form.entries[formEntryKey]),
              form.usersAnswers)
          }
        },
      }
    }
</script>

<style scoped>
  .select-form-wrapper{
    overflow-y: scroll;

    max-height: 450px;

    margin-left: 0;
  }

  .download-button {
    background: #2d8246;
    width: 40px;
    margin-right: 0.5em;
    padding: 0.5em;
    margin-left: 46%;
  }


  .select-all-option {
    width: 100%;
    border-collapse: collapse;
  }

  .select-all-option td {
    border-bottom: 1px solid #e8e8e8;
  }

</style>
