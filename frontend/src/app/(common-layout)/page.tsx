"use client";

import React from "react";
import { StoreHero } from "@/components/storefront/hero/store-hero";
import { FeaturesBanner } from "@/components/storefront/features-banner";
import { CategorySlider } from "@/components/storefront/category-slider";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { DealBanner } from "@/components/storefront/deal-banner";

export default function StorefrontHomePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Promotional Banner */}
      <StoreHero />

      {/* 5 Value Prop Features */}
      <FeaturesBanner />

      {/* Category Icons Slider */}
      <CategorySlider />

      {/* Flash Deal with Countdown */}
      <DealBanner />

      {/* Featured Products & Brand Partners */}
      <FeaturedProducts />
    </div>
  );
}
