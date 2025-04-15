package com.pms.pms.util;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.logging.log4j.util.Strings;
import org.springframework.data.domain.Page;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pms.pms.entity.PageEntity;
import com.pms.pms.exceptions.BadRequestException;

public class StringUtils {

	public static String trim(String str) {
		if (str != null) {
			return str.trim();
		}
		return null;
	}

	public static int length(final CharSequence cs) {
		return cs == null ? 0 : cs.length();
	}

	public static boolean isBlank(final CharSequence cs) {
		final int strLen = length(cs);
		if (strLen == 0) {
			return true;
		}
		for (int i = 0; i < strLen; i++) {
			if (!Character.isWhitespace(cs.charAt(i))) {
				return false;
			}
		}
		return true;
	}

	public static int nullToZero(int value) {
		if (isNullOrEmpty(value))
			return 0;
		else
			return value;
	}

	public static float nullToZero(float value) {
		if (isNullOrEmpty(value))
			return 0;
		else
			return value;
	}

	public static boolean areEqual(String str1, String str2) {
		if (StringUtils.isNullOrEmpty(str1)) {
			str1 = Strings.EMPTY;
		}
		if (StringUtils.isNullOrEmpty(str2)) {
			str2 = Strings.EMPTY;
		}
		return str1.equals(str2);
	}

	public static boolean areEqualIgnoreCase(String str1, String str2) {
		if (StringUtils.isNullOrEmpty(str1)) {
			str1 = Strings.EMPTY;
		}
		if (StringUtils.isNullOrEmpty(str2)) {
			str2 = Strings.EMPTY;
		}
		return str1.equalsIgnoreCase(str2);
	}

	public static boolean isNumeric(String num) {
		return org.apache.commons.lang3.StringUtils.isNumeric(num);
	}

	public static boolean isFloat(String num) {
		try {
			Float.parseFloat(num);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public static boolean isNotBlank(final CharSequence cs) {
		return !isBlank(cs);
	}

	public static boolean isNotNullAndNotEmpty(Object obj) {
		if (obj == null) {
			return false;
		}

		if (obj instanceof Collection) {
			return !((Collection<?>) obj).isEmpty();
		}

		return !obj.toString().trim().isEmpty();
	}

	public static boolean isNullOrEmpty(Object obj) {
		return !isNotNullAndNotEmpty(obj);
	}

	public static UUID toUUID(String str) {
		if (str == null) {
			return null;
		}
		try {
			return UUID.fromString(str);
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException("please enter UUID fields/headers in properFormat");
		}
	}

	public static String format(String format, String[] args) {
		Object[] argObjects = args;
		return String.format(format, argObjects);
	}

	public static String getTimeStamp() {
		return LocalDateTime.now().format(DateTimeFormatter.ofPattern("YYYY-MM-DD hh:mm:ss a"));
	}

	public static Map<String, Object> WrapToMap(Object... args) {
		HashMap<String, Object> map = new HashMap<>();

		int cond = args.length - 1;

		for (int i = 0; i < cond; i += 2) {
			map.put((String) args[i], args[i + 1]);
		}
		return map;
	}

	public static String convertToJson(Object obj) {
		try {
			return new ObjectMapper().writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	public static String generateRandomString() {
		Pattern pattern = Pattern.compile("[A-Za-z1-9@#$%&]");
		SecureRandom random = new SecureRandom();

		return Stream.generate(() -> {
			char c;
			do {
				c = (char) (random.nextInt(127));
			} while (!pattern.matcher(String.valueOf(c)).matches());
			return c;
		}).limit(8).map(Object::toString).collect(Collectors.joining());
	}

	public static String generateSixDigitNumber() {
		Random random = new Random();
		String sixDigitNumber;

		do {
			sixDigitNumber = String.valueOf(100000 + random.nextInt(900000));
		} while (!sixDigitNumber.matches("\\d{6}")); // Ensuring it matches 6-digit format

		return sixDigitNumber;
	}

	public static PageEntity<?> getPageEntity(Page<?> pagedResult) {
		PageEntity<?> pageEntity = new PageEntity<>();
		pageEntity.setPageNumber(pagedResult.getNumber());
		pageEntity.setPageSize(pagedResult.getSize());
		pageEntity.setContent(pagedResult.getContent());
		pageEntity.setTotalElements(pagedResult.getTotalElements());
		pageEntity.setNoOfElements(pagedResult.getNumberOfElements());
		pageEntity.setTotalPages(pagedResult.getTotalPages());
		return pageEntity;
	}
	
	public static LocalDateTime addThreeMonths(LocalDateTime currentTime) {        
        // Convert String to Instant
        Instant instant =currentTime.toInstant(ZoneOffset.UTC);

        // Convert Instant to LocalDateTime in UTC
        LocalDateTime utcDateTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC);

        // Add 3 months
        LocalDateTime newUtcDateTime = utcDateTime.plusMonths(3);
        
        return newUtcDateTime;
	}
}
