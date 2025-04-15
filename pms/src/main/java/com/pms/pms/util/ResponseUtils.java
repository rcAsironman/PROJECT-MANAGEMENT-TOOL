package com.pms.pms.util;

import com.pms.pms.model.response.ResponseModel;

public class ResponseUtils {
    
    public static ResponseModel buildResponse(Integer statusCode, String statusMsg, Object respData) {
       return ResponseModel.builder()
        .statusCode(statusCode)
        .statusMsg(statusMsg)
        .responseData(respData)
        .build();
    }
    
    public static ResponseModel buildResponse(Integer statusCode, String statusMsg) {
        return buildResponse(statusCode, statusMsg, null);
    }

}
