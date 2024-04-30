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

onMounted(() => {
    if (window.electron) {
        terminal.value = new Terminal({
            cursorBlink: true
        });
        fitAddon.value = new FitAddon();
        terminal.value.loadAddon(fitAddon.value);
        terminal.value.open(terminalElement.value);
        fitAddon.value.fit();
        // window.electron.requestInitialData()

        // terminal.value.onData(data => {
        //     // console.log('sending', data)
        //     window.electron.sendTerminalData(data);
        // });

        // window.electron.onTerminalData((data) => {
        //     console.log(`receiving (${data})`)
        //     terminal.value.write(data);
        // });
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


<style scoped>
.header-btn{
    color: #aaa !important;
    border-color: rgb(0, 140, 255) !important;
    font-size: 14px;
}

</style>