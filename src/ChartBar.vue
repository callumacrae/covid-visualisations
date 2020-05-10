<template>
  <g>
    <text :y="barHeight / 2" :x="barStart - 10" class="country">
      {{ country }}
    </text>
    <rect :x="barStart" :height="barHeight" :width="tweenedBarWidth" />
    <text
      :y="barHeight / 2"
      :x="barStart + tweenedBarWidth"
      :class="[
        'value',
        value < maxValue * 0.8 ? 'value--right' : 'value--left'
      ]"
    >
      {{ tweenedValue | formatNumber }}
    </text>
  </g>
</template>

<script>
import { gsap } from 'gsap';

export default {
  props: {
    animationDuration: { type: Number, required: true },
    country: { type: String, required: true },
    barHeight: { type: Number, required: true },
    chartWidth: { type: Number, required: true },
    maxValue: { type: Number, required: true },
    value: { type: Number, required: true }
  },
  data() {
    return {
      barStart: 150,
      tweenedMaxValue: this.maxValue,
      tweenedValue: this.value
    };
  },
  watch: {
    // @todo can these be combined?
    maxValue(newMax) {
      gsap.to(this.$data, {
        duration: this.animationDuration,
        ease: 'none',
        tweenedMaxValue: newMax
      });
    },
    value(newValue) {
      gsap.to(this.$data, {
        duration: this.animationDuration,
        ease: 'none',
        tweenedValue: newValue
      });
    }
  },
  computed: {
    tweenedBarWidth() {
      return (
        ((this.chartWidth - this.barStart) / this.tweenedMaxValue) *
        this.tweenedValue
      );
    }
  },
  filters: {
    formatNumber(value) {
      return Math.round(value).toLocaleString();
    }
  }
};
</script>

<style scoped>
rect {
  fill: hsl(10, 80%, 70%);
}

text {
  font: 16px sans-serif;
  alignment-baseline: middle;
}

.country {
  fill: black;
  text-anchor: end;
}

.value {
  transition: transform 0.3s linear;
  transition-duration: var(--animation-duration);
}
.value--left {
  fill: white;
  text-anchor: end;
  transform: translateX(-10px);
}
.value--right {
  text-anchor: start;
  transform: translateX(10px);
  fill: black;
}
</style>
