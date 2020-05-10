<template>
  <div>
    <input
      class="sr-only"
      type="range"
      min="0"
      :max="dates.length - 1"
      step="1"
      :value="value"
      @input="handleInput($event.target.value)"
    />

    <div class="input">
      <div class="input__slider">
        <VueSlider
          aria-hidden="true"
          tooltip="always"
          :min="0"
          :max="dates.length - 1"
          :value="value"
          :duration="animationDuration"
          :tooltipFormatter="val => dates[val]"
          @change="handleInput"
        />
      </div>
      <!-- @todo make accessible -->
      <button class="input__button" @click="toggleAutoPlay">►</button>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  props: ['value', 'dates', 'animationDuration'],
  components: { VueSlider },
  data: () => ({
    playStatus: 'paused'
  }),
  methods: {
    toggleAutoPlay() {
      if (this.playStatus === 'paused') {
        this.playStatus = 'playing';
        this.playInterval = setInterval(() => {
          if (this.value < this.dates.length - 1) {
            this.$emit('input', this.value + 1);
          } else {
            clearInterval(this.playInterval);
          }
        }, this.animationDuration * 1000);
      } else {
        this.playStatus = 'paused';
        clearInterval(this.playInterval);
      }
    },
    handleInput(value) {
      if (this.playStatus === 'playing') {
        this.toggleAutoPlay();
      }
      this.$emit('input', value);
    }
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  display: flex;
  align-items: center;
}
.input__slider {
  flex: 1;
  margin-right: 20px;
}

.input__button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #3498db;
  border: 2px #3498db solid;
  border-radius: 5px;
}
</style>
