<template>
    <div class="csv-help-page">
      <h1>Comment importer un csv ?</h1>

      <h2>Le CSV</h2>

      <p>
        Dans le fichier, chaque ligne représente une entité.
        Lors de la génération des formulaires, tu dois rentrer qu'elle est la colonne qui permet d'identifier chaque entité.
      </p>
      <p>
        Par exemple, dans le cas d'un chenil, on aurait pour chaque ligne :
      </p>

      <ul>
        <li>une variable NOM pour le nom de l'etablissement</li>
        <li>une variable VILLE pour la ville de l'etablissement</li>
        <li>une variable CHIENS pour le nom des chiens de l'etablissement</li>
        <li>une variable RACE pour la race des chiens l'etablissement</li>
      </ul>

      <p>
        Une ligne aurait donc l'aspect suivant : NOM, VILLE, CHIEN, RACE.
        Étant donné que l'on a plusieurs chiens par etablissement,
        les valeurs NOM et VILLE <strong>DOIVENT être redondantes</strong>.
        par exemple, pour 3 chiens <i>Milou, Rex et Lassie</i> dans l'établissement <i>Établissement n°1</i> on aurait :
      </p>

      <table>
        <th>NOM</th>
        <th>VILLE</th>
        <th>CHIEN</th>
        <th>RACE</th>
        <tr><td><strong>Établissement n°1</strong></td><td><strong>Bruxelles</strong></td><td>Milou</td><td>Fox terrier</td></tr>
        <tr><td><strong>Établissement n°1</strong></td><td><strong>Bruxelles</strong></td><td>Rex</td><td>Berger Allemand</td></tr>
        <tr><td><strong>Établissement n°1</strong></td><td><strong>Bruxelles</strong></td><td>Lassie</td><td>Border Collie</td></tr>
      </table>

      <p>
        Dans le cas ou les valeurs ne sont pas redondantes, une erreur te le signalera.
      </p>

    </div>
</template>

<script>
    export default {
        name: "CsvHelpPage"
    }
</script>

<style scoped>
.csv-help-page{
  text-align: left;
}
</style>
