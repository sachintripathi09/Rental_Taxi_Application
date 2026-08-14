package com.rentaltaxi.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j // ADD THIS ANNOTATION
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles Validation Errors (e.g., @NotBlank on JSON body)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Handles Database Constraint Violations (e.g., "Username already taken")
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Data integrity violation: ", ex); // THIS PRINTS THE LOG
        Map<String, String> error = new HashMap<>();
        error.put("error", "Database constraint violation. Username or email already exists.");
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Handles custom ResourceNotFound
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: ", ex); // THIS PRINTS THE LOG
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Handles generic runtime exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        log.error("RuntimeException caught: ", ex); // THIS PRINTS THE LOG IN STS
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage() != null ? ex.getMessage() : "Runtime Exception occurred");
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Handles everything else (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        log.error("Generic Exception caught: ", ex); // THIS PRINTS THE LOG IN STS
        Map<String, String> error = new HashMap<>();
        error.put("error", "An internal server error occurred: " + (ex.getMessage() != null ? ex.getMessage() : "Unknown error"));
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}