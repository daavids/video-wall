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
                    v-else data-bs-dismiss="modal" data-bs-target="#gridModal" id="pauseBtn">
                    <i class="bi bi-x-circle"></i>
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
                                    <input type="text" name="url" :id="'url_' + i + '_' + j + '+Input'"
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
        <div class="modal fade" id="gridModal" data-bs-backdrop="false" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content px-0 d-flex flex-column flex-nowrap mh-100">
                    <div class="row modal-row flex-nowrap" v-for="i in rows" :key="i">
                        <div class="col modal-col" v-for="j in cols" :key="j">

                            <template v-if="urls.hasOwnProperty(i)
                                && urls[i].hasOwnProperty(j)
                                && urls[i][j] !== undefined
                                && urls[i][j] !== null">

                                <!-- YT embeds -->
                                <template v-if="urls[i][j].includes('/embed/')">
                                    <iframe
                                        class="embed-iframe"
                                        :title="'Video ' + i + ':' + j"
                                        :height="parseInt(videoHeight)"
                                        :width="parseInt(videoWidth)"
                                        :src="urls[i][j]">
                                    </iframe>
                                </template>

                                <!-- Direct video file urls -->
                                <template v-else-if="urls[i][j].includes('.mp4') || urls[i][j].includes('.webm')">
                                    <video :muted=muted
                                        :loop=loop
                                        controls
                                        preload="auto">
                                        <source :src="urls[i][j]">
                                    </video>
                                </template>

                                <!-- Other links -->
                                <template v-else>
                                    <iframe
                                        class="fetch-iframe"
                                        :title="'Video ' + i + ':' + j"
                                        :height="parseInt(videoHeight)"
                                        :width="parseInt(videoWidth)"
                                        src="about:blank"
                                        :data-src="urls[i][j]">
                                    </iframe>
                                </template>

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
                1: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                2: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                3: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                4: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                5: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                6: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null }
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
                : window.screen.height;

        },
        videoWidth() {
            return (this.cols > 1 )
                ? window.screen.width / this.cols + 'px'
                : window.screen.width;
        }
    },
    created() {
        this.checkSession();
    },
    mounted() {
        let vue = this;
        // pause when modal is exited via ESC key
        document.getElementById('gridModal').addEventListener('hidden.bs.modal', () => {
            vue.onPause();
        });
        // since modal is now clickable, add an exit button at the top
        document.addEventListener('mousemove', (e) => {
            if (vue.paused) {
                return;
            }
            // only show button when mouse is in the top 20% of the screen
            document.getElementById('pauseBtn').style.display = ((e.y / screen.height) <= 0.2)
                ? 'block'
                : 'none';
        });
    },
    methods: {
         checkSession() {
            this.storage = useStorage();

            let urls = this.storage.getStorageSync('urls');
            if (urls === undefined) {
                urls = {
                    1: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                    2: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                    3: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                    4: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                    5: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null },
                    6: { 1: null, 2: null, 3: null, 4: null, 5:null, 6:null }
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

            let iframes = document.querySelectorAll('iframe.embed-iframe');
            iframes.forEach((i) => {
                let url = new URL(i.src);
                let params = url.searchParams;
                params.set('autoplay', 1);
                params.set('mute', this.muted);
                i.src = url;
            });

            // for now just embed the URLs into iframes
            // controls will be manual, can't figure out a workaround to CORS
            let needsFetch = document.querySelectorAll('iframe.fetch-iframe');
            needsFetch.forEach((n) => {
                fetch(`https://api.allorigins.win/raw?url=${n.getAttribute('data-src')}`)
                    .then((response) => {
                        return response.body;
                    }).then((rb) => {
                        const reader = rb.getReader();

                        return new ReadableStream({
                            start(controller) {
                                // The following function handles each data chunk
                                function push() {
                                    // "done" is a Boolean and value a "Uint8Array"
                                    reader.read().then( ({done, value}) => {
                                    // If there is no more data to read
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    // Get the data and send it to the browser via the controller
                                    controller.enqueue(value);
                                    push();
                                    })
                                }

                                push();
                            }
                        });
                    }).then((stream) => {
                        // Respond with our stream
                        return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
                    }).then((result) => {
                        // Do things with result
                        n.srcdoc = result;
                    });
            });
        },
        onPause() {
            this.paused = true;

            let players = document.querySelectorAll('video');
            players.forEach((player) => {
                player.pause();
            });

            let iframes = document.querySelectorAll('iframe.embed-iframe');
            iframes.forEach((i) => {
                let url = new URL(i.src);
                let params = url.searchParams;
                if (params.get('autoplay') !== null) {
                    params.delete('autoplay');
                    i.src = url;
                }
            });

            let needsFetch = document.querySelectorAll('iframe.fetch-iframe');
            needsFetch.forEach((n) => {
                n.srcdoc = '';
            });
        },
        onChangeControls(control, status) {
            this[control] = status;
        }
    }
}
</script>

<style lang="scss" scoped>
    #pauseBtn {
        position: fixed;
        top: 12px;
        left: 50%;
        margin-left: -50px;
        margin-right: 0;
        z-index: 9999;
    }
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
        background: rgba(0, 0, 0, 0.5);
        .modal-row {
            height: v-bind(videoHeight);
            width: 100%;
        }
        .modal-col {
            height: v-bind(videoHeight);
            width: v-bind(videoWidth);
        }
        video, iframe {
            min-height: v-bind(videoHeight);
            max-height: v-bind(videoHeight);
            min-width: v-bind(videoWidth);
            max-width: v-bind(videoWidth);
        }
    }
</style>