/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.persistence.Table;
import lombok.Data;
import org.wanggang.citygod.common.BasicObject;

/**
 *
 * @author wanggang
 */
@ApiModel(description = "消息结构体")
@Data
@Table(name = "message")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Message extends BasicObject {

    @ApiModelProperty(value = "用户ID")
    private Long userId;
    @ApiModelProperty(value = "用户昵称")
    private String nickName;
    @ApiModelProperty(value = "消息内容")
    private String content;
    private String topic;
    private MessageType type;
}
