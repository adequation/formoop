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
        colors: ["#00bf77", "#DDDDDD"],
        windowWidth: 0,

        h: 100,

        radius:75
      }
    },
    props: {
      sections: {
        type: Array,
        required: true
      },
      focusedSection: {
        type: String,
        required: false
      }
    },
    computed: {

    },
    methods: {


    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.windowWidth = window.innerWidth
        });
      });

      const svg =
        d3.select('#user-section-svg')
          .attr('width', "100%")
          .attr('height', this.h+'px')
          .attr('viewBox', `0 0 ${this.circlePadding * 2 + (this.radius+ this.circlePadding) * this.sections.length} ${this.h}`);
      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(this.radius / 2 - 1);

      const pie = d3.pie()
        .padAngle(0.005)
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
        .attr("y2", 0)
        .attr("stroke", "black")
        .attr("stroke-width", this.radius / 10 + "px");

      pies
        .selectAll("path")
        .data(d => pie(d.values))
        .enter()
        .append("path")
        .attr("fill", (d, i) => {
          console.log(d);
          return this.colors[i]
        })
        .attr("d", arc);

      const label = pies
        .append("text")
        .text((d, i) =>
          d.name.length > 5 ? d.name.substring(0, 4) + "..." : d.name
        )
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
        .attr("r", this.radius / 2)
        .attr("stroke", "black")
        .attr('stroke-width', '1.5')
        .attr("fill", "transparent")
        .on("mouseover", function () {
          d3.select(this).attr("fill", "rgba(255,255,255,0.5)");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "transparent");
        })
        .on("click", function (d) {
          console.log(d);
        });

      border.append("title").text((d) => d.name)

    }
  }
</script>

<style scoped>

</style>
