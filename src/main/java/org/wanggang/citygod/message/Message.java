/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.Table;
import lombok.Data;
import org.wanggang.citygod.common.BasicObject;

/**
 *
 * @author wanggang
 */
@Data
@Table(name = "message")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Message extends BasicObject {

    private Long userId;
    private String nickName;
    private String content;
}
