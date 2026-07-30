import { getBrandById } from "@/lib/workspace/manager";

export interface ScheduledJob {
  id: string;
  brandId: string;
  targetPlatform: string;
  scheduledAtUTC: string;
  brandTimezone: string;
  scheduledAtLocal: string;
  isRecurring: boolean;
  recurrenceIntervalDays?: number;
  status: "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED";
}

export class TimezoneScheduler {
  /**
   * Convert local brand time to UTC string
   */
  static normalizeToUTC(localDateString: string, timeZone: string = "America/New_York"): string {
    try {
      const date = new Date(localDateString);
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  /**
   * Format UTC timestamp into Brand's local timezone display
   */
  static formatBrandLocalTime(utcDateString: string, timeZone: string = "America/New_York"): string {
    try {
      const date = new Date(utcDateString);
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch {
      return utcDateString;
    }
  }

  /**
   * Schedule a delayed or recurring publishing job
   */
  static createScheduledJob(
    brandId: string,
    targetPlatform: string,
    localScheduledTime: string,
    isRecurring: boolean = false,
    recurrenceIntervalDays?: number
  ): ScheduledJob {
    const brand = getBrandById(brandId);
    const timezone = brand?.timezone || "America/New_York";
    const utcTime = this.normalizeToUTC(localScheduledTime, timezone);

    return {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      brandId,
      targetPlatform,
      scheduledAtUTC: utcTime,
      brandTimezone: timezone,
      scheduledAtLocal: localScheduledTime,
      isRecurring,
      recurrenceIntervalDays,
      status: "PENDING",
    };
  }
}
