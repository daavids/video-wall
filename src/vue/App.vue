<template>
    <div class="content-wrapper">
        <div class="content">
            <template v-if="!gridSelected">
                <about></about>
                <grid-select @selectGrid="onSelectGrid($event)"></grid-select>
            </template>

            <template v-else>
                <video-grid
                    :rows=gridRows
                    :cols=gridCols
                    :urls=videoUrls
                    @clearGrid="onClearGrid()"
                    @setUrl="onSetUrl($event)">
                </video-grid>
            </template>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script>

import About from './About.vue';
import Footer from './Footer.vue';
import GridSelect from './GridSelect.vue';
import VideoGrid from './VideoGrid.vue';

import { useStorage } from 'vue3-storage';

export default {
    components: {
        About,
        'footer-component': Footer,
        GridSelect,
        VideoGrid
    },
    data() {
        return {
            gridCols: 0,
            gridRows: 0,
            storage: null
        }
    },
    computed: {
        gridSelected() {
            return this.gridCols && this.gridRows;
        }
    },
    created() {
        this.checkSession();
    },
    methods: {
        checkSession() {
            this.storage = useStorage();
            this.gridCols = this.storage.getStorageSync('gridCols');
            this.gridRows = this.storage.getStorageSync('gridRows');

            let urls = this.storage.getStorageSync('videoUrls');
            if (urls === undefined) {
                urls = {
                    1: { 1: null, 2: null, 3: null, 4: null },
                    2: { 1: null, 2: null, 3: null, 4: null },
                    3: { 1: null, 2: null, 3: null, 4: null },
                    4: { 1: null, 2: null, 3: null, 4: null }
                };
            }
            this.videoUrls = urls;
        },
        onSelectGrid(size) {
            this.gridCols = size.cols;
            this.gridRows = size.rows;

            this.storage.setStorageSync('gridCols', this.gridCols);
            this.storage.setStorageSync('gridRows', this.gridRows);
        },
        onClearGrid() {
            this.onSelectGrid({
                cols: 0,
                rows: 0

            });

            this.storage.setStorageSync('urls', {
                1: { 1: null, 2: null, 3: null, 4: null },
                2: { 1: null, 2: null, 3: null, 4: null },
                3: { 1: null, 2: null, 3: null, 4: null },
                4: { 1: null, 2: null, 3: null, 4: null }
            });
        }
    }
}
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css");

html, body,  body > .content-wrapper {
    height: 100%;
}
body > .content-wrapper {
    min-height: 100%;
}

html {
    font-family: "Rubik", sans-serif
}

body {
    > .content-wrapper {
        display: flex;
        flex-direction: column;
        > .content {
            flex: 1 0 auto;
            padding: 5rem 0 2rem;
            text-align: center;
        }
        > .footer {
            flex-shrink: 0;
        }
    }
    a {
        text-decoration: none !important;
    }
    .btn {
        margin-top: .5rem;
        margin-bottom: .5rem;
        font-weight: bold;
    }
}

</style>