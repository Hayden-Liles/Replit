<template>
    <div class="h-100VH">
        <splitpanes class="h-100VH">

            <pane size="20">
                <div class="container-fluid m-0 p-0 test">
                    <div class="row">
                        <div class="col-12">
                            <div class="explorer">Explorer</div>
                        </div>
                    </div>
                </div>
            </pane>
            <pane>

                <splitpanes horizontal>
                    <pane size="70">
                        <div class="editor h-100 w-100" ref="editorElement"></div>
                    </pane>

                    <pane size="30">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-12">
                                    <div ref="terminalElement"></div>
                                </div>
                            </div>
                        </div>
                    </pane>

                </splitpanes>
            </pane>
        </splitpanes>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor';
import { Splitpanes, Pane } from 'splitpanes';
import { Terminal } from 'xterm';
const editorElement = ref(null);
const terminalElement = ref(null)

onMounted(() => {
    if (editorElement.value) {
        monaco.editor.create(editorElement.value, {
            value: '// type your code...',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true
        });
    }

    if (terminalElement.value){
        const term = new Terminal();
        term.open(terminalElement.value)
        term.write('hello from xterm')
    }
});
</script>

<style scoped>


</style>
