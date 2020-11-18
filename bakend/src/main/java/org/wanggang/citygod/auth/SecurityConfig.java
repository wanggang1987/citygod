/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 *
 * @author wanggang
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    PasswordEncoder passwordEncoder() {
        // return NoOpPasswordEncoder.getInstance();// 密码不加密
        return new BCryptPasswordEncoder();// 密码加密
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 在内存中配置2个用户
        /*auth.inMemoryAuthentication()
                .withUser("admin").password("123456").roles("admin")
                .and()
                .withUser("user").password("123456").roles("user");// 密码不加密*/

        auth.inMemoryAuthentication()
                .withUser("admin").password("$2a$10$fB2UU8iJmXsjpdk6T6hGMup8uNcJnOGwo2.QGR.e3qjIsdPYaS4LO").roles("admin")
                .and()
                .withUser("user").password("$2a$10$3TQ2HO/Xz1bVHw5nlfYTBON2TDJsQ0FMDwAS81uh7D.i9ax5DR46q").roles("user");// 密码加密
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/admin/**").hasRole("admin")
                .antMatchers("/user/**").access("hasAnyRole('user','admin')")
                .antMatchers("/login").permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(new JwtLoginFilter("/login", authenticationManager()), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class)
                .csrf().disable();
    }
}
