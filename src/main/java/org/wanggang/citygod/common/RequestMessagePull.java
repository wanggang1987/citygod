/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.sql.Timestamp;
import lombok.Data;

/**
 *
 * @author wanggang
 */
@ApiModel(description="拉取消息请求")
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestMessagePull {

    @ApiModelProperty(value = "条数限制")
    private Long limit;
    @ApiModelProperty(value = "起始时间")
    private Timestamp starTime;
    @ApiModelProperty(value = "结束时间")
    private Timestamp endTime;
}
