/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.common;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.wanggang.citygod.util.FunctionUtils;

/**
 *
 * @author wanggang
 */
@Data
@AllArgsConstructor
public class CommonResponse {

    private Timestamp timestamp;
    // 200 success
    private int status;
    private String error;
    private String message;
    private String path;
    private Object content;

    public static CommonResponse success() {
        return success(null);
    }

    public static CommonResponse success(Object object) {
        return new CommonResponse(FunctionUtils.currentTime(), 200, "", "success", "", object);
    }
}
