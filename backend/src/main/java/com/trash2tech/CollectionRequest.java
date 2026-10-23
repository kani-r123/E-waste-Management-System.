package com.trash2tech;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "collection_requests")
public class CollectionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String itemType;
    private Integer quantity;
    private String area;
    private String status = "Pending";
    private Instant createdAt = Instant.now();

    public CollectionRequest() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getItemType() { return itemType; }
    public Integer getQuantity() { return quantity; }
    public String getArea() { return area; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setArea(String area) { this.area = area; }
    public void setStatus(String status) { this.status = status; }
}
