package com.pms.pms.service.impl;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.pms.pms.exceptions.BadRequestException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailServiceImpl {

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private TemplateEngine templateEngine;

	public String sendEmail(String email) {
		MimeMessage message = mailSender.createMimeMessage();

		try {
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setTo(email);
			helper.setSubject("PMS : Verification Mail");

			Context context = new Context();
			context.setVariable("otp", null);
			String htmlContent = templateEngine.process("EmailTemplate", context);

			helper.setText(htmlContent, true);

			mailSender.send(message);
			log.info("Email sent successfully.");

			return "Verification mail sent successfully.";
		} catch (MessagingException e) {
			e.printStackTrace();
			throw new BadRequestException("Verification mail sent failed");
		}
	}
}
