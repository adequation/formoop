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
        radius: 75,

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

      colors(sectionID, name, value) {
        /*if (sectionID === this.focusedSection) {
          if (name === 'full') return '#4286f4';
          return '#ffffff';
        }*/

        if (name === 'empty') return '#DDDDDD';

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

        const arc = d3
          .arc()
          .innerRadius(0)
          .outerRadius(this.radius / 2);

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
            (d, i) => {
              return `translate(${(i + 1) * this.radius + i * this.circlePadding} , ${this.h / 2})`;
            }
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
            return (this.radius * 1.3) / 10 + "px";
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
            d3.select(this).style("cursor", "pointer");
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill", "transparent");
            d3.select(this).style("cursor", "default");
          })
          .on("click", (d) => {
            this.$parent.$emit('section-list-choice', d)
          });

        border.append("title").text((d) => d.name);

        svg.selectAll('path')
          .transition()
          .duration(500)
          .attr("fill", (d, i) => {
            return this.colors(d.data.sectionID, d.data.name, this.updatedValue(d))
          })
          .attrTween("d", d => {
            let newPieData = this.updatedValue(d, pie);

            let arcTweenValue;

            //update the old value
            if (!this.oldPieData[d.data.sectionID]) this.oldPieData[d.data.sectionID] = {};
            if (!this.oldPieData[d.data.sectionID][d.data.name])
              this.oldPieData[d.data.sectionID][d.data.name] = newPieData;

            arcTweenValue = this.arcTween(newPieData, this.oldPieData[d.data.sectionID][d.data.name], arc);
            if (d.data.sectionID === this.focusedSection)
              arcTweenValue = this.arcTween(newPieData, this.oldPieData[d.data.sectionID][d.data.name], focusedArc);

            this.oldPieData[d.data.sectionID][d.data.name] = newPieData;

            return arcTweenValue;
          });


        svg.selectAll('circle')
          .transition()
          .duration(500)
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
          .transition()
          .duration(500)
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
            if (d.id === this.focusedSection) return d.name.length > 9 ? d.name.substring(0, 8) + "..." : d.name;
            return d.name.length > 5 ? d.name.substring(0, 4) + "..." : d.name
          })

      },

      //get around faulty value updating

      updatedValue(d, pie) {
        const newData = this.sections.find(s => s.id === d.data.sectionID);
        let newPieData;
        if (newData) {
          if (pie) {
            newPieData = pie(newData.values);
            return newPieData.find(v => v.data.name === d.data.name);
          }

          return newData.values.find(v => v.name === d.data.name).value;
        }

        return d;
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
