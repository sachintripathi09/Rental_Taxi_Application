package com.rentaltaxi.dto.request;

import lombok.Data;

@Data
public class FeedbackUpdateRequest {
    private Integer rating;
    private String comment;
}
