/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.common;

/**
 *
 * @author wanggang
 */
public enum ResponseStatus {
    SUCCESS("成功", 200),
    FAILED("失败", 500),
    ALEARDY_EXISTS("已存在", 501),
    ERROR_REQUEST("错误请求", 502);

    private String message = null;
    private int value = 0;

    ResponseStatus(String message, int value) {
        this.message = message;
        this.value = value;
    }

    public String getMessage() {
        return message;
    }

    public int getValue() {
        return value;
    }

    public static ResponseStatus getType(int val) {
        ResponseStatus responseStatus;
        switch (val) {
            case 200:
                responseStatus = SUCCESS;
                break;
            case 500:
                responseStatus = FAILED;
                break;
            case 501:
                responseStatus = ALEARDY_EXISTS;
                break;
            case 502:
                responseStatus = ERROR_REQUEST;
                break;
            default:
                responseStatus = SUCCESS;
                break;
        }
        return responseStatus;
    }
}
