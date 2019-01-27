<template>
  <div class="user-section-list" ref="userSectionSvgRef">
    <svg id="user-section-svg">

    </svg>
  </div>
</template>

<script>
  import * as d3 from "d3";
  import {getPercentage, getRawPercentage} from "@/helpers/userAnswersHelpers";
  import {getSections} from "@/helpers/sectionsHelpers";

  export default {
    name: "UserSectionList",
    data() {
      return {
        circlePadding: 20,
        h: 100,
        radius: 75
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

      colors(sectionID, name, value){
        if(sectionID === this.focusedSection){
          if(name === 'full') return '#4286f4';
          return '#ffffff';
        }

        if(name === 'empty') return '#DDDDDD';

        if(value > 0.75) return '#42b983';

        if(value > 0.5) return '#ffd242';

        if(value > 0.25) return 'tomato';
      },

      isAnswered(formEntry){
        return this.userAnswers ? !!this.userAnswers[formEntry.id] : false;
      },

      sections2(){

      },

      draw() {
        const svg =
          d3.select('#user-section-svg')
            .attr('width', "100%")
            .attr('height', this.h + 'px')
            .attr('viewBox',
              `0 0 ${this.circlePadding * 2 + (this.radius + this.circlePadding) * this.sections.length} ${this.h}`);

        const arc = d3
          .arc()
          .innerRadius(0)
          .outerRadius(this.radius / 2 - 1);

        const focusedArc = d3
          .arc()
          .innerRadius(0)
          .outerRadius(this.radius / 1.7);

        const pie = d3.pie()
          .padAngle(0)
          .sort(null)
          .value(d => d.value);

        const pies = svg
          .selectAll("g")
          .data(this.sections)
          .enter()
          .append("g")
          .attr(
            "transform",
            (d, i) => `translate(${(i + 1) * this.radius + i * this.circlePadding} , ${this.h / 2})`
          );

        const links = pies
          .filter((d, i) => i !== this.sections.length - 1)
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", this.radius + this.circlePadding)
          .attr("y2", 0);


        pies
          .selectAll("path")
          .data(d => pie(d.values.map(v => ({...v, sectionID: d.id}))))
          .enter()
          .append("path");


        const label = pies
          .append("text")
          .attr("dy", ".35em")
          .style("font-size", function (d) {
            return (this.radius * 1.35) / 10 + "px";
          })
          .attr("text-anchor", "middle")
          .style("font-family", '"Avenir", Helvetica, Arial, sans-serif');

        const border = pies
          .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("fill", "transparent")
          .on("mouseover", function () {
            d3.select(this).attr("fill", "rgba(255,255,255,0.5)");
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill", "transparent");
          })
          .on("click", (d) => {
            this.$parent.$emit('section-list-choice', d)
          });

        border.append("title").text((d) => d.name);

        svg.selectAll('path')
          .attr("fill", (d, i) => {
            return this.colors(d.data.sectionID, d.data.name, d.value)
          })
          .attr("d", (d, i) => {
            if (d.data.sectionID === this.focusedSection) return focusedArc(d);
            return arc(d);
          });

        svg.selectAll('circle')
          .attr("r", (d) => {
            if (d.id === this.focusedSection) return this.radius / 1.7;
            return this.radius / 2
          })
          .attr("stroke", (d) => {
            return 'black'
          })
          .attr('stroke-width', (d, i) => {
            if (d.id === this.focusedSection) return '3';
            return '1.5';
          });

        svg.selectAll('line')
          .attr("stroke", d => {
            return 'black'
          })
          .attr("stroke-width", d => {
            if (d.id === this.focusedSection ||
              this.sections[this.sections.findIndex(s => s.id === d.id) + 1].id === this.focusedSection) return this.radius / 5 + "px";
            return this.radius / 10 + "px"
          });

        svg.selectAll('text')
          .text((d, i) => {
            if(d.id === this.focusedSection) return d.name.length > 10 ? d.name.substring(0, 9) + "..." : d.name;
            return d.name.length > 5 ? d.name.substring(0, 4) + "..." : d.name
          })

      }
    },
    mounted() {
      this.draw();
    },

    watch: {
      focusedSection: function (id) {
        this.draw();
      },

      sections: function (val) {
        this.draw();
      },
    }
  }
</script>

<style scoped>

</style>
