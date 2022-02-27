<template>
    <div class="container d-flex flex-column video-grid-wrapper">
        <div class="row">
            <div class="col-12">
                <h4>Current grid size: {{ rows }} x {{ cols }}</h4>
            </div>
        </div>
        <div class="row mt-5">

            <div class="col-12 grid-controls d-flex flex-row align-items-center justify-content-center px-4">

                <a href="javascript:void(0);" class="btn btn-dark" @click="onPlay"
                    v-if="paused" data-bs-toggle="modal" data-bs-target="#gridModal">
                    <i class="bi bi-play"></i>
                </a>
                <a href="javascript:void(0);" class="btn btn-dark" @click="onPause"
                    v-else data-bs-toggle="tooltip" title="Pause">
                    <i class="bi bi-pause"></i>
                </a>

                <a href="javascript:void(0);" class="btn btn-dark"
                    @click="onChangeControls('muted', false)" v-if="muted"
                    data-bs-toggle="tooltip" title="Unmute">
                    <i class="bi bi-volume-mute"></i>
                </a>
                <a href="javascript:void(0);" class="btn btn-dark"
                    @click="onChangeControls('muted', true)" v-else
                    data-bs-toggle="tooltip" title="Mute">
                    <i class="bi bi-volume-up"></i>
                </a>

                <a href="javascript:void(0);" class="btn btn-dark"
                    @click="onChangeControls('loop', false)" v-if="loop"
                    data-bs-toggle="tooltip" title="Don't loop">
                    <i class="bi bi-arrow-repeat"></i>
                </a>
                <a href="javascript:void(0);" class="btn btn-light border border-dark"
                    @click="onChangeControls('loop', true)" v-else
                    data-bs-toggle="tooltip" title="Loop">
                    <i class="bi bi-arrow-repeat"></i>
                </a>

                <a href="javascript:void(0);" class="btn btn-danger" @click="onClearGrid"
                    data-bs-toggle="tooltip" title="Clear">
                    <i class="bi bi-trash"></i>
                </a>

            </div>

        </div>
        <div class="row video-grid flex-grow-1">
            <div class="row flex-nowrap justify-content-center" v-for="i in rows" :key="i">
                <div class="col player-wrapper border" v-for="j in cols" :key="j">
                    <div class="d-flex flex-row align-items-center justify-content-center h-100 w-100">

                        <template v-if="urls.hasOwnProperty(i)
                            && urls[i].hasOwnProperty(j)
                            && urls[i][j] !== undefined
                            && urls[i][j] !== null">

                            <span>{{ urls[i][j] }}</span>
                            <a href="javascript:void(0);" class="btn btn-danger edit-url-button mx-2"
                                @click="onClearUrl(i, j)">
                                <i class="bi bi-pencil"></i>
                            </a>

                        </template>

                        <template v-else>

                            <form action="/" method="post" @submit.prevent="onSetUrl" class="w-100">

                                <input type="hidden" name="row" :value="i">
                                <input type="hidden" name="col" :value="j">

                                <div class="form-floating w-100">
                                    <input type="url" name="url" :id="'url_' + i + '_' + j + '+Input'"
                                        class="form-control" placeholder="Video URL" required>
                                    <label :for="'url_' + i + '_' + j + '+Input'">Video URL</label>
                                </div>

                                <button type="submit" class="btn btn-success w-100">
                                    <i class="bi bi-search"></i>
                                </button>
                            </form>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" id="gridModal" tabindex="-1">
            <div class="modal-dialog modal-fullscreen">
                <div class="container-fluid px-0 d-flex flex-column flex-nowrap mh-100">
                    <div class="row modal-row flex-nowrap" v-for="i in rows" :key="i">
                        <div class="col modal-col" v-for="j in cols" :key="j">

                            <template v-if="urls.hasOwnProperty(i)
                                && urls[i].hasOwnProperty(j)
                                && urls[i][j] !== undefined
                                && urls[i][j] !== null">


                                <video :muted=muted
                                    :loop=loop
                                    controls
                                    preload="auto">
                                    <source :src="urls[i][j]">
                                </video>

                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { useStorage } from 'vue3-storage';

export default {
    props: [
        "rows",
        "cols"
    ],
    data() {
        return {
            urls: {
                1: { 1: null, 2: null, 3: null, 4: null },
                2: { 1: null, 2: null, 3: null, 4: null },
                3: { 1: null, 2: null, 3: null, 4: null },
                4: { 1: null, 2: null, 3: null, 4: null }
            },
            storage: null,
            paused: true,
            muted: true,
            loop: true
        }
    },
    computed: {
        videoHeight() {
            return (this.rows > 1)
                ? window.screen.height / this.rows + 'px'
                : 'auto';

        },
        videoWidth() {
            return (this.cols > 1 )
                ? window.screen.width / this.cols + 'px'
                : 'auto';
        }
    },
    created() {
        this.checkSession();
    },
    mounted() {
        let vue = this;
        document.getElementById('gridModal').addEventListener('hidden.bs.modal', () => {
            vue.onPause();
        });
    },
    methods: {
         checkSession() {
            this.storage = useStorage();

            let urls = this.storage.getStorageSync('urls');
            if (urls === undefined) {
                urls = {
                    1: { 1: null, 2: null, 3: null, 4: null },
                    2: { 1: null, 2: null, 3: null, 4: null },
                    3: { 1: null, 2: null, 3: null, 4: null },
                    4: { 1: null, 2: null, 3: null, 4: null }
                };
            }
            this.urls = urls;
        },
        onClearGrid() {
            if (window.confirm('Are you sure you want to clear the grid?')) {
                this.$emit('clearGrid');
            }
        },
        onSetUrl(e) {
            let form = e.target;
            let url = form.querySelector('input[name="url"]').value;
            let row = parseInt(form.querySelector('input[name="row"]').value);
            let col = parseInt(form.querySelector('input[name="col"]').value);

            if (!this.urls.hasOwnProperty(row)) {
                this.urls[row] = {}
            }

            this.urls[row][col] = url;
            this.storage.setStorageSync('urls', this.urls);
        },
        onClearUrl(row, col) {
            this.urls[row][col] = null;
            this.storage.setStorageSync('urls', this.urls);
        },
        onPlay() {
            this.paused = false;
            let players = document.querySelectorAll('video');
            players.forEach((player) => {
                player.play();
            });
        },
        onPause() {
            this.paused = true;
            let players = document.querySelectorAll('video');
            players.forEach((player) => {
                player.pause();
            });
        },
        onChangeControls(control, status) {
            this[control] = status;
        },
        onFullscreen() {
            var myModalEl = document.getElementById('myModal');
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.show();
        }
    }
}
</script>

<style lang="scss" scoped>
    .video-grid-wrapper {
        min-height: 100%;
        max-height: 100%;
    }
    .grid-controls {
        a, button {
            font-size: 24px;
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }
    }
    .video-grid {
        max-height: 100%;
        max-width: 100%;
        .player-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &:hover {
                .edit-url-button {
                    visibility: visible;
                    opacity: 1;
                }
            }
            span {
                word-break: break-all;
            }
            form {
                max-width: 320px;
            }
            .edit-url-button {
                visibility: hidden;
                opacity: 0;
                transition: visibility 0.1s linear, opacity 0.1s linear;
            }
        }
    }
    .modal {
        .modal-row {
            height: v-bind(videoHeight);
            width: 100%;
        }
        .modal-col {
            height: v-bind(videoHeight);
            width: v-bind(videoWidth);
        }
        video {
            min-height: v-bind(videoHeight);
            max-height: v-bind(videoHeight);
            min-width: v-bind(videoWidth);
            max-width: v-bind(videoWidth);
        }
    }
</style>