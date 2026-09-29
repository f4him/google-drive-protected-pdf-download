(async () => {
    // ==============================
    // SETTINGS
    // ==============================

    const PDF_NAME = "Document.pdf";
    const JSPDF_URL =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

    // ==============================
    // LOAD jsPDF
    // ==============================

    if (!window.jspdf) {
        const script = document.createElement("script");

        // Fix for Google's Trusted Types protection
        if (window.trustedTypes) {
            const policy = window.trustedTypes.createPolicy("jspdf-loader", {
                createScriptURL: (url) => url
            });

            script.src = policy.createScriptURL(JSPDF_URL);
        } else {
            script.src = JSPDF_URL;
        }

        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    const { jsPDF } = window.jspdf;

    console.log("jsPDF loaded successfully.");

    // ==============================
    // FIND THE SCROLLABLE ELEMENT
    // ==============================

    const allElements = document.querySelectorAll("*");

    let chosenElement = null;
    let heightOfScrollableElement = 0;

    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];

        if (element.scrollHeight > element.clientHeight) {
            if (element.scrollHeight > heightOfScrollableElement) {
                heightOfScrollableElement = element.scrollHeight;
                chosenElement = element;
            }
        }
    }

    if (!chosenElement) {
        console.log("No scrollable element found.");
        return;
    }

    console.log("Scrollable element found.");
    console.log("Scroll height:", chosenElement.scrollHeight);
    console.log("Visible height:", chosenElement.clientHeight);

    // ==============================
    // AUTO-SCROLL
    // ==============================

    async function autoScroll() {

        if (chosenElement.scrollHeight <= chosenElement.clientHeight) {
            console.log("No scrolling required.");
            return;
        }

        console.log("Starting automatic scrolling...");

        const scrollDistance =
            Math.round(chosenElement.clientHeight / 2);

        let currentPosition = 0;

        while (
            currentPosition <
            chosenElement.scrollHeight - chosenElement.clientHeight
        ) {

            currentPosition += scrollDistance;

            if (
                currentPosition >
                chosenElement.scrollHeight - chosenElement.clientHeight
            ) {
                currentPosition =
                    chosenElement.scrollHeight -
                    chosenElement.clientHeight;
            }

            chosenElement.scrollTo(0, currentPosition);

            console.log(
                "Scrolled to:",
                currentPosition
            );

            // Give Google Drive time to load/render images
            await new Promise(resolve =>
                setTimeout(resolve, 500)
            );
        }

        // Return to the beginning
        chosenElement.scrollTo(0, 0);

        console.log("Scrolling completed.");

        // Give the page a little more time
        await new Promise(resolve =>
            setTimeout(resolve, 1500)
        );
    }

    // ==============================
    // GENERATE PDF
    // ==============================

    async function generatePDF() {

        console.log("Searching for document images...");

        const imgTags =
            document.getElementsByTagName("img");

        const validImages = [];

        for (let i = 0; i < imgTags.length; i++) {

            const img = imgTags[i];

            if (
                img.src &&
                img.src.startsWith(
                    "blob:https://drive.google.com/"
                )
            ) {

                // Make sure image has finished loading
                if (
                    img.complete &&
                    img.naturalWidth > 0 &&
                    img.naturalHeight > 0
                ) {
                    validImages.push(img);
                }
            }
        }

        console.log(
            "Valid document images found:",
            validImages.length
        );

        if (validImages.length === 0) {
            console.error(
                "No Google Drive document images were found."
            );

            console.log(
                "Try opening/scrolling through the entire document first."
            );

            return;
        }

        let doc = null;

        // ==============================
        // PROCESS EACH IMAGE
        // ==============================

        for (let i = 0; i < validImages.length; i++) {

            const img = validImages[i];

            console.log(
                `Processing page ${i + 1} of ${validImages.length}`
            );

            // ------------------------------
            // Create canvas
            // ------------------------------

            const canvas =
                document.createElement("canvas");

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const context =
                canvas.getContext("2d");

            context.drawImage(
                img,
                0,
                0,
                img.naturalWidth,
                img.naturalHeight
            );

            // ------------------------------
            // Convert image to PNG
            // ------------------------------

            const imgDataURL =
                canvas.toDataURL("image/png");

            // ------------------------------
            // Determine orientation
            // ------------------------------

            const orientation =
                img.naturalWidth >
                img.naturalHeight
                    ? "landscape"
                    : "portrait";

            // ------------------------------
            // Original scaling
            // ------------------------------

            const scaleFactor = 1.335;

            const pageWidth =
                img.naturalWidth *
                scaleFactor;

            const pageHeight =
                img.naturalHeight *
                scaleFactor;

            // ==============================
            // FIRST PAGE
            // ==============================

            if (i === 0) {

                doc = new jsPDF({
                    orientation: orientation,
                    unit: "px",
                    format: [
                        pageWidth,
                        pageHeight
                    ]
                });

            }

            // ==============================
            // ADDITIONAL PAGES
            // ==============================

            else {

                doc.addPage(
                    [
                        pageWidth,
                        pageHeight
                    ],
                    orientation
                );

            }

            // ==============================
            // ADD IMAGE
            // ==============================

            doc.addImage(
                imgDataURL,
                "PNG",
                0,
                0,
                img.naturalWidth,
                img.naturalHeight
            );
        }

        // ==============================
        // SAVE PDF
        // ==============================

        console.log("Saving PDF...");

        doc.save(PDF_NAME);

        console.log(
            `Done. ${validImages.length} pages saved as ${PDF_NAME}`
        );
    }

    // ==============================
    // RUN
    // ==============================

    await autoScroll();

    await generatePDF();

})();
