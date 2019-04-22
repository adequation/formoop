<template>
  <div class="user-section-list" ref="userSectionSvgRef">
    <svg id="user-section-svg">

    </svg>
  </div>
</template>

<script>
  import * as d3 from "d3";

  export default {
    name: "UserSectionList",
    data() {
      return {
        circlePadding: 20,
        h: 100,
        radius: 50,

        margin: {left: 20, right: 20, top: 10, bottom: 10},

        oldPieData: {}
      }
    },
    props: {
      sections: {
        type: Array,
        required: true
      },
      formEntries: {
        type: Array,
        required: true
      },
      userAnswers: {
        type: Object,
        required: true
      },
      focusedSection: {
        type: String,
        required: false
      }
    },
    methods: {

      arcTween(a, old, arc) {
        let i = d3.interpolate(old, a);
        this._current = i(0);
        return function (t) {
          return arc(i(t));
        }
      },

      colors(value, i) {

        if (i === 1) return '#DDDDDD';

        if (value >= 0.75) return '#42b983';

        if (value >= 0.3) return '#ff9f1d';

        return 'tomato';
      },

      isAnswered(formEntry) {
        return this.userAnswers ? !!this.userAnswers[formEntry.id] : false;
      },

      draw() {
        const svg =
          d3.select('#user-section-svg')
            .attr('width', "100%")
            .attr('height', this.h + 'px')
            .attr('viewBox',
              `0 0 ${this.circlePadding * 2 + (this.radius + this.circlePadding) * this.sections.length} ${this.h}`);

        const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(this.radius);

        const dataArcs = this.sections.map(d => ({
          ...d,
          pie: d3.pie().sort(null)([d.values[0].value, d.values[1].value])
        }));

        console.log(dataArcs);

        svg.selectAll(".line").data([{}]).join(e => e.append("line").attr("class", "line").attr("x1", this.radius + this.margin.left)
          .attr("y1", this.h / 2)
          .attr("x2", (this.sections.length - 1) * this.radius * 2 + this.radius + (this.circlePadding * this.sections.length - 1) + this.margin.left)
          .attr("y2", this.h / 2).attr("stroke", "black"))
          .transition().duration(500)
          .attr("x1", this.radius + this.margin.left)
          .attr("y1", this.h / 2)
          .attr("x2", (this.sections.length - 1) * this.radius * 2 + this.radius + (this.circlePadding * this.sections.length - 1) + this.margin.left)
          .attr("y2", this.h / 2).attr("stroke", "black");

        const g = svg.selectAll(".pies").data(dataArcs).join(
          enter => {
            enter = enter.append("g").style("cursor", "pointer")
              .attr("class", "pies")
              .attr("text-anchor", "middle")
              .style("font", "15px sans-serif")
              .attr("transform", (d, i) => `translate(${i * this.radius * 2 + this.radius + (this.circlePadding * i) + this.margin.left},${this.h / 2})`)

            enter.selectAll("path").data(d => d.pie).enter().append("path");

            enter.append("circle").attr("fill-opacity", 0).attr("fill", "black")
              .on("mouseover", function () {
                d3.select(this).attr("fill-opacity", 0.1);
              }).on("mouseout", function () {
              d3.select(this).attr("fill-opacity", 0);
            });

            enter.append("text");
            return enter
          }
          ,
          update => update.transition()
            .duration(500)
            .attr("transform", (d, i) => `translate(${i * this.radius * 2 + this.radius + (this.circlePadding * i)
            + this.margin.left},${this.h / 2})`),

          exit => exit.remove());

        g.select("circle").attr("r", this.radius).attr("stroke", "black");

        g.select("text")
          .selectAll("tspan")
          .data(d => this.fit(d.name, this.radius).lines)
          .join("tspan")
          .attr("x", 0)
          .attr("y", (d, i, data) => (i - data.length / 2 + 0.8) * 15)
          .text(d => d.text);


        g.selectAll("path")
          .data(d => d.pie)
          .join(
            enter => enter.append("path"),
            update => update,
            exit => exit.remove()
          ).transition().duration(500).attrTween("d", function (d) {

          let i = d3.interpolate(this._current, d);

          this._current = i(0);

          return function (t) {
            return arc(i(t));
          };
        })
          .attr("fill", (d, i) => {
            console.log(d);
            return this.colors(d.value, i)
          })
      },

      //measure the width of a text
      measureWidth(text) {
        const context = document.createElement("canvas").getContext("2d");
        return text => context.measureText(text).width;
      },

      //used to fit text inside a circle
      fit(text, value) {
        let line;
        let lineWidth0 = Infinity;
        const lineHeight = 12;
        const targetWidth = Math.sqrt(this.measureWidth(text.trim()) * lineHeight);
        const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
        if (!words[words.length - 1]) words.pop();
        if (!words[0]) words.shift();
        const lines = [];
        for (let i = 0, n = words.length; i < n; ++i) {
          let lineText1 = (line ? line.text + " " : "") + words[i];
          let lineWidth1 = this.measureWidth(lineText1);
          if ((lineWidth0 + lineWidth1) * 0.4 < targetWidth) {
            line.width = lineWidth0 = lineWidth1;
            line.text = lineText1;
          } else {
            lineWidth0 = this.measureWidth(words[i]);
            line = {width: lineWidth0, text: words[i]};
            lines.push(line);
          }
        }
        //  if (value !== undefined) lines.push({width: this.measureWidth(value), text: value});
        let radius = 0;
        for (let i = 0, n = lines.length; i < n; ++i) {
          const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
          const dx = lines[i].width / 2;
          radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
        }
        return {lines, radius};
      }
    },

    mounted() {
      this.draw();
    },

    watch: {
      focusedSection: function (id) {
        this.draw();
      },

      sections: {
        handler: function (val) {
          this.draw()
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
</style>
