"use client";

import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import { cn } from "@/utils/cn";

interface DecorativeEllipsisProps {
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export default function DecorativeEllipsis({
  className = "",
  delay = 0.4,
  staggerDelay = 0.2,
}: DecorativeEllipsisProps) {
  return (
    <div className={cn("flex gap-[11px]", className)}>
      <AnimatedWrapper
        as="span"
        amount={0.1}
        animation={{ scale: 0.85, delay }}
        className="size-[14px] rounded-full bg-red"
      />
      <AnimatedWrapper
        as="span"
        amount={0.1}
        animation={{ scale: 0.85, delay: delay + staggerDelay }}
        className="size-[14px] rounded-full bg-red"
      />
      <AnimatedWrapper
        as="span"
        amount={0.1}
        animation={{ scale: 0.85, delay: delay + staggerDelay * 2 }}
        className="size-[14px] rounded-full bg-red"
      />
    </div>
  );
}
