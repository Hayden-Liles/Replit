<template>
    <div class="container-fluid h-100 me-0 pe-0">
        <div class="row h-100 pb-5 me-0 pe-0">
            <div class="col-12 my-2">
                <div class="d-flex">
                    <p class="border-bottom header-btn">Terminal</p>
                </div>
            </div>
            <div class="terminalc col-12 me-0 pe-0" ref="terminalElement"></div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, watchEffect, onUnmounted } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'


const terminalElement = ref(null)
const fitAddon = ref(null)
const terminal = ref(null)

watchEffect(() => {
    if (fitAddon.value && terminalElement.value) {
        fitAddon.value.fit();
    }
});

function initializeTerminal(){
    if (window.electron) {
        terminal.value = new Terminal({
            cursorBlink: true
        });
        fitAddon.value = new FitAddon();
        terminal.value.loadAddon(fitAddon.value);
        terminal.value.open(terminalElement.value);
        fitAddon.value.fit();
    }

    const resizeObserver = new ResizeObserver(() => {
        if (fitAddon.value) {
            fitAddon.value.fit();
        }
    });
    resizeObserver.observe(terminalElement.value);
}

function handleListeners(){
    terminal.value.onData(async data => {
        window.electron.sendTerminalData(data)
    });

    if (window.electron) {
        terminal.value.onResize(({ cols, rows }) => {
            window.electron.onTerminalResize(cols, rows)
        });

        window.electron.onTerminalData((data) => {
            terminal.value.write(data)
        })
    }
}

onMounted(() => {
    initializeTerminal()
    handleListeners()
});

onUnmounted(() => {
    resizeObserver.disconnect();
});

</script>


<style scoped>
.header-btn{
    color: #aaa !important;
    border-color: rgb(0, 140, 255) !important;
    font-size: 14px;
}

</style>