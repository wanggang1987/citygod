package org.wanggang.citygod.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import javax.persistence.Table;
import org.wanggang.citygod.common.BasicObject;
import lombok.Data;

@Data
@Table(name = "user")
@JsonIgnoreProperties(ignoreUnknown = true)
public class User extends BasicObject {

    private String name;
    private String mobile;
    private String source;
    private BigDecimal longitude;
    private BigDecimal latitude;
}
