/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import org.apache.ibatis.jdbc.SQL;
import org.wanggang.citygod.common.RequestMessagePull;
import org.wanggang.citygod.util.FunctionUtils;

/**
 *
 * @author wanggang
 */
public class MessageProvider {

    public String pull(RequestMessagePull pullRequest) {
        return new SQL() {
            {
                SELECT("message.*");
                FROM("message");
                WHERE("createTime > #{starTime}");
                if (!FunctionUtils.isEmpty(pullRequest.getEndTime())) {
                    WHERE("createTime < #{endTime}");
                }
                ORDER_BY("createTime desc limit #{limit}");
            }
        }.toString();
    }
}
