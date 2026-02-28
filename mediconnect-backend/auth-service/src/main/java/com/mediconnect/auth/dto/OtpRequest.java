package com.mediconnect.auth.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
public class OtpRequest {

    @NotBlank(message = "Phone or email is required")
    private String phoneOrEmail;

    @Pattern(regexp = "^(email|sms)$", message = "Channel must be email or sms")
    private String channel = "sms";
}
