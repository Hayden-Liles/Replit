<template>
    <div class="h-100VH">
        <splitpanes class="h-100VH">

            <pane size="20">
                <div class="container-fluid m-0 p-0 test">
                    <div class="row">
                        <div class="col-12">
                            <ExplorerComponent/>
                        </div>
                    </div>
                </div>
            </pane>
            <pane>
                <splitpanes horizontal>
                    <pane size="70">
                        <EditorComponent/>
                    </pane>

                    <pane size="30" class="p-2">
                        <TerminalComponent/>
                    </pane>

                </splitpanes>
            </pane>
        </splitpanes>
    </div>
</template>

<script setup>
import { Splitpanes, Pane } from 'splitpanes'
import TerminalComponent from '../components/TerminalComponent.vue';
import EditorComponent from '../components/EditorComponent.vue';
import ExplorerComponent from '../components/ExplorerComponent.vue';

</script>


<style scoped>

</style>
