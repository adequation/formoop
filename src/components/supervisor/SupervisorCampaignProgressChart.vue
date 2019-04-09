<template>
  <div ref="campaignProgress" class="campaign-progress">
    <svg :id="uniqueID" class="campaign-progress-chart">

    </svg>
  </div>
</template>

<script>
  import * as d3 from 'd3';
  import * as uuid from "uuid";

  export default {
    name: "SupervisorCampaignProgressChart",

    data() {
      return {
        uniqueID: `chart-${uuid.v4()}`,

        format: d3.format(".1f"),

        margin: {top: 10, right: 0, bottom: 10, left: 0},

        width: 0
      }
    },

    props: {
      data: {
        type: Array,
        required: true
      }
    },

    computed: {

      values() {
        return this.data;
      },

      height() {
        return this.values.length * 50 + this.margin.top + this.margin.bottom
      },

      /*width() {
        return 500;
      },*/

      x() {
        return d3.scaleLinear()
          .domain([0, 100])
          .range([this.margin.left, this.width - this.margin.right])
      },

      y() {
        return d3.scaleBand()
          .domain(this.values.map((d,i) => d.name))
          .range([this.margin.top, this.height - this.margin.bottom])
          .padding(0.1)
      },

      color() {
        return d3.scaleThreshold()
          .domain([35, 75, 100])
          .range(['tomato', 'orange', '#42b983'])
      }
    },

    methods: {
      xAxis(g) {
        g
          .attr("transform", `translate(0,${this.margin.top})`)
          .call(d3.axisTop(this.x).ticks(this.width / 80))
          .call(g => g.select(".domain").remove())
      },

      yAxis(g) {
        g
          .attr("transform", `translate(${this.margin.left},0)`)
          .call(d3.axisLeft(this.y).tickSizeOuter(0))
      },

      renderChart() {
        const svg = d3.select(`#${this.uniqueID}`)
          .attr('width', '100%')
          .attr('height', this.height)
          .attr('viewbox', `0 0 ${this.height} ${this.width/3}`);

        const bars = svg.selectAll('.bars').data([{}]);

        const barsEnter = bars.enter().append("g")
          .attr('class', 'bars');

        const rect = bars.merge(barsEnter)
          .selectAll("rect")
          .data(this.values);

        const rectEnter = rect.enter().append("rect").attr("x", this.x(0))
          .attr("y", d => this.y(d.name))
          .attr('rx', '5px')
          .attr('ry', '5px')
          .on("mouseover", function () {
            d3.select(this).attr("opacity", "0.7");
            d3.select(this).style("cursor", "pointer");
          })
          .on("mouseout", function () {
            d3.select(this).attr("opacity", "1");
            d3.select(this).style("cursor", "default");
          });

        rect.merge(rectEnter).transition().duration(500).attr("x", this.x(0))
          .attr("y", d => this.y(d.name))
          .attr("width", d => this.x(d.value) - this.x(0))
          .attr("height", this.y.bandwidth())
          .attr("fill", d => this.color(d.value));

        const barText = svg.selectAll('.bar-text').data([{}])

        const barTextEnter = barText.enter().append("g").attr("fill", "white")
          .attr("text-anchor", "end")
          .attr('class', 'bar-text')
          .style("font", "12px sans-serif");

        const text = barText.merge(barTextEnter)
          .selectAll("text")
          .data(this.values);

        const textEnter = text
          .enter().append("text");

        text.merge(textEnter)
          .transition().duration(500)
          .attr("x", d => this.x(d.value) - 4)
          .attr("y", d => this.y(d.name) + this.y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .text(d => this.format(d.value));

        /*const xAx = svg.selectAll('.x-axis').data([{}]);

        const xAxEnter = xAx.enter().append("g")
          .attr('class', 'x-axis')
          .call(this.xAxis);*/

        const yAx = svg.selectAll('.y-axis').data([{}]);

        /*const yAxEnter = yAx.enter().append("g")
          .attr('class', 'y-axis')
          .call(this.yAxis);*/
      },

      onResize(){
        this.width = this.$refs.campaignProgress.clientWidth;
        this.renderChart()
      }
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },

    mounted() {
      window.addEventListener('resize', this.onResize)
      this.onResize()
    },

    watch: {
      data: function () {
        this.renderChart();
      },
      width: function () {
        this.renderChart();
      }
    }
  }
</script>

<style scoped>
  .campaign-progress-chart {
    width: 100%;
  }

  .campaign-progress-chart {
    width: 100%;
  }
</style>
