package com.pms.pms.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {

	@Value("${token.secret}")
	private String secret;

	@Value("${token.expire}")
	private Long tokenExpire;

	// validate user name in token and database, expDate
	public boolean validateToken(String token, String userName) {
		String tokenUserName = getUserName(token);
		return (userName.equals(tokenUserName) && !isTokenExp(token));
	}

	// Validate exp Date
	public boolean isTokenExp(String token) {
		Date expDate = getExpDate(token);
		return expDate.before(new Date(System.currentTimeMillis()));
	}

	// Read subject/userName
	public String getUserName(String token) {
		return getClaims(token).getSubject();
	}

	// Read Expire Date
	public Date getExpDate(String token) {
		return getClaims(token).getExpiration();
	}

	// Read token
	public Claims getClaims(String token) {
		try {
			return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
		} catch (Exception e) {
			e.printStackTrace(); // Log the full stack trace for debugging
			throw new RuntimeException("Token validation failed: " + e.getMessage());
		}
	}

	// generate token
	public String generateToken(String subject) {
		return Jwts.builder().setSubject(subject).setIssuer("PMS").setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + (tokenExpire * 1000)))
				.signWith(SignatureAlgorithm.HS512, secret).compact();
	}
}


