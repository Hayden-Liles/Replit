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
                                    <div class="terminalc" ref="terminalElement"></div>
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
import { ref, onMounted, watchEffect } from 'vue'
import * as monaco from 'monaco-editor'
import { Splitpanes, Pane } from 'splitpanes'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'

const terminalElement = ref(null)

onMounted(() => {
    if (window.electron) {
        const terminal = new Terminal({
            cursorBlink: true,
            scrollback: 10000,
            tabStopWidth: 8
        });
        const fitAddon = new FitAddon()
        terminal.loadAddon(fitAddon)
        terminal.open(terminalElement.value);
        fitAddon.fit();

        terminal.onData(data => {
            console.log('sending', data)
            window.electron.sendTerminalData(data);
        });

        window.electron.onTerminalData((data) => {
            console.log('recieving', data)
            terminal.write(data);
        });

        window.addEventListener('resize', () => {
            fitAddon.fit();
        });
    }
});

</script>

//FIXME - Make the terminal look better
<style scoped>
.xterm .xterm-viewport {
    overflow-y: auto;
    height: 100%;
}

.terminalc {
    max-height: 100%;
    background-color: black;
    overflow: scroll;
}
</style>
