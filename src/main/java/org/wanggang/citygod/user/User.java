package org.wanggang.citygod.user;

import org.wanggang.citygod.BasicObject;
import lombok.Data;

@Data
public class User extends BasicObject {

    private String name;
    private String source;
}
