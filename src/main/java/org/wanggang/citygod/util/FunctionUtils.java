/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.util;

import java.sql.Timestamp;
import java.util.List;

/**
 *
 * @author wanggang
 */
public class FunctionUtils {

    public static Timestamp currentTime() {
        return new Timestamp(System.currentTimeMillis());
    }

    public static boolean isEmpty(Object obj) {
        if (obj == null) {
            return true;
        }
        if ((obj instanceof List)) {
            return ((List) obj).isEmpty();
        }
        if ((obj instanceof String)) {
            return ((String) obj).trim().equals("");
        }
        return false;
    }
}
