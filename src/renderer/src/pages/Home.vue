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

                    <pane size="30" class="p-2 bg-dark">
                        <div class="terminalc col-12 flex-grow-1 h-100 w-100" ref="terminalElement"></div>
                    </pane>

                </splitpanes>
            </pane>
        </splitpanes>
    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, onUnmounted } from 'vue'
import * as monaco from 'monaco-editor'
import { Splitpanes, Pane } from 'splitpanes'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

const terminalElement = ref(null)
const fitAddon = ref(null)
const terminal = ref(null)

onMounted(() => {
    if (window.electron) {
        terminal.value = new Terminal({
            cursorBlink: true,
            scrollback: 1000
        });
        fitAddon.value = new FitAddon();
        terminal.value.loadAddon(fitAddon.value);
        terminal.value.open(terminalElement.value);
        fitAddon.value.fit();
        window.electron.requestInitialData()

        terminal.value.onData(data => {
                // console.log('sending', data)
                window.electron.sendTerminalData(data);
        });

        window.electron.onTerminalData((data) => {
            // console.log('receiving', data)
            terminal.value.write(data);
        });
    }

    const resizeObserver = new ResizeObserver(() => {
        if (fitAddon.value) {
            fitAddon.value.fit();
        }
    });
    resizeObserver.observe(terminalElement.value);

    onUnmounted(() => {
        resizeObserver.disconnect();
    });
});

watchEffect(() => {
    if (fitAddon.value && terminalElement.value) {
        fitAddon.value.fit();
    }
});

window.addEventListener('resize', () => {
    if (fitAddon.value) {
        fitAddon.value.fit();
    }
});

window.addEventListener('resize', () => {
    if (fitAddon.value) {
        fitAddon.value.fit();
    }
});
</script>


//FIXME - Make the terminal look better
<style scoped>
.xterm .xterm-viewport {
    overflow-y: hidden;
    height: 100% !important;
}

.terminal{
    height: 100% !important;
}

.terminalc {
    height: 100% !important;
    background-color: black !important;
    overflow-y: hidden !important;
    overflow-x: hidden;
}
</style>
