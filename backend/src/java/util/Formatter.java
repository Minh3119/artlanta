package util;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Formatter {

    private Formatter() {}

    public static String timeAgo(LocalDateTime pastTime) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(pastTime, now);

        long seconds = duration.getSeconds();
        if (seconds < 60) {
            return seconds + "s";
        }

        long minutes = seconds / 60;
        if (minutes < 60) {
            return minutes + "m";
        }

        long hours = minutes / 60;
        if (hours < 24) {
            return hours + "h";
        }

        long days = hours / 24;
        if (days < 7) {
            return days + "d";
        }

        // Format the date as `MMM d` (for example, `Jan 3`)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d");
        String formattedDate = pastTime.format(formatter);

        // Only show the year if it's not the current year
        if (pastTime.getYear() != now.getYear()) {
            formattedDate += " " + pastTime.getYear();
        }

        return formattedDate;
    }
}
