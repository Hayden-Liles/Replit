<template>
    <li class="explorerOption">
        <div class="d-flex folderinfo" @click.stop="$emit('toggle-folder', item)">
            <img v-if="item.isDirectory" :src="item.isOpen ? chevronDown : chevronRight" alt="" class="icon min" fill="white">
            <div v-else style="padding-left: 20px;"></div>
            <img class="icon min"
                :src="item.isDirectory ? getImageForFolder(item.name, item.isOpen) : getImageForFile(item.name)" alt="">
            <p class="mx-2 min">{{ item.name }}</p>
        </div>
        <ul v-if="item.isDirectory && item.isOpen">
            <FileFolder v-for="child in item.children" :key="child.name" :item="child"
                @toggle-folder="$emit('toggle-folder', $event)" />
        </ul>
    </li>
</template>

<script setup>
import fileTypes from '../data/filetypes.json'
import folderTypes from '../data/foldertypes.json'
import FileFolder from './FileFolder.vue'
import chevronRight from '../assets/imgs/chevron-right.svg'
import chevronDown from '../assets/imgs/chevron-down.svg'


function toImage(route) {
    return new URL(route, import.meta.url)
}

function getImageForFile(fileName) {
    const extension = fileName.slice(fileName.lastIndexOf('.'))
    const fileType = fileTypes.find(ft => ft.extension === extension)
    return fileType ? toImage(`../assets/icons/${fileType.fileName}`) : toImage('../assets/icons/document.svg')
}

function getImageForFolder(folderName, isOpen) {
    const folderType = folderTypes.find(ft => ft.folderName === folderName)
    if (!folderType) return isOpen ? toImage('../assets/icons/folder-custom-open.svg') : toImage('../assets/icons/folder-custom.svg')
    return isOpen ? toImage(`../assets/icons/${folderType.open}`) : toImage(`../assets/icons/${folderType.closed}`)
}

defineProps({
    item: Object
})

defineEmits(['toggle-folder'])
</script>

<style lang="scss" scoped>
.explorerOption {
    font-size: 13px;
}

.icon {
    height: 17px;
    width: 17px;
}

li {
    list-style: none;
}

ul {
    padding-left: 9px;
}

.folderinfo {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.min{
    width: min-content;
}
</style>