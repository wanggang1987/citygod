package org.wanggang.citygod.common;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.sql.Timestamp;
import lombok.Data;

@ApiModel(description="数据库对象依赖的基础字段")
@Data
public class BasicObject {

    @ApiModelProperty(value = "数据库ID")
    private Long id;
    @ApiModelProperty(value = "创建时间")
    private Timestamp createTime;
    @ApiModelProperty(value = "更新时间")
    private Timestamp updateTime;
}
