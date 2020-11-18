<template>
    <div class="logo">
        <img class="logoImg" :src="logoSrc" style="height: 40px;" />
    </div>
</template>

<script>
import logoSrc from "@/assets/images/logo.png";

export default {
    "name": "logo",
    data () {
        return {
            "logoSrc": logoSrc
        };
    }
};
</script>