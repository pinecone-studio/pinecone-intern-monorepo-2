"use client";
import React from "react";

export const Section: React.FC<{ title: string; actionText?: string; onAction?: () => void; children?: React.ReactNode }> = ({
  title,
  actionText,
  onAction,
  children,
}) => {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#191919]">{title}</h2>
        {actionText ? (
          <button onClick={onAction} className="text-xs text-muted-foreground hover:underline">
            {actionText}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}; 

