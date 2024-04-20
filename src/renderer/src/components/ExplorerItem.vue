<template>
    <li @click.stop="toggle(item)">
        <span v-if="item.isDirectory">
            <img v-if="item.expanded" src="/path/to/minus-icon.svg" alt="Collapse">
            <img v-else src="/path/to/plus-icon.svg" alt="Expand">
        </span>
        <span v-else>
            <img src="/path/to/file-icon.svg" alt="File">
        </span>
        {{ item.name }}
        <ul v-if="item.isDirectory && item.expanded">
            <explorer-item v-for="child in item.children" :key="child.name" :item="child" />
        </ul>
    </li>
</template>

<script setup>
import { defineProps } from 'vue';
import ExplorerItem from './ExplorerItem.vue';

const props = defineProps({
    item: Object
});

const toggle = (item) => {
    // Similar toggle function as in ExplorerComponent.vue
};
</script>