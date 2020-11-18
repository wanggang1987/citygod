/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import java.io.IOException;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

/**
 *
 * @author wanggang
 */
// 过滤器2：当其他请求发送来，校验 token 的过滤器，如果校验成功，就让请求继续执行
// 请求时注意认证方式选择 Bearer Token
public class JwtFilter extends GenericFilterBean {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        // 获取 token ，注意获取方式要跟前台传的方式保持一致
        // 这里请求时注意认证方式选择 Bearer Token，会用 header 传递
        String jwtToken = req.getHeader("authorization");
        // 注意 "abc@123" 要与生成 token 时的保持一致
        Jws<Claims> jws = Jwts.parser().setSigningKey("abc@123")
                .parseClaimsJws(jwtToken.replace("Bearer", ""));
        Claims claims = jws.getBody();
        // 获取用户名
        String username = claims.getSubject();
        // 获取用户角色，注意 "authorities" 要与生成 token 时的保持一致
        List<GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList((String) claims.get("authorities"));
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(token);
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
