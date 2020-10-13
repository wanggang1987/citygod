package org.wanggang.citygod.common;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class BasicObject {

    private Long id;
    private Timestamp createTime;
    private Timestamp updateTime;
}
