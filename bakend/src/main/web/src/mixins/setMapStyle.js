export default {
    "methods": {
        setMapStyle (map) {
            const styleJson = [
                {
                    "featureType": "poilabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                },{
                    "featureType": "poilabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }
            ];
            // http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/custom
            map.setMapStyle({
                "styleJson": styleJson
            });  
        }
    }
};