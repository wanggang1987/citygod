/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 *
 * @author wanggang
 */
@SpringBootApplication
public class Boot {

	private static final Logger log = LoggerFactory.getLogger(Boot.class);

	public static void main(String[] args) throws Exception {
		//spring-boot 
		SpringApplication.run(Boot.class, args);

		log.info("Spring boot have been initialized");
	}
}
