package com.mototaxi;

import com.mototaxi.model.Driver;
import com.mototaxi.model.Rating;
import com.mototaxi.model.Ride;
import com.mototaxi.model.Tariff;
import com.mototaxi.model.User;
import com.mototaxi.repository.DriverRepository;
import com.mototaxi.repository.RatingRepository;
import com.mototaxi.repository.RideRepository;
import com.mototaxi.repository.TariffRepository;
import com.mototaxi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;
    private final RatingRepository ratingRepository;
    private final TariffRepository tariffRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Initialiser les tarifs officiels MotoTaxi
        initTariffs();

        // 2. Administrateur
        if (!userRepository.existsByEmail("admin@mototaxi.tn")) {
            userRepository.save(User.builder()
                    .firstName("Admin")
                    .lastName("MotoTaxi")
                    .email("admin@mototaxi.tn")
                    .phone("+216 71 000 000")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .build());
        }

        // 3. Client principal (Sami Ben Salah)
        User clientSami = userRepository.findByEmail("client@mototaxi.tn").orElseGet(() ->
                userRepository.save(User.builder()
                        .firstName("Sami")
                        .lastName("Ben Salah")
                        .email("client@mototaxi.tn")
                        .phone("+216 98 123 456")
                        .passwordHash(passwordEncoder.encode("Client@123"))
                        .role(User.Role.CUSTOMER)
                        .build())
        );

        // Autres clients pour l'activité
        User clientYasmine = userRepository.findByEmail("yasmine@mototaxi.tn").orElseGet(() ->
                userRepository.save(User.builder()
                        .firstName("Yasmine")
                        .lastName("Dridi")
                        .email("yasmine@mototaxi.tn")
                        .phone("+216 22 345 678")
                        .passwordHash(passwordEncoder.encode("Client@123"))
                        .role(User.Role.CUSTOMER)
                        .build())
        );

        User clientKarim = userRepository.findByEmail("karim@mototaxi.tn").orElseGet(() ->
                userRepository.save(User.builder()
                        .firstName("Karim")
                        .lastName("Daoud")
                        .email("karim@mototaxi.tn")
                        .phone("+216 55 678 901")
                        .passwordHash(passwordEncoder.encode("Client@123"))
                        .role(User.Role.CUSTOMER)
                        .build())
        );

        // 4. Chauffeur principal (Amine - Chauffeur Pro du mockup)
        User amineUser = userRepository.findByEmail("driver@mototaxi.tn").orElseGet(() ->
                userRepository.save(User.builder()
                        .firstName("Amine")
                        .lastName("Jlassi")
                        .email("driver@mototaxi.tn")
                        .phone("+216 94 111 222")
                        .passwordHash(passwordEncoder.encode("Driver@123"))
                        .role(User.Role.DRIVER)
                        .build())
        );

        Driver amineDriver = driverRepository.findByUserId(amineUser.getId()).orElseGet(() ->
                driverRepository.save(Driver.builder()
                        .user(amineUser)
                        .licenseNumber("PERM-77889")
                        .vehicleType(Driver.VehicleType.MOTO)
                        .vehiclePlate("178 TU 3144")
                        .isAvailable(true)
                        .status(Driver.DriverStatus.VALIDATED)
                        .currentLat(36.8180)
                        .currentLng(10.1750)
                        .totalEarnings(1280.0)
                        .build())
        );

        // 5. Chauffeurs en attente de validation (ceux de l'écran Admin de la maquette)
        createPendingDriver("Mohamed", "Ben Ali", "mohamed@mototaxi.tn", "+216 98 123 456", "12/TU/98765", "145 TU 8892", Driver.VehicleType.MOTO);
        createPendingDriver("Leila", "Trabelsi", "leila@mototaxi.tn", "+216 92 887 654", "14/TU/54321", "201 TU 4410", Driver.VehicleType.MOTO);
        createPendingDriver("Ahmed", "Hamdi", "ahmed@mototaxi.tn", "+216 95 121 788", "16/TU/11223", "189 TU 6732", Driver.VehicleType.TAXI);

        // 6. Chauffeurs en ligne pour atteindre la flotte active
        for (int i = 1; i <= 140; i++) {
            String email = "driver" + i + "@mototaxi.tn";
            if (!userRepository.existsByEmail(email)) {
                User u = userRepository.save(User.builder()
                        .firstName("Chauffeur")
                        .lastName("#" + i)
                        .email(email)
                        .phone("+216 90 " + String.format("%03d", i) + " 00")
                        .passwordHash(passwordEncoder.encode("Driver@123"))
                        .role(User.Role.DRIVER)
                        .build());

                driverRepository.save(Driver.builder()
                        .user(u)
                        .licenseNumber("P-" + (1000 + i))
                        .vehicleType(i % 3 == 0 ? Driver.VehicleType.EXPRESS : (i % 2 == 0 ? Driver.VehicleType.TAXI : Driver.VehicleType.MOTO))
                        .vehiclePlate((100 + i) + " TU " + (2000 + i))
                        .isAvailable(true)
                        .status(Driver.DriverStatus.VALIDATED)
                        .currentLat(36.8000 + (Math.random() * 0.05))
                        .currentLng(10.1700 + (Math.random() * 0.05))
                        .totalEarnings(150.0 + (Math.random() * 500))
                        .build());
            }
        }

        // 7. Courses réelles pour Amine (Gains du jour = 87.5 TND, 15 courses)
        LocalDateTime now = LocalDateTime.now();
        if (rideRepository.findByDriver(amineDriver).isEmpty()) {
            double[] prices = {6.5, 8.0, 5.0, 7.5, 6.0, 5.5, 7.0, 4.5, 6.5, 5.0, 6.0, 5.5, 4.5, 5.0, 5.0};
            String[] origins = {"El Menzah", "Lac 1", "Menzah 9", "Ariana", "Centre Ville", "Bardo", "Ennasr", "Manar 2", "El Menzah 6", "Mutuelleville", "Lac 2", "Carthage", "Sidi Bou Said", "La Marsa", "Centre Urbain Nord"};
            String[] destinations = {"Centre Ville", "Centre Urbain Nord", "Ariana", "Bardo", "El Menzah", "Centre Ville", "Manar 1", "Ennasr 2", "Centre Ville", "Avenue Bourguiba", "La Marsa", "La Goulette", "La Marsa", "Gammarth", "Avenue Bourguiba"};

            for (int i = 0; i < 15; i++) {
                Ride r = Ride.builder()
                        .customer(clientSami)
                        .driver(amineDriver)
                        .originAddress(origins[i])
                        .originLat(36.8000 + (i * 0.002))
                        .originLng(10.1800 + (i * 0.002))
                        .destAddress(destinations[i])
                        .destLat(36.8200 + (i * 0.002))
                        .destLng(10.1900 + (i * 0.002))
                        .estimatedPrice(prices[i])
                        .finalPrice(prices[i])
                        .status(Ride.RideStatus.COMPLETED)
                        .requestedAt(now.minusHours(8).plusMinutes(i * 30))
                        .completedAt(now.minusHours(8).plusMinutes(i * 30 + 15))
                        .build();
                rideRepository.save(r);

                // Ratings pour obtenir la note de 4.9
                if (i < 5) {
                    ratingRepository.save(Rating.builder()
                            .ride(r)
                            .customer(clientSami)
                            .driver(amineDriver)
                            .stars(i == 4 ? 4 : 5)
                            .comment(i == 0 ? "Course rapide et chauffeur très prudent !" : "Excellent trajet.")
                            .build());
                }
            }
        }

        // 8. 18 Courses Actives en temps réel dans le système
        if (rideRepository.countByStatusIn(java.util.List.of(Ride.RideStatus.IN_PROGRESS, Ride.RideStatus.PENDING, Ride.RideStatus.ACCEPTED)) < 18) {
            String[] activeOrigins = {"El Menzah 5", "Ennasr 1", "Lac 2", "La Marsa", "Bardo", "Centre Ville", "Ariana Centre", "Manar 1", "Menzah 9", "Carthage", "La Goulette", "Gammarth", "Mutuelleville", "Montplaisir", "Bab Souika", "Menzah 6", "Kram", "Sidi Daoud"};
            String[] activeDests = {"Centre Ville", "Avenue Bourguiba", "Les Berges du Lac", "Centre Urbain Nord", "Bab Saadoun", "Manar 2", "Ennasr 2", "Campus Universitaire", "Avenue Habib Bourguiba", "La Marsa Plage", "Lac 1", "La Marsa", "Centre Ville", "Bardo", "El Menzah", "Centre Ville", "Lac 2", "La Marsa"};

            for (int i = 0; i < 18; i++) {
                Ride.RideStatus st = (i % 3 == 0) ? Ride.RideStatus.PENDING : (i % 2 == 0 ? Ride.RideStatus.IN_PROGRESS : Ride.RideStatus.ACCEPTED);
                rideRepository.save(Ride.builder()
                        .customer(i % 2 == 0 ? clientYasmine : clientKarim)
                        .driver(amineDriver)
                        .originAddress(activeOrigins[i])
                        .originLat(36.8100 + (i * 0.003))
                        .originLng(10.1750 + (i * 0.003))
                        .destAddress(activeDests[i])
                        .destLat(36.8300 + (i * 0.003))
                        .destLng(10.1950 + (i * 0.003))
                        .estimatedPrice(5.0 + (i * 0.8))
                        .status(st)
                        .requestedAt(now.minusMinutes(i * 4 + 2))
                        .build());
            }
        }

        // 9. Compléter le revenu global du jour (pour atteindre ~2450 TND réels)
        Double currentRev = rideRepository.sumRevenueToday(java.time.LocalDate.now().atStartOfDay());
        if (currentRev != null && currentRev < 2400) {
            double remaining = 2450.0 - currentRev;
            int batches = (int) (remaining / 10.0);
            for (int j = 0; j < batches; j++) {
                rideRepository.save(Ride.builder()
                        .customer(clientKarim)
                        .driver(amineDriver)
                        .originAddress("Tunis " + j)
                        .originLat(36.80)
                        .originLng(10.18)
                        .destAddress("Banlieue " + j)
                        .destLat(36.85)
                        .destLng(10.25)
                        .estimatedPrice(10.0)
                        .finalPrice(10.0)
                        .status(Ride.RideStatus.COMPLETED)
                        .requestedAt(now.minusHours(5))
                        .completedAt(now.minusHours(4))
                        .build());
            }
        }
    }

    private void createPendingDriver(String first, String last, String email, String phone, String license, String plate, Driver.VehicleType type) {
        if (!userRepository.existsByEmail(email)) {
            User u = userRepository.save(User.builder()
                    .firstName(first)
                    .lastName(last)
                    .email(email)
                    .phone(phone)
                    .passwordHash(passwordEncoder.encode("Driver@123"))
                    .role(User.Role.DRIVER)
                    .build());

            driverRepository.save(Driver.builder()
                    .user(u)
                    .licenseNumber(license)
                    .vehicleType(type)
                    .vehiclePlate(plate)
                    .isAvailable(false)
                    .status(Driver.DriverStatus.PENDING)
                    .totalEarnings(0.0)
                    .build());
        }
    }

    private void initTariffs() {
        if (tariffRepository.findByVehicleType(Driver.VehicleType.MOTO).isEmpty()) {
            tariffRepository.save(Tariff.builder()
                    .vehicleType(Driver.VehicleType.MOTO)
                    .basePrice(2.0)
                    .pricePerKm(0.8)
                    .build());
        }

        if (tariffRepository.findByVehicleType(Driver.VehicleType.TAXI).isEmpty()) {
            tariffRepository.save(Tariff.builder()
                    .vehicleType(Driver.VehicleType.TAXI)
                    .basePrice(3.5)
                    .pricePerKm(1.2)
                    .build());
        }

        if (tariffRepository.findByVehicleType(Driver.VehicleType.EXPRESS).isEmpty()) {
            tariffRepository.save(Tariff.builder()
                    .vehicleType(Driver.VehicleType.EXPRESS)
                    .basePrice(5.0)
                    .pricePerKm(1.8)
                    .build());
        }
    }
}
