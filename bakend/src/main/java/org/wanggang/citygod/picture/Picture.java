package org.wanggang.citygod.picture;

import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.wanggang.citygod.common.BasicObject;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Table(name = "picture")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Picture extends BasicObject{
    
    private Integer width;
	private Integer height;
	private byte[] stream;
}
