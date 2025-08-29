"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export type HotelCardProps = {
  id: string;
    title: string;
  imageUrl: string;
  subtitle?: string;
  badgeText?: string;
};

export const HotelCard: React.FC<HotelCardProps> = ({ id, title, imageUrl, subtitle, badgeText }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full h-[170px] bg-gray-100">
        {/* Use plain img to avoid Next/Image config needs */}
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-3">
        <h3 className="text-sm font-semibold line-clamp-1">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{subtitle}</p> : null}
        {badgeText ? (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700">
            <span className="font-medium">{badgeText}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}; 
