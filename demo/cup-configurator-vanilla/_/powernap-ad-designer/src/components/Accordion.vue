<template>
  <div class="accordion">
    <h3 class="accordion-title" @click="handleClick">
      {{title}}
      <i :class="['fas fa-chevron-circle-down', { 'flipped' : open }]"></i>
    </h3>
    <transition name="slide-fade">
      <div class="accordion-content" v-show="open">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  props: ['title'],
  data () {
    return {
      open: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('accordion-clicked', this.title)
      this.open = !this.open
    }
  }
}
</script>

<style>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all .3s ease-out;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
  .accordion {
    margin-bottom: 10px;
  }
  .accordion-title {
    background: #006245;
    color: white;
    margin: 0;
    padding: 10px;
  }
  .accordion-title i {
    float: right;
  }
  .accordion-title i.flipped {
    transform: rotate(180deg);
  }
  .accordion-title:hover {
    cursor: pointer;
  }
  .accordion-content {
    border: 1px solid #006245;
    padding: 12px;
  }
  .accordion-content.open {
    display: block;
  }
</style>
