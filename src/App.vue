<template>
  <div id="app">
    <svg class="chart" :width="chartWidth" :height="chartHeight">
      <transition-group
        name="country-list"
        tag="g"
        :style="{ '--animation-duration': `${animationDuration}s` }"
      >
        <ChartBar
          v-for="{ country, value, position } in chartData"
          class="country"
          :transform="`translate(0, ${position * (barHeight + barSpacing)})`"
          :key="country"
          :animation-duration="animationDuration"
          :country="country"
          :bar-height="barHeight"
          :chart-width="chartWidth"
          :max-value="maxValue"
          :value="value"
        />
      </transition-group>
    </svg>

    <DayInput
      v-model="day"
      :dates="dates"
      :animation-duration="animationDuration"
    />
  </div>
</template>

<script>
import data from '../data/country-cases.json';
import ChartBar from './ChartBar';
import DayInput from './DayInput';

export default {
  data: () => ({
    animationDuration: 0.3,
    chartWidth: 600,
    chartHeight: 600,
    dates: data.dates,
    day: 0,
    items: 20, // Will only show this many countries
    barSpacing: 10,
    barStart: 150
  }),
  components: { ChartBar, DayInput },
  mounted() {
    this.$nextTick(() => {
      this.chartWidth = this.$el.getBoundingClientRect().width;
    });
  },
  computed: {
    chartData() {
      const chartData = Object.entries(data.countryData)
        .map(([country, dataArray]) => {
          return {
            country,
            value: dataArray[this.day]
          };
        })
        .filter(({ value }) => value);

      // This weird hack is because of https://github.com/vuejs/vue/issues/11310
      const sortedData = chartData.slice().sort((a, b) => b.value - a.value);

      // @todo remove anything off canvas
      return chartData.map(item => ({
        position: sortedData.indexOf(item),
        ...item
      }));
    },
    maxValue() {
      return this.chartData.reduce((max, { value }) => Math.max(value, max), 0);
    },
    barHeight() {
      return this.chartHeight / this.items - this.barSpacing;
    }
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.chart {
  width: 100%;
}

.country {
  transition: transform 0.3s linear, opacity 0.3s linear;
  transition-duration: var(--animation-duration), var(--animation-duration);
}
.country-list-enter,
.country-list-leave-to {
  opacity: 0;
}
</style>
