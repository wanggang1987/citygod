export default {
    "props": {
        "value": {
            "type": Boolean,
            "default": false
        }
    },
    data () {
        return {
            "modal": false,
            "loading": false
        };
    },
    "watch": {
        value (newVal,oldVal) {
            const self = this;
            self.modal = newVal;
        },
        modal (newVal,oldVal) {
            const self = this;
            if (newVal) self.init();
            self.$emit("input", newVal);
        }
    },
    mounted () {
        const self = this;
        self.modal = self.value;
    },
    "methods": {
        init () {
            const self = this;
        },
        ok () {
            const self = this;
            self.$emit("on-ok");
            self.modal = false;
        },
        cancel () {
            const self = this;
            self.$emit("on-cancel");
            self.modal = false;
        },
        close () {
            const self = this;
            self.$emit("on-close");
            self.modal = false;
        }
    }
};