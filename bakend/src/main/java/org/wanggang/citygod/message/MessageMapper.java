/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import java.util.List;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.wanggang.citygod.common.RequestMessagePull;
import org.wanggang.citygod.util.SqlProvider;

/**
 *
 * @author wanggang
 */
@Mapper
public interface MessageMapper {

    @InsertProvider(type = SqlProvider.class, method = "insert")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    public void insert(Message message);

    @UpdateProvider(type = SqlProvider.class, method = "update")
    public void update(Message message);

    @DeleteProvider(type = SqlProvider.class, method = "delete")
    public void delete(Message message);

    @DeleteProvider(type = SqlProvider.class, method = "deleteById")
    public void deleteById(Message message);

    @SelectProvider(type = SqlProvider.class, method = "count")
    public Long count(Message message);

    @SelectProvider(type = SqlProvider.class, method = "selectOne")
    public Message selectOne(Message message);

    @SelectProvider(type = SqlProvider.class, method = "selectN")
    public List<Message> selectN(Message message);

    @SelectProvider(type = MessageProvider.class, method = "pull")
    public List<Message> pull(RequestMessagePull pullRequest);

}
