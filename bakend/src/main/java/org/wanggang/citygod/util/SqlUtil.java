/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author wanggang
 */
@RestController("/")
public class SqlUtil {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("sql")
    public String test(@RequestBody String sql) throws UnsupportedEncodingException {
        sql = URLDecoder.decode(sql, "utf-8");
        log.info(sql);
        String str = null;
        try {
            if (sql.toLowerCase().contains("insert")
                    || sql.toLowerCase().contains("update")
                    || sql.toLowerCase().contains("delete")) {
                jdbcTemplate.execute(sql);
            } else {
                if (!sql.contains(";")) {
                    sql += ";";
                }
                if (!sql.toLowerCase().contains("limit")) {
                    sql = sql.replace(";", " limit 100;");
                }
                log.info(sql);
                str = BeanUtils.bean2json(jdbcTemplate.queryForList(sql));
            }
        } catch (DataAccessException e) {
            log.error(e.getMessage());
            log.error(e.toString());
            return e.getMessage();
        }
        log.info(str);
        return str;
    }

}