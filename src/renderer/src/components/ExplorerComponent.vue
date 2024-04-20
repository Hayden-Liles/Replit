<template>
    <div class="explorer">
        <ul>
            <li v-for="item in files" :key="item.name" @click="toggle(item)">
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
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ExplorerItem from './ExplorerItem.vue'; // This will be a recursive component

const files = ref([]);

onMounted(() => {
    window.electron.getFilesFromPath('C:/path/to/your/directory'); // Specify your path here
    window.electron.onFilesReceived((receivedFiles) => {
        files.value = receivedFiles.map(file => ({
            ...file,
            expanded: false,
            children: []
        }));
    });
});

const toggle = (item) => {
    if (item.isDirectory) {
        item.expanded = !item.expanded;
        if (item.expanded && item.children.length === 0) {
            window.electron.getFilesFromPath('C:/path/to/your/directory/' + item.name); // Adjust path as needed
            window.electron.onFilesReceived((receivedFiles) => {
                item.children = receivedFiles.map(file => ({
                    ...file,
                    expanded: false,
                    children: []
                }));
            });
        }
    }
};
</script>

<style scoped>
.explorer {
    background-color: #1e1e1e;
    color: #ccc;
    padding: 10px;
    height: 100%;
    overflow-y: auto;
}

.explorer ul {
    list-style: none;
    padding: 0;
}

.explorer li {
    padding: 5px 0;
    cursor: pointer;
}

.explorer li:hover {
    background-color: #333;
}
</style>