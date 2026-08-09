package com.rentaltaxi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing 
public class RentalTaxiApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentalTaxiApplication.class, args);
        System.out.println("==========================================");
        System.out.println(">>> Rental Taxi Backend Started Successfully!");
        System.out.println(">>> Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("==========================================");
    }
}
