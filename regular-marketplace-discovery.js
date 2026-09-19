(function () {
    "use strict";

    function testDiscovery() {

        var hub = document.getElementById("rmDiscoveryHub");

        if (!hub) {
            return;
        }

        hub.innerHTML = `
            <div style="
                margin:20px 0;
                padding:25px;
                border:2px solid #d7b35a;
                border-radius:15px;
                background:#fffdf5;
                color:#111;
                font-family:Arial,sans-serif;
                text-align:center;
            ">

                <div style="font-size:40px;">
                    📁
                </div>

                <h2 style="
                    margin:10px 0;
                    color:#8b6508;
                ">
                    MARKETPLACE DISCOVERY
                </h2>

                <p style="
                    margin:8px 0;
                    font-size:16px;
                ">
                    ✅ Discovery JavaScript is working.
                </p>

                <p style="
                    margin:8px 0;
                    color:#555;
                ">
                    🏷️ Brand Promoter
                    • 🌍 Travel & Tourist
                    • 🎬 Movie Promoter
                    • 🌎 World Culture
                </p>

            </div>
        `;

        console.log(
            "ALON DISCOVERY TEST: WORKING"
        );
    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            testDiscovery
        );

    } else {

        testDiscovery();

    }

})();