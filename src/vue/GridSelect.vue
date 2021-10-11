<template>
    <div class="container">

        <div class="row mb-4">
            <div class="col">
                <h4>Select grid layout</h4>
            </div>
        </div>

        <div class="row">
            <div class="col-auto mx-auto">
                <div class="form-check form-switch">
                    <input type="checkbox" name="grid_view" role="switch"
                        id="gridViewSwitch" class="form-check-input" v-model="gridView">
                    <label for="gridViewSwitch" class="form-check-label">Display grids</label>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 my-3 mx-auto">
                <select name="grid_size" id="gridSizeSelect" class="form-select" aria-label="Select grid size"
                    @change="$emit('selectGrid', {
                        rows: parseInt($event.target.selectedOptions[0].getAttribute('data-rows')),
                        cols: parseInt($event.target.selectedOptions[0].getAttribute('data-cols'))
                    })">

                    <option selected>Select grid size</option>

                    <option :data-rows="opt.rows" :data-cols="opt.cols"
                        v-for="(opt, index) in options" :key="index">
                        {{ opt.rows }} x {{ opt.cols }}
                    </option>

                </select>
            </div>
        </div>

        <div class="row justify-content-center align-items-start grid-displays" v-if="gridView">

            <div class="col-auto grid-item" v-for="(opt, index) in options" :key="index">

                <a href="javascript:void(0);" class="grid-preview d-flex flex-column m-3"
                    @click="$emit('selectGrid', {
                        rows: opt.rows,
                        cols: opt.cols
                    })">

                    <span class="text-dark">{{ opt.rows }} x {{ opt.cols }}</span>

                    <div class="row" v-for="i in opt.rows" :key="i">
                        <div class="col grid-screen d-flex align-items-center justify-content-center border border-secondary p-0"
                            v-for="j in opt.cols" :key="j">
                            <i class="bi bi-camera-video text-dark"></i>
                        </div>
                    </div>
                </a>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            gridView: false
        }
    },
    computed: {
        options() {
            let options = [];
            for (let i = 1; i <= 4; i++) {
                for (let j = 1; j <= 4; j++) {
                    options.push({
                        cols: j,
                        rows: i
                    });
                }
            }
            return options;
        }
    }
}
</script>

<style lang="scss" scoped>
    .grid-preview {
        &:hover {
            transform: scale(1.1);
        }
        .grid-screen {
            height: 64px;
            width: 64px;
        }
        i {
            font-size: 24px;
        }
    }
</style>
