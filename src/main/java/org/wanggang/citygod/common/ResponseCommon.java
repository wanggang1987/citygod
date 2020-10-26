/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.common;

import io.swagger.annotations.ApiModel;
import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.wanggang.citygod.util.FunctionUtils;

/**
 *
 * @author wanggang
 */
@ApiModel(description = "API接口返回统一结构")
@Data
@AllArgsConstructor
public class ResponseCommon {

    private Timestamp timestamp;
    private int status;
    private String error;
    private Object message;
    private String path;

    public static ResponseCommon success() {
        return success(ResponseStatus.SUCCESS);
    }

    public static ResponseCommon response(ResponseStatus status) {
        return new ResponseCommon(FunctionUtils.currentTime(), status.getValue(), "", status, "");
    }

    public static ResponseCommon success(Object object) {
        return new ResponseCommon(FunctionUtils.currentTime(), ResponseStatus.SUCCESS.getValue(), "", object, "");
    }
}
