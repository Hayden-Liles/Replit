<template>
    <div class="explorer px-3 py-2">
        <ul>
            <FileFolder v-for="item in files" :key="item.name" :item="item" @toggle-folder="toggleFolder" />
        </ul>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import FileFolder from './FileFolder.vue';

const files = ref([])
const defaultPath = 'C:/Users/Hayden/OneDrive/Desktop/BCW Projects/asd/my-electron-vite-project'


function toggleFolder(item) {
    console.log('hell')
    item.isOpen = !item.isOpen;
    console.log(item)
}

onMounted(() => {
    window.electron.getFilesFromPath(defaultPath);
    window.electron.onFilesReceived((receivedFiles) => {
        console.log(receivedFiles)
        if (!files.value.length) {
            files.value = receivedFiles.map(file => ({
                ...file,
                type: file.isDirectory ? 'folder' : 'file',
                isOpen: false
            })).sort((a, b) => {
                if (a.type === 'folder' && b.type === 'file') {
                    return -1;
                } else if (a.type === 'file' && b.type === 'folder') {
                    return 1;
                }
                return a.name.localeCompare(b.name);
            });
        }
    });
});

</script>

<style scoped>
.explorer {
    color: #ccc;
    height: 100%;
    overflow-y: auto;
}

ul {
    padding-left: 0;
}
</style>
