package com.pms.pms.filter;

import static com.pms.pms.util.StringUtils.WrapToMap;
import static com.pms.pms.util.StringUtils.convertToJson;
import static com.pms.pms.util.StringUtils.getTimeStamp;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.pms.pms.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil util;

	@Lazy
	@Autowired
	private UserDetailsService userDetailsService;

	private void buildResponse(HttpServletRequest req, HttpServletResponse res, String message) {

		try {
			ServletOutputStream sos = res.getOutputStream();
			res.setContentType("application/json");
			res.setStatus(HttpStatus.BAD_REQUEST.value());
			sos.write(convertToJson(WrapToMap("error", "BAD_REQUEST", "message", message, "path", req.getRequestURI(),
					"status", HttpStatus.BAD_REQUEST.value(), "timeStamp", getTimeStamp())).getBytes());
			sos.close();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		try {
			// read token from auth head
			String token = extractTokenFromRequest(request);

			if (token != null) {
				// do validation
				String userName = util.getUserName(token);
				if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
					UserDetails usr = userDetailsService.loadUserByUsername(userName);
					boolean isValid = util.validateToken(token, usr.getUsername());

					if (isValid) {
						UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
								userName, usr.getPassword(), usr.getAuthorities());
						authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
						SecurityContextHolder.getContext().setAuthentication(authenticationToken);
					}
				}
			}
			filterChain.doFilter(request, response);
		} catch (ExpiredJwtException tee) {
			buildResponse(request, (HttpServletResponse) response, "Token has Expired.");
			return;
		} catch (IllegalArgumentException | SignatureVerificationException iae) {
			buildResponse(request, (HttpServletResponse) response, "Token not Accepted.");
			return;
		} catch (JWTDecodeException de) {
			buildResponse(request, (HttpServletResponse) response, "Token not Accepted.");
			return;
		} catch (Exception exception) {
			exception.printStackTrace();
		}
	}

	public String extractTokenFromRequest(HttpServletRequest request) {
		String authorizationHeader = request.getHeader("Authorization");

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			return authorizationHeader.substring(7); // Remove "Bearer " prefix
		}

		return null;
	}

}
