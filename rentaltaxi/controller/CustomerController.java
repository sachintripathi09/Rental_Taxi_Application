package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.CustomerUpdateRequest;
import java.util.List;
import com.rentaltaxi.dto.response.CustomerResponse;
import com.rentaltaxi.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    
   
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/me")
    public ResponseEntity<CustomerResponse> getCurrentCustomer() {
        return ResponseEntity.ok(customerService.getCurrentCustomer(getCurrentUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<CustomerResponse> updateCustomer(@Valid @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(getCurrentUsername(), request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentCustomer() {
        // Note: Deleting customer is not implemented in the Service layer. 
        // If you want to add it, add the method to CustomerService and call it here.
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable Integer id, @Valid @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }
}