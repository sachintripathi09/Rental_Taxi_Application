package com.rentaltaxi;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String[] passwords = {
            "Anita@12", "Rahul@34", "Sachin@56", "Pooja@78", "Atul@90", 
            "Riya@12", "Omkar@34", "Kiran@56", "Sneha@78", "Amit@90"
        };
        for (String p : passwords) {
            System.out.println("Hash for " + p + " = " + encoder.encode(p));
        }
    }
}