<template>
  <div class="csv-help-page">
    <h1>Comment importer un csv ?</h1>


    <p>
      Dans le fichier, chaque ligne représente une entité.
      Lors de la génération des formulaires, tu dois rentrer quelle est la colonne qui permet d'identifier chaque
      entité.
    </p>
    <p>
      Par exemple, dans le cas d'un chenil, on aurait pour chaque ligne :
    </p>

    <ul>
      <li>une variable NOM_ETABLISSEMENT pour le nom de l'etablissement</li>
      <li>une variable VILLE pour la ville de l'etablissement</li>
      <li>une variable CHIENS pour le nom des chiens de l'etablissement</li>
      <li>une variable RACE pour la race des chiens l'etablissement</li>
    </ul>

    <p>
      Une ligne aurait donc l'aspect suivant : NOM_ETABLISSEMENT, VILLE, CHIEN, RACE.
      Étant donné que l'on a plusieurs chiens par etablissement,
      les valeurs NOM et VILLE <strong>doivent être redondantes</strong>.
      Par exemple, pour 3 chiens <i>Milou, Rex et Lassie</i> dans l'établissement <i>Établissement n°1</i> on aurait :
    </p>

    <table>
      <th>NOM_ETABLISSEMENT</th>
      <th>VILLE</th>
      <th>CHIEN</th>
      <th>RACE</th>
      <tr>
        <td><strong>Établissement n°1</strong></td>
        <td><strong>Bruxelles</strong></td>
        <td>Milou</td>
        <td>Fox terrier</td>
      </tr>
      <tr>
        <td><strong>Établissement n°1</strong></td>
        <td><strong>Bruxelles</strong></td>
        <td>Rex</td>
        <td>Berger Allemand</td>
      </tr>
      <tr>
        <td><strong>Établissement n°1</strong></td>
        <td><strong>Bruxelles</strong></td>
        <td>Lassie</td>
        <td>Border Collie</td>
      </tr>
    </table>

    <p>
      Dans le cas ou les valeurs ne sont pas redondantes, une erreur te le signalera.
    </p>

    <p>
      On remarque également que le CHIEN et sa RACE sont lié pusqu'ils sont sur la même ligne.
      Une question créée de la forme :
    </p>

    <div class="fake-question">
      <h3>Quel est l'âge de <span class="fake-variable">@CHIEN</span> le <span class="fake-variable">@RACE</span> ?</h3>
    </div>

    <p>
      Avec comme colonne servant d'identifiant la colonne NOM_ETABLISSEMENT, cela donnera un formulaire avec les 3 questions suivantes à la génération :
    </p>

    <div class="fake-question">
      <h3>Quel est l'âge de Milou le Fox terrier ?</h3>
    </div>
    <div class="fake-question">
      <h3>Quel est l'âge de Rex le Berger Allemand ?</h3>
    </div>
    <div class="fake-question">
      <h3>Quel est l'âge de Lassie le border Collie ?</h3>
    </div>


  </div>
</template>

<script>
  export default {
    name: "CsvHelpPage"
  }
</script>

<style scoped>
  .csv-help-page {
    text-align: left;
  }



  .fake-question{
    position: relative;
    background-color: #f6f6f6;
    margin: 0.5em auto;
    padding: 0.3em;
    width: 50%;

    border-left: 7px solid #aaaaaa;
    text-align: center;


  }
</style>
