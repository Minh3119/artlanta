import React, { useEffect } from "react";

export default function AquaChatBot() {
    useEffect(() => {

        if (!document.getElementById("df-script")) {
            const script = document.createElement("script");
            script.src =
                    "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js";
            script.id = "df-script";
            document.body.appendChild(script);
        }

        if (!document.getElementById("df-messenger")) {
            const dfMessenger = document.createElement("df-messenger");
            dfMessenger.setAttribute("intent", "WELCOME");
            dfMessenger.setAttribute("chat-title", "Artlanta-Aqua");
            dfMessenger.setAttribute(
                    "agent-id",
                    "a22cae58-d20b-4215-8e95-d47a66f6f4f3"
                    );
            dfMessenger.setAttribute("language-code", "en");
            dfMessenger.id = "df-messenger";

            document.body.appendChild(dfMessenger);
        }
    }, []);

    return null;
}
