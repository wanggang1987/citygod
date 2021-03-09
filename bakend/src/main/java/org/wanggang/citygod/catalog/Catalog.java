package org.wanggang.citygod.catalog;

import java.util.List;

import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.wanggang.citygod.common.BasicObject;
import org.wanggang.citygod.picture.Picture;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Table(name = "catalog")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Catalog extends BasicObject {
    private CatalogType type;
    private String title;
    private String content;
    private List<Picture> pictureList;
}
