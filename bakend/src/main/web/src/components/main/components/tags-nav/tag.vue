<template>
    <transition name="fade">
        <div class="tag">
            <span class="tag-text"><slot></slot></span>
            <Icon class="tag-close" v-if="closable" type="ios-close" @click.native.stop="close"></Icon>
        </div>
    </transition>
</template>

<script>
export default {
    "name": "Tag",
    "props": {
        "closable": {
            "type": Boolean,
            "default": false
        }
    },
    "methods": {
        close (event) {
            if (this.name === undefined) {
                this.$emit("on-close", event);
            } else {
                this.$emit("on-close", event, this.name);
            }
        }
    }
};
</script>