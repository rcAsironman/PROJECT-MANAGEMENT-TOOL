package com.pms.pms.configuration;

import static com.pms.pms.util.StringUtils.WrapToMap;
import static com.pms.pms.util.StringUtils.convertToJson;
import static com.pms.pms.util.StringUtils.getTimeStamp;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.pms.pms.exceptions.CustomAccessDeniedHandler;
import com.pms.pms.filter.JwtFilter;

@Configuration
@EnableWebSecurity
public class JwtConfig {

	private final JwtFilter jwtFilter;

	public JwtConfig(JwtFilter securityFilter) {
		this.jwtFilter = securityFilter;
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable()).authorizeHttpRequests(auth -> auth
				.antMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html/**").permitAll()
				.antMatchers("/user/save-or-update", "/user/login").permitAll().antMatchers("/cust/**")
				.hasAuthority("CUSTOMER").antMatchers("/admin/**").hasAuthority("ADMIN")
				.antMatchers("/admin_cust/**").hasAnyAuthority("ADMIN", "CUSTOMER").anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(exceptions -> exceptions.accessDeniedHandler(accessDeniedHandler())
						.authenticationEntryPoint(authenticationEntryPoint()))
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	AccessDeniedHandler accessDeniedHandler() {
		return new CustomAccessDeniedHandler();
	}

	@Bean
	AuthenticationEntryPoint authenticationEntryPoint() {
		return (HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) -> {
			ServletOutputStream sos = response.getOutputStream();
			response.setContentType("application/json");
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			sos.write(convertToJson(WrapToMap("error", "UNAUTHORIZED", "message", "unauthorized", "path",
					request.getRequestURI(), "status", HttpStatus.UNAUTHORIZED.value(), "timeStamp", getTimeStamp()))
					.getBytes());
			sos.close();
		};
	}
}
