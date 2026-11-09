package com.mototaxi.app.api;

import com.mototaxi.app.model.Tariff;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Body;

import java.util.List;
import java.util.Map;

public interface ApiService {

    @GET("tariffs")
    Call<List<Tariff>> getTariffs();

    @POST("auth/login")
    Call<Map<String, Object>> login(@Body Map<String, String> credentials);

    @GET("admin/stats")
    Call<Map<String, Object>> getAdminStats();
}
