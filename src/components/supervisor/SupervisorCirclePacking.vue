<template>
  <div id="circle-packing-svg" class="supervisor-circle-packing-chart">

  </div>
</template>

<script>
  import * as d3 from "d3";

  export default {
    name: "SupervisorCirclePacking",
    data() {
      return {
        w: this.width  || 500,
        h: this.height || 500,

        format: d3.format(",d"),
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
      width: {
        type: Number,
        required: false
      },
      height: {
        type: Number,
        required: false
      }
    },
    methods: {
      color(value) {
        return d3.scaleLinear()
          .domain([0, 5])
          .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
          .interpolate(d3.interpolateHcl)(value)
      },

      pack(data) {
        return d3.pack()
          .size([this.w, this.h])
          .padding(3)
          (d3.hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => b.value - a.value))
      }
    },
    computed: {
      chartData() {
        const entries = [];
        const answers = [];
        let users = [];

        let chartEntries = [];
        let chartAnswers = [];
        let chartUsers = [];

        //retreive entries
        Object.keys(this.formEntries).forEach(entryID => {
          const e = this.formEntries[entryID];
          entries.push(e);
          chartEntries.push({id: e.id, name:e.question.title, children:[]})
        });

        //retreive answers
        entries.forEach(entry => {
          switch (entry.answer.type) {
            case 'radio' :
            case 'select':
            case 'checkbox' :
              const entryAnswers = entry.answer.answers.map(a => ({entryID: entry.id, id: a.id, text: a.text}));

              entryAnswers.forEach(ea => {
                answers.push(ea);
                chartAnswers.push({id:ea.id, name:ea.text, children:[]});
              });
              break;

          }
        });

        //retreive users
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

        users.forEach(u => {
          chartUsers.push({id: u.id, name: u.name || u.id})
        });

        //pack users into answers
        chartUsers.forEach(cu => {
          const user = users.find(u=> u.id === cu.id);

          user.answers.forEach(ua => {
            const chartAnswer = chartAnswers.find(ca => ca.id === ua);
            if(chartAnswer) chartAnswer.children.push({name: cu.name, size: 1});
          });
        });


        //clean empty answers
        chartAnswers = chartAnswers.filter(ca => ca.children.length > 0);

        //pack answers into entries
        chartAnswers.forEach(ca => {
          const answer = answers.find(a => a.id === ca.id);
          if(answer){
            const chartEntry = chartEntries.find(e => e.id === answer.entryID);
            if(chartEntry) {
              chartEntry.children.push(ca);
            }
          }
        });

        //clean empty entries
        chartEntries = chartEntries.filter(ce => ce.children.length > 0);

        return {name: "Questions", children: chartEntries}
      }


    },
    mounted() {
      const root = this.pack(this.chartData);
      let focus = root;
      let view;

      const svg = d3.select('#circle-packing-svg')
        .append("svg")
        .attr('width', this.w)
        .attr('height', this.h)
        .attr("viewBox", `-${this.w / 2} -${this.h / 2} ${this.w} ${this.h}`)
        .style("background", this.color(0))
        .style("cursor", "pointer")
        .on("click", () => zoom(root, this.w));

      const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .enter().append("circle")
        .attr("fill", d => d.children ? this.color(d.depth) : "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function () {
          d3.select(this).attr("stroke", "#000");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", null);
        })
        .on("click", d => focus !== d && (zoom(d, this.w), d3.event.stopPropagation()));

      const label = svg.append("g")
        .style("font", "20px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .enter().append("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);

      zoomTo([root.x, root.y, root.r * 2], this.w);

      function zoomTo(v, w) {
        const k = w / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
      }

      function zoom(d, w) {
        const focus0 = focus;

        focus = d;

        const transition = svg.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t), w);
          });

        label
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
          });
      }
    }
  }
</script>

<style scoped>

</style>
