<template>
    <div class="editor h-100 w-100" ref="editorElement"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as monaco from 'monaco-editor'

const editorElement = ref(null)

onMounted(() => {
    if (editorElement.value) {
        monaco.editor.create(editorElement.value, {
            value: '// type your code...',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true
        })
    }
})

</script>


<style scoped></style>
