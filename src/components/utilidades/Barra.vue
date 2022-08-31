<template>
  <div>
    <div
      class   ="full-width panel-blur-dark q-pa-sm shadow-3 com-barra"
      :class  ="$attrs.class"
      >
      <slot></slot>
    </div>
  </div>
</template>
<style>
.com-barra{
  border-radius: 6px;
}
</style>