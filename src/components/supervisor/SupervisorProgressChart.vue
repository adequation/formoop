<template>
  <div id="chart" class="chart-container">

  </div>
</template>

<script>
  import * as d3 from 'd3';

  export default {
    name: "SupervisorProgressChart",
    data() {
      return {
        localPercentage: this.percentage || 0,
        updateGraph : () => {}
      }
    },
    props: {
      percentage: {
        type: Number,
        required: true
      }
    },
    watch: {
      percentage: function (newPercentage) {
        this.localPercentage = newPercentage || 0;

        this.updateGraph(this.localPercentage);

      }

    },
    mounted() {
      let percent = this.localPercentage;


      const pie = d3.pie()
        .value(function (d) {
          return d
        })
        .sort(null);

      const w = 300, h = 320;

      const outerRadius = (w / 2) - 10;
      const innerRadius = outerRadius - 8;


      const color = ['#42b983', 'rgb(44, 62, 80)', '#202b33'];

      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI);


      const arcLine = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0);

      const svg = d3.select("#chart")
        .append("svg")
        .attr('width', w)
        .attr('height', h)
        .attr('class', 'shadow')
        .append('g')
        .attr(
          'transform', 'translate(' + w / 2 + ',' + h / 2 + ')'
        );

      //background
      const path = svg.append('path')
        .attr('d', arc)
        .style('fill', color[1]);


      let pathForeground = svg.append('path')
        .datum({endAngle: 0})
        .attr('d', arcLine)
        .style('fill', color[0])
        .attr('id', 'answerArc');

      const middleTextCount = svg.append('text')
        .datum(0)
        .text(function (d) {
          return d + '%';
        })

        .attr('class', 'middleText')
        .attr('text-anchor', 'middle')
        .attr('dy', 25)
        .attr('dx', 0)
        .style('fill', '#42b983')
        .style('font-size', '80px');


      const arcTweenOld = function (transition, percent, oldValue) {
        transition.attrTween("d", function (d) {

          const newAngle = (percent / 100) * (2 * Math.PI);

          const interpolate = d3.interpolate(d.endAngle, newAngle);

          const interpolateCount = d3.interpolate(oldValue, percent);


          return function (t) {
            d.endAngle = interpolate(t);
            const pathForegroundCircle = arcLine(d);

            middleTextCount.text(Math.floor(interpolateCount(t)) + '%');

            return pathForegroundCircle;
          };
        });
      };

      let oldValue = 0;

      this.updateGraph = function () {
        percent = this.localPercentage;

        console.log(percent);

        pathForeground.transition()
          .duration(750)
          .call(arcTweenOld, percent, oldValue);

        oldValue = percent;
      };

      this.updateGraph();
    }
  }
</script>

<style scoped>

</style>
