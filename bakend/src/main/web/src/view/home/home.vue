<template>
    <div class="contents grey_b">
        <div style="padding:6px">
            <div class="pr home" v-cloak style="height:calc(100% - 100px);overflow:auto;max-height: 100%;">
                <Row>
                    <i-col :xs="24" :sm="24" :md="24" :lg="6" style="padding: 6px">
                        <div class="bg">
                            <div class="title">车辆概况</div>
                            <div id="iconProgress" style="height: 333px;">
                                <Row class="item" v-for="(item,index) in iconProgressData" :key="index">
                                    <div class="radiusIcon" :style="{'background':item.color}">
                                        <i class="iconfont" :class="item.icon"></i>
                                    </div>
                                    <div class="DataProgress">
                                        <div class="name">{{item.name}}</div>
                                        <div class="data"><span>{{item.data}}</span>（{{((item.data/item.all)*100).toFixed(2)}}%）</div>
                                        <div class="progress"><Progress :percent="(item.data/item.all)*100" :stroke-color="item.color"  stroke-width="8" hide-info></Progress></div>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </i-col>
                    <i-col  :xs="24" :sm="24" :md="24" :lg="10" style="padding: 6px">
                        <div class="bg">
                            <div class="title">预警类型分析</div>
                            <div id="alarmTypeAnalysis" style="height: 333px;"></div>
                        </div>
                    </i-col>
                    <i-col :xs="24" :sm="24" :md="24" :lg="8" style="padding: 6px">
                        <div class="bg">
                            <div class="title">预警处理情况</div>
                            <div id="alarmHandleStatus" style="height: 333px;"></div>
                        </div>
                    </i-col>
                </Row>
                <Row>
                    <i-col :xs="24" :sm="24" :md="24" :lg="12" style="padding: 6px">
                        <div class="bg homeTable">
                            <Tabs>
                                <tab-pane name="tab1" label="TOP10车辆排名">
                                    <div style="padding: 0 12px 12px">
                                        <Table :columns="vehicleColumns" :data="vehicleData" height="342" @on-sort-change="sortVehicle"></Table>
                                    </div>
                                </tab-pane>
                                <tab-pane name="tab2" label="TOP10企业排名">
                                    <div style="padding: 0 12px 12px">
                                        <Table :columns="companyColumns" :data="companyData" height="342"  @on-sort-change="sortCompany"></Table>
                                    </div>
                                </tab-pane>
                            </Tabs>
                        </div>
                    </i-col>
                    <i-col :xs="24" :sm="24" :md="24" :lg="12" style="padding: 6px">
                        <div class="bg">
                            <div class="title">近七日预警统计分析</div>
                            <div id="alarm7days" style="height: 370px;"></div>
                        </div>
                    </i-col>
                </Row>
            </div>
        </div>

    </div>
</template>

<script src="./home.js"></script>