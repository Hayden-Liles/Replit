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
import { ref, onMounted } from 'vue'
import * as monaco from 'monaco-editor'
import { Splitpanes, Pane } from 'splitpanes'
import { Terminal } from 'xterm'

//NOTE - maybe seperate Monoco & Xterm into their own components

const editorElement = ref(null)
const terminalElement = ref(null)

function initializeXTerm() {
    const term = new Terminal()
    term.open(terminalElement.value)
    handleTerminalControls(term)
}

//FIXME - Handle numpad stuff & custom command like (clear, and stuff)
function handleTerminalControls(term) {
    let TerminalCursorPrompt = '> '
    let startingHomePosition = TerminalCursorPrompt.length + 1
    let cursorPosition = startingHomePosition
    
    let doNothingKeys = ['PageDown', 'PageUp', 'Tab',
    'ArrowUp', 'ArrowDown',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
    'F7', 'F8', 'F9', 'F10', 'F11', 'F12']
    
    let input = ''
    
    term.write(TerminalCursorPrompt)
    
    term.onKey(({ key, domEvent }) => {
        const keyCode = domEvent.code
        if (doNothingKeys.includes(keyCode)) {
            return
        } else if (keyCode == 'Enter') {
            term.write(`\r\n${TerminalCursorPrompt}`)
            handleUserTerminalInput(input)
            input = ''
            cursorPosition = startingHomePosition
        } else if (keyCode == 'Delete') {
            if (cursorPosition < input.length + startingHomePosition) {
                const beforeCursor = input.slice(0, cursorPosition - startingHomePosition)
                const afterCursor = input.slice(cursorPosition - startingHomePosition + 1)
                input = beforeCursor + afterCursor
                const remainingText = input.slice(cursorPosition - startingHomePosition)
                term.write(remainingText + ' ' + '\x1b[D'.repeat(remainingText.length + 1))
            }
        } else if (keyCode == 'Backspace') {
            if (cursorPosition > startingHomePosition) {
                input = input.slice(0, -1)
                term.write('\b \b')
                cursorPosition--
            }
        } else if (keyCode == 'Home') {
            term.write(`\x1b[${startingHomePosition}G`)
            cursorPosition = startingHomePosition
        } else if (keyCode == 'End') {
            term.write(`\x1b[${input.length + startingHomePosition - cursorPosition}C`)
            cursorPosition = input.length + startingHomePosition
        } else if (keyCode == 'ArrowLeft') {
            if (cursorPosition > startingHomePosition) {
                term.write('\x1b[D')
                cursorPosition--
            }
        } else if (keyCode == 'ArrowRight') {
            if (cursorPosition < input.length + startingHomePosition) {
                term.write('\x1b[C')
                cursorPosition++
            }
        } else {
            input += key
            term.write(key)
            cursorPosition++
        }
    })
}

function handleUserTerminalInput(userInput) {
    console.log(userInput)
}

onMounted(() => {
    if (editorElement.value) {
        monaco.editor.create(editorElement.value, {
            value: '// type your code...',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true
        })
    }

    if (terminalElement.value){
        initializeXTerm()
    }
})

</script>

//FIXME - Make the terminal look better
<style scoped>


</style>
