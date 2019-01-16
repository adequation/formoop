<template>
  <div id="chart" class="supervisor-force-directed-graph">

  </div>
</template>

<script>
  import * as d3 from "d3";

  export default {
    name: "SupervisorForceDirectedGraph",
    data() {
      return {
        entryNodeRadius: 10,
        userNodeRadius: 7,
        answerNodeRadius: 5
      }
    },
    props: {
      userAnswers: {
        type: Object,
        required: true
      },
      formEntries: {
        type: Array,
        required: true
      }
    },
    computed: {
      color() {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
      },

      graphData(){
        const nodes = [];
        const links = [];

        const entries = [];
        const answers = [];
        let users = [];

        Object.keys(this.formEntries).forEach(entryID => {
          entries.push(this.formEntries[entryID])
        });

        entries.forEach(entry => {
          switch (entry.answer.type) {
            case 'radio' :
            case 'select':
            case 'checkbox' :
              const entryAnswers = entry.answer.answers.map(a => ({entryID: entry.id, id: a.id, text: a.text}));

              entryAnswers.forEach(ea => {
                if(!answers.find(a => ea.id === a.id )) answers.push(ea);
              });

              break;
          }
        });

        const allUsers = {};

        Object.keys(this.userAnswers).forEach(entryID => {

          Object.keys(this.userAnswers[entryID]).forEach(userID => {
            if (!allUsers[userID]) allUsers[userID] = {id: userID, answers: []};

            const userAnswersIDs = this.userAnswers[entryID][userID];
            if (userAnswersIDs) {

              if (Array.isArray(userAnswersIDs)) {
                userAnswersIDs.forEach(uaID => allUsers[userID].answers.push(uaID));
              }
              else {
                allUsers[userID].answers.push(userAnswersIDs);
              }
            }
          });

        });

        users = Object.keys(allUsers).map(userID => allUsers[userID]);


        entries.forEach(e => {
          nodes.push({
            id: e.id,
            text: e.question.title,
            radius: this.entryNodeRadius,
            group: "entry"
          })
        });

        answers.forEach(a => {
          nodes.push({
            id: a.id,
            text: a.text,
            radius: this.answerNodeRadius,
            group: "answer"
          });

          links.push({
            source: a.id,
            target: a.entryID
          });
        });

        users.forEach(u => {
          nodes.push({
            id: u.id,
            text: '',
            radius: this.userNodeRadius,
            group: "User"
          });

          if (u.answers)
            u.answers.forEach(a => {

                if(!!answers.find(answer => answer.id === a))
                  links.push({
                    source: u.id,
                    target: a
                  });
              }
            );
        });

        return {nodes, links}
      }
    },
    methods: {
      drag(simulation) {

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }
    },
    mounted() {
      const links =  this.graphData.links.map(d => Object.create(d));
      const nodes =  this.graphData.nodes.map(d => Object.create(d));

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      const width = 300, height = 300;

      const svg = d3.select("#chart")
        .append("svg")
        .attr('width', width)
        .attr('height', height)
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => d.radius)
        .attr("fill", this.color)
        .call(this.drag(simulation));

      node.append("title")
        .text(d => d.text);

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });


      return svg.node();
    }
  }
</script>

<style scoped>

</style>
