package org.wanggang.citygod.util;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import javax.persistence.Column;
import javax.persistence.Table;
import javax.persistence.Transient;
import org.apache.ibatis.jdbc.SQL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SqlProvider {

    private final Logger log = LoggerFactory.getLogger(SqlProvider.class);
    private static final ConcurrentHashMap<String, String> tableMap = new ConcurrentHashMap();

    private String fieldName(Field field) {
        if (field.isAnnotationPresent(Column.class)) {
            return field.getAnnotation(Column.class).name();
        }
//        return BeanUtils.humpToUnderline(field.getName());
        return field.getName();
    }

    public String update(Object obj) {
        String sql = null;
        try {
            String tableName = getTable(obj);
            List<Field> fields = getColumn(obj);
            sql = new SQL() {
                {
                    UPDATE(tableName);
                    for (Field field : fields) {
                        field.setAccessible(true);
                        if (field.get(obj) != null && !field.getName().equals("id")) {
                            SET(fieldName(field) + "=#{" + field.getName() + "}");
                        }
                    }
                    WHERE("id=#{id}");
                }
            }.toString();
        } catch (IllegalAccessException e) {
            log.error("", e);
        }
        return sql;
    }

    public String insert(Object obj) {
        String sql = null;
        try {
            String tableName = getTable(obj);
            List<Field> fields = getColumn(obj);
            sql = new SQL() {
                {
                    INSERT_INTO(tableName);
                    for (Field field : fields) {
                        field.setAccessible(true);
                        if (field.get(obj) != null) {
                            VALUES(fieldName(field), "#{" + field.getName() + "}");
                        }
                    }
                }
            }.toString();
        } catch (IllegalAccessException e) {
            log.error("", e);
        }
        return sql;
    }

    public String delete(Object obj) {
        String sql = null;
        try {
            String tableName = getTable(obj);
            List<Field> fields = getColumn(obj);
            int n = 0;
            for (Field field : fields) {
                field.setAccessible(true);
                if (field.get(obj) != null) {
                    n += 1;
                }
            }
            if (n == 0) {
                return "select 1";
            }
            sql = new SQL() {
                {
                    DELETE_FROM(tableName);
                    for (Field field : fields) {
                        field.setAccessible(true);
                        if (field.get(obj) != null) {
                            WHERE(fieldName(field) + "=#{" + field.getName() + "}");
                        }
                    }
                }
            }.toString();
        } catch (IllegalAccessException e) {
            log.error("", e);
        }
        return sql;
    }

    public String deleteById(Object obj) {
        String sql = null;
        try {
            String tableName = getTable(obj);
            List<Field> fields = getColumn(obj);
            sql = new SQL() {
                {
                    DELETE_FROM(tableName);
                    for (Field field : fields) {
                        field.setAccessible(true);
                        if (field.get(obj) != null) {
                            WHERE(fieldName(field) + "=#{" + field.getName() + "}");
                        }
                    }
                    WHERE("id=#{id}");
                }
            }.toString();
        } catch (IllegalAccessException e) {
            log.error("", e);
        }
        return sql;
    }

    public String count(Object obj) {
        String dynamicSql = null;
        try {
            String tableName = getTable(obj);
            List<Field> fields = getColumn(obj);
            dynamicSql = new SQL() {
                {
                    SELECT(" count(*) ");
                    FROM(tableName);
                    for (Field field : fields) {
                        field.setAccessible(true);
                        if (field.get(obj) != null) {
                            WHERE(fieldName(field) + "=#{" + field.getName() + "}");
                        }
                    }
                }
            }.toString();
        } catch (IllegalAccessException e) {
            log.error("", e);
        }
        return dynamicSql;
    }

    public String selectN(Object obj) {
        String dynamicSql = null;
        try {
            String tableName = getTable(obj);
            List<Field> fields = getColumn(obj);
            dynamicSql = new SQL() {
                {
                    SELECT(" * ");
                    FROM(tableName);
                    for (Field field : fields) {
                        field.setAccessible(true);
                        if (field.get(obj) != null) {
                            WHERE(fieldName(field) + "=#{" + field.getName() + "}");
                        }
                    }
                }
            }.toString();
        } catch (IllegalAccessException e) {
            log.error("", e);
        }
        return dynamicSql;
    }

    public String selectOne(Object obj) {
        String dynamicSql = null;
        try {
            String tableName = getTable(obj);
            List<Field> fields = getColumn(obj);
            dynamicSql = new SQL() {
                {
                    SELECT(" * ");
                    FROM(tableName);
                    for (Field field : fields) {
                        field.setAccessible(true);
                        if (field.get(obj) != null) {
                            WHERE(fieldName(field) + "=#{" + field.getName() + "}");
                        }
                    }
                }
            }.toString();
        } catch (IllegalAccessException e) {
            log.error("", e);
        }
        dynamicSql += " limit 1";
        return dynamicSql;
    }

    public String getTable(Object obj) {
        log.debug("table map : {}", tableMap);
        String name = obj.getClass().getName();
        if (tableMap.containsKey(name)) {
            return tableMap.get(name);
        }
        String tableName = getTableName(obj);
        tableMap.put(name, tableName);
        return tableName;
    }

    private List<Field> getColumn(Object obj) {
        List<Field> fields = getField(obj);
        log.debug("column info : {}", BeanUtils.bean2json(fields));
        return fields;
    }

    private String getTableName(Object obj) {
        Class cl = obj.getClass();
        boolean isAnnotation = cl.isAnnotationPresent(Table.class);
        String tableName = null;
        if (isAnnotation) {
            Table table = (Table) cl.getDeclaredAnnotation(Table.class);
            tableName = table.name();
        }
        return tableName;
    }

    private List<Field> getField(Object obj) {
        Class cl = obj.getClass();
        List<Field> list = new ArrayList();
        getSupperFields(cl.getSuperclass(), list);
        Field[] fields = cl.getDeclaredFields();
        for (Field field : fields) {
            if (!field.isAnnotationPresent(Transient.class)) {
                list.add(field);
            }
        }
        return list;
    }

    private void getSupperFields(Class supClz, List<Field> fields) {
        if (supClz == null) {
            return;
        }
        Field[] supperFields = supClz.getDeclaredFields();
        for (Field field : supperFields) {
            if (!field.isAnnotationPresent(Transient.class)) {
                fields.add(field);
            }
        }
        getSupperFields(supClz.getSuperclass(), fields);
    }

}
