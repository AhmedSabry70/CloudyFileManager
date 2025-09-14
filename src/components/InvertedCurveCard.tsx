// components/InvertedCurveCard.tsx
import { cn } from "@/lib/utils"; // Utility to merge Tailwind classes
import { FC, ReactNode } from "react";

type InvertedCurveCardProps = {
  icon?: ReactNode;
  title: string;
  usage: string;
  lastUpdate: string;
  className?: string;
};

const InvertedCurveCard: FC<InvertedCurveCardProps> = ({
  icon,
  title,
  usage,
  lastUpdate,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative  p-6 rounded-2xl ",
        "w-full max-w-sm overflow-hidden",
        "before:absolute before:top-0 before:left-0 before:w-40 before:h-40 before:bg-light-400",
        "before:rounded-br-[199px] before:rounded-bl-[69px] before:-translate-x-1/2 before:-translate-y-1/2",
        className
      )}
    >
      <div className="absolute top-4 left-4 bg-blue-500 rounded-full p-3 shadow-md">
        {icon}
      </div>

      <div className="pt-16 text-right bg-white dark:bg-gray-900 shadow-md">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{usage}</p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">{title}</p>

        <div className="border-t mt-3 pt-3 border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">Last update</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{lastUpdate}</p>
        </div>
      </div>
    </div>
  );
};

export default InvertedCurveCard;
