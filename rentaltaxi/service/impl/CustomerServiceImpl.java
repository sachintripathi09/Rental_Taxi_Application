package com.rentaltaxi.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import com.rentaltaxi.dto.request.CustomerUpdateRequest;
import com.rentaltaxi.dto.response.CustomerResponse;
import com.rentaltaxi.entity.Customer;
import com.rentaltaxi.repository.CustomerRepository;
import com.rentaltaxi.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepo;

    @Override
    public CustomerResponse getCurrentCustomer(String username) {
        Customer customer = customerRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return mapToResponse(customer);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(String username, CustomerUpdateRequest request) {
        Customer customer = customerRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        if (request.getFullName() != null) customer.setFullName(request.getFullName());
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());
        if (request.getEmail() != null) customer.setEmail(request.getEmail());
        
        return mapToResponse(customerRepo.save(customer));
    }

    @Override
    public CustomerResponse getCustomerById(Integer customerId) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return mapToResponse(customer);
    }
    
    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CustomerResponse mapToResponse(Customer customer) {
        return CustomerResponse.builder()
                .customerId(customer.getCustomerId())
                .username(customer.getUsername())
                .email(customer.getEmail())
                .fullName(customer.getFullName())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
    
    @Override
    @Transactional
    public void deleteCustomer(Integer customerId) {
        if (!customerRepo.existsById(customerId)) {
            throw new RuntimeException("Customer not found with ID: " + customerId);
        }
        customerRepo.deleteById(customerId);
    }
    
    @Override
    @Transactional
    public CustomerResponse updateCustomer(Integer customerId, CustomerUpdateRequest request) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));

        // Update only the fields that were sent by the frontend
        if (request.getFullName() != null) customer.setFullName(request.getFullName());
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());
        if (request.getEmail() != null) customer.setEmail(request.getEmail());

        return mapToResponse(customerRepo.save(customer));
    }
}