<template>
  <div id="force-graph-svg" class="supervisor-force-directed-graph">

  </div>
</template>

<script>
  import * as d3 from "d3";

  export default {
    name: "SupervisorForceDirectedGraph",
    data() {
      return {
        w: this.width  || 500,
        h: this.height || 500,

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
      },
      users:{
        type: Object,
        required: false
      },
      width: {
        type: Number,
        required: false
      },
      height: {
        type: Number,
        required: false
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
              const entryAnswers = entry.answer.answers.map(a => ({entryIDs: [entry.id], id: a.id, text: a.text}));

              entryAnswers.forEach(ea => {
                const a = answers.find(a => ea.id === a.id );
                if(!a) {
                  answers.push(ea);
                }else{
                  a.entryIDs.push(entry.id)
                }
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

        users = Object.keys(allUsers).map(userID => {
          const user = this.users[userID];
          let name = '';

          if(user)
          name = user.metadata.firstName + ' ' + user.metadata.lastName;


          return ({...allUsers[userID], name})
        });


        entries.forEach(e => {
          nodes.push({
            id: e.id,
            text: e.question.title,
            radius: this.entryNodeRadius,
            group: "entry"
          });

        });

        answers.forEach(a => {
          nodes.push({
            id: a.id,
            text: a.text,
            radius: this.answerNodeRadius,
            group: "answer"
          });

          a.entryIDs.forEach(eID => {
            links.push({
              source: a.id,
              target: eID
            });
          });

        });

        users.forEach(u => {
          nodes.push({
            id: u.id,
            text: u.name || '',
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
      const links = this.graphData.links;
      const nodes = this.graphData.nodes;

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      const svg = d3.select("#force-graph-svg")
        .append("svg")
        .attr('width', "100%")
        .attr('height', this.h)
        .attr("viewBox", [-this.w / 2, -this.h / 2, this.w, this.h]);

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
