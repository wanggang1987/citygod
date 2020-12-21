/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.user;

import java.util.List;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.wanggang.citygod.message.Message;
import org.wanggang.citygod.util.SqlProvider;

/**
 *
 * @author wanggang
 */
@Mapper
public interface UserMapper {

    @InsertProvider(type = SqlProvider.class, method = "insert")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    public void insert(User user);

    @UpdateProvider(type = SqlProvider.class, method = "update")
    public void update(User user);

    @DeleteProvider(type = SqlProvider.class, method = "delete")
    public void delete(User user);

    @DeleteProvider(type = SqlProvider.class, method = "deleteById")
    public void deleteById(User user);

    @SelectProvider(type = SqlProvider.class, method = "count")
    public Long count(User user);

    @SelectProvider(type = SqlProvider.class, method = "selectOne")
    public Message selectOne(User user);

    @SelectProvider(type = SqlProvider.class, method = "selectN")
    public List<Message> selectN(User user);

}
