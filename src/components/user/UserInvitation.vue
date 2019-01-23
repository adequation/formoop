<template>
    <div class="invitationSender">
      <form>
        <span class="titleInvit">Mails des personnes a inviter</span>

        <div class="invitation" v-for="(i,k) in invitations" :key="k">
          <span>
            <input title="" type="text" :value="i.email" v-on:input="invitationTextOnChange($event.target, i.id)"/>
          </span>

          <span>
            <button id="deleteInvitationButton" type="button" @click="deleteInvitation(i.id)">Supprimer l'invitation </button>
          </span>
        </div>

        <button id="addInvitationButton" @click="addInvitation" type="button">Ajouter une invitation</button>

      </form>

      <button id="sendInvitations" @click="sendInvitations" type="button">Envoyer</button>
    </div>
</template>

<script>
    export default {
      name: "UserInvitation",
      data () {
        return {
          idInvit: 1,
          defaultInvitation: {id: 1, email: 'Email'},
          invitations: []
        }
      },
      created: function(){
        this.invitations.push(this.defaultInvitation)
      },
      computed:{
        user(){

          /////test debug, remove when a cleaner solution is found...
          if (!Firebase.apps.length) {
            Firebase.initializeApp(firebaseConfig);
          }////test debug, remove when a cleaner solution is found...

          return Firebase.auth().currentUser;
        }
      },
      props:{
        formID: {
          type: String,
          required: true
        }
      },
      methods: {
        addInvitation() {
          ++this.idInvit;
          const newInvit = {id: this.idInvit, email: this.defaultInvitation.email.concat(this.idInvit)};
          this.invitations.push(newInvit);
        },
        deleteInvitation(invitID){
          const invitToDelete = this.invitations.findIndex(e => e.id === invitID);
          if (invitToDelete >= 0){
            this.invitations.splice(invitToDelete, 1);
          }
        },
        invitationTextOnChange(target, invitID){
          const invitToEdit = this.invitations.findIndex(e => e.id === invitID);
          if (invitToEdit >= 0){
            this.invitations[invitToEdit].email = target;
          }
        },
        sendInvitations(){
          //Envoyer les mail
          //user.email
          /*var nodemailer = require('nodemailer');

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'facebookdredd@gmail.com',
              pass: '20Street',
            }
          });

          var mailOption = {
            from:'facebookdredd@gmail.com',
            to: this.invitations.map(i => i.email).join(', '),
            subjec: 'Invitation à un Sondage Collaboratif FORMOOP',
            text: 'Bonjour, vous avez été invité a participer a un sondage colaboratif'
          };

          transporter.sendMail(mailOption, function (error, info){
            if(error){
              console.log(error);
            }
            else{
              console.log('Mail sent' + info.response);
            }
          })*/
        }

      }
    }
</script>

<style scoped>

</style>
