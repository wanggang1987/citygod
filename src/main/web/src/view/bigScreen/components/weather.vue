<template>
<div class="weather">
    <span class="mr24">{{ type }}</span>
    <span class="mr24">{{ temperature }}度</span>
    <span class="mr24">{{ fdirection }} {{ flevel }}</span>
</div>
</template>

<script>
import * as yd from "@/libs/yd";

export default {
    "name": "Weather",
    "props": {
        "token": {
            "type": String
        }
    },
    data () {
        return {
            "temperature": "",
            "type": "",
            "fdirection": "",
            "flevel": ""
        };
    },
    mounted () {
        this.query();
    },
    "methods": {
        query () {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/bigScreen/queryWeather",
                "headers": { 
                    "Authorization": self.token// 请求头                                              
                },
                success (json) {
                    self.temperature = json.temperature;
                    self.type = json.type;
                    self.fdirection = json.fdirection;
                    self.flevel = json.flevel;
                }
            });
        }
    }

};
</script>
