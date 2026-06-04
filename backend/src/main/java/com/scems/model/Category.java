package com.scems.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    @Column(nullable = false, unique = true)
    private String id;

    @Column(nullable = false)
    private String name;

    private String emoji;
    private String gifUrl;
    private Integer eventCount;
    private String tagline;
    private String reactionBadge;
    private String memeCaption;

    public Category() {}

    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public String getGifUrl() { return gifUrl; }
    public void setGifUrl(String gifUrl) { this.gifUrl = gifUrl; }
    public Integer getEventCount() { return eventCount; }
    public void setEventCount(Integer eventCount) { this.eventCount = eventCount; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getReactionBadge() { return reactionBadge; }
    public void setReactionBadge(String reactionBadge) { this.reactionBadge = reactionBadge; }
    public String getMemeCaption() { return memeCaption; }
    public void setMemeCaption(String memeCaption) { this.memeCaption = memeCaption; }
}
