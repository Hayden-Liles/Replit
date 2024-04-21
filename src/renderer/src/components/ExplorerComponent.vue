<template>
    <div class="explorer">
        <ul>
            <li class="explorerOption" v-for="item in files" :key="item.name" @click="toggleFolder(item)">
                <img class="icon" :src="item.type === 'file' ? getImageForFile(item.name) : getImageForFolder(item.name, item.isOpen)" alt="">
                {{ item.name }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import fileTypes from '../data/filetypes.json'
import folderTypes from '../data/foldertypes.json'

const files = ref([])

function toImage(route){
    return new URL(route, import.meta.url)
}

function getImageForFile(fileName) {
    console.log('hell')
    const extension = fileName.slice(fileName.lastIndexOf('.'))
    const fileType = fileTypes.find(ft => ft.extension === extension)
    return fileType ? toImage(`../assets/icons/${fileType.fileName}`) : toImage('../assets/icons/base.svg')
}

function getImageForFolder(folderName, isOpen) {
    console.log('folderName:: ', folderName)
    const folderType = folderTypes.find(ft => ft.folderName === folderName)
    console.log(folderType)
    if (!folderType) return isOpen ? toImage('../assets/icons/folder-custom-open.svg') : toImage('../assets/icons/folder-custom.svg')
    return isOpen ? toImage(`../assets/icons/${folderType.open}`) : toImage(`../assets/icons/${folderType.closed}`)
}

function toggleFolder(item) {
    if (item.type === 'folder') {
        item.isOpen = !item.isOpen
    }
}

onMounted(() => {
    window.electron.getFilesFromPath('C:/Users/Hayden/OneDrive/Desktop/BCW Projects/asd/my-electron-vite-project')
    window.electron.onFilesReceived((receivedFiles) => {
        console.log("Received files:", receivedFiles)
        files.value = receivedFiles.map(file => ({
            ...file,
            type: file.isDirectory ? 'folder' : 'file',
            isOpen: false
        })).sort((a, b) => {
            if (a.type === 'folder' && b.type === 'file') {
                return -1
            } else if (a.type === 'file' && b.type === 'folder') {
                return 1
            }
            return a.name.localeCompare(b.name)
        })
    })
})
</script>

<style scoped>
.explorer {
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

.explorerOption{
    font-size: 12px;
}

.icon{
    height: 15px;
    width: 15px;
}
</style>
