/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.common;

import java.sql.Timestamp;
import lombok.Data;

/**
 *
 * @author wanggang
 */
@Data
public class PullRequest {

    private Long limit;
    private Timestamp starTime;
    private Timestamp endTime;
}
