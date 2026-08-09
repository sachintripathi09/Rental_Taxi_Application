package com.rentaltaxi.service;

import java.util.List;

import com.rentaltaxi.dto.request.CustomerUpdateRequest;
import com.rentaltaxi.dto.response.CustomerResponse;

public interface CustomerService {
    CustomerResponse getCurrentCustomer(String username);
    CustomerResponse updateCustomer(String username, CustomerUpdateRequest request);
    CustomerResponse getCustomerById(Integer customerId);
    List<CustomerResponse> getAllCustomers();
    void deleteCustomer(Integer customerId);
    CustomerResponse updateCustomer(Integer customerId, CustomerUpdateRequest request);
}