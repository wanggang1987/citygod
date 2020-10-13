/*
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
 */
package org.wanggang.citygod.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.dbutils.BeanProcessor;

/**
 *
 * @author wanggang
 */
public class DomainUtils {

    private final static ObjectMapper mapper = new ObjectMapper();
    private final static BeanProcessor bp = new BeanProcessor();

    public DomainUtils() {
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    public static String humpToUnderline(String propertyName) {
        StringBuilder sb = new StringBuilder(propertyName);
        int temp = 0;//定位
        for (int i = 0; i < propertyName.length(); i++) {
            if (Character.isUpperCase(propertyName.charAt(i))) {
                sb.insert(i + temp, "_");
                temp += 1;
            }
        }
        return sb.toString().toLowerCase();
    }

    public static <T> T json2bean(String json, Class<T> type) {
        try {
            return mapper.readValue(json, type);
        } catch (IOException e) {
            Logger.getLogger(DomainUtils.class.getName()).log(Level.SEVERE, null, e);
        }
        return null;
    }

    public static <T> T bean2bean(Object object, Class<T> type) {
        return json2bean(bean2json(object), type);
    }

    public static LinkedHashMap<String, Object> getValueMap(Object object) {
        return mapper.convertValue(object, LinkedHashMap.class);
    }

    public static String bean2json(Object object) {
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            Logger.getLogger(DomainUtils.class.getName()).log(Level.SEVERE, null, e);
        }
        return null;
    }

    public static JsonNode bean2jsontree(Object object) {
        try {
            String jsonString = mapper.writeValueAsString(object);
            return mapper.readTree(jsonString);
        } catch (JsonProcessingException e) {
            Logger.getLogger(DomainUtils.class.getName()).log(Level.SEVERE, null, e);
        } catch (IOException ex) {
            Logger.getLogger(DomainUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    public static <T> T rs2bean(ResultSet rs, Class<T> type) {
        try {
            return (T) bp.toBean(rs, type);
        } catch (SQLException e) {
            Logger.getLogger(DomainUtils.class.getName()).log(Level.SEVERE, null, e);
        }
        return null;
    }

}
