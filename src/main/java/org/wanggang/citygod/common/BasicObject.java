package org.wanggang.citygod.common;

import java.sql.Date;
import lombok.Data;

@Data
public class BasicObject {

    private Long id;
    private Date createTime;
    private Date updateTime;
}
