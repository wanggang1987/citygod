/* 0: BMAP_NORMAL_MAP     此地图类型展示普通街道视图。
 * 1: BMAP_HYBRID_MAP     此地图类型展示卫星和路网的混合视图。(自 1.2 新增) 
*/
export const mapType = {
    data () {
        return {
            "mayTypeFlag": false
        };
    },
    "methods": {
        changeMapType () {
            if (!this.map) return;
            this.mayTypeFlag = !this.mayTypeFlag;
            const mapType = this.mayTypeFlag ? BMAP_HYBRID_MAP : BMAP_NORMAL_MAP;
            this.map.setMapType(mapType);
        }
    }
};

// 测距
export const rangingTool = {
    data () {
        return {
            "distanceToolFlag": false
        };
    },
    "methods": {
        setDistanceToolInstance (map) {
            this.distanceTool = new BMapLib.DistanceTool(map, {
                "lineStroke": 2
            });
        },
        openDistanceTool (e) {
            const { distanceTool } = this;
            this.distanceToolFlag = true;
            distanceTool && distanceTool.open();
        },
        closeDistanceTool (e) {
            const { distanceTool } = this;
            this.distanceToolFlag = false;
            distanceTool && distanceTool.close();
        },
        changeDistanceTool () {
            if (!this.map) return;
            !this.distanceToolFlag ? this.openDistanceTool() : this.closeDistanceTool();
        }
    },
    beforeRouteLeave (to, from, next) {
        const self = this;
        // 离开该页面时关闭测距
        if (self.distanceToolFlag) self.closeDistanceTool();
        self.$nextTick(() => {
            next();
        });
    }
};