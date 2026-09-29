# Google Drive Document to PDF

A browser-console JavaScript utility that extracts rendered document pages from the Google Drive document viewer and combines them into a single PDF using [jsPDF](https://github.com/parallax/jsPDF).

The script automatically scrolls through the document so that Google Drive loads the document pages, detects the rendered page images, and generates a downloadable PDF.

## Features

* Automatically detects the scrollable document area
* Automatically scrolls through the document
* Allows Google Drive time to load lazy-loaded pages
* Detects rendered Google Drive page images
* Converts each page into a PDF page
* Preserves the original page proportions
* Supports portrait and landscape pages
* Downloads the final PDF automatically
* Runs directly from the browser console
* No installation or backend required

## How It Works

```text
Google Drive Document
        ↓
Find scrollable document container
        ↓
Automatically scroll through document
        ↓
Google Drive loads rendered pages
        ↓
Find page images
        ↓
Convert images to PNG
        ↓
Create PDF pages with jsPDF
        ↓
Download Document.pdf
```

## Usage

### 1. Open the document

Open the document in Google Drive using a desktop browser.

Make sure you have permission to view the document.

### 2. Open Developer Tools

In Chrome:

```text
F12
```

Then open the **Console** tab.

You can also use:

```text
Ctrl + Shift + J
```

on Windows/Linux.

### 3. Paste the script

Copy the JavaScript from the repository's script file and paste it into the browser console.

Press **Enter**.

The script will:

1. Load jsPDF.
2. Find the document's scrollable container.
3. Scroll through the document.
4. Wait for Google Drive to render the pages.
5. Find the rendered page images.
6. Generate the PDF.
7. Download `Document.pdf`.

## Requirements

* Google Chrome or another modern Chromium-based browser
* Access to the Google Drive document
* JavaScript enabled
* An internet connection to load jsPDF from CDN

## Important Notes

### Google Drive viewer compatibility

The script identifies page images whose URLs begin with:

```javascript
blob:https://drive.google.com/
```

Google Drive's internal viewer can change over time. If Google changes how document pages are rendered, the script may stop detecting the pages and may require modification.

### Lazy-loaded pages

Google Drive may not load every page until it has been displayed.

The script therefore automatically scrolls through the document before generating the PDF.

For very large documents, the scrolling process may take some time.

### Images

The generated PDF is image-based.

This means:

* Text is not necessarily selectable.
* Text search inside the generated PDF may not work.
* OCR may be required if searchable text is needed.
* PDF file size can become large for documents containing many high-resolution pages.

### Page quality

The PDF is generated from the images rendered by the Google Drive viewer. The resulting quality therefore depends on the resolution of those images.

## Configuration

At the beginning of the script, you can change:

```javascript
const PDF_NAME = "Document.pdf";
```

For example:

```javascript
const PDF_NAME = "My Document.pdf";
```

You can also adjust the jsPDF CDN URL:

```javascript
const JSPDF_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
```

## Privacy

The script runs in your browser.

The document itself is not uploaded to this repository or to a server by the script.

The generated PDF is created locally in the browser and downloaded to your computer.

However, the script loads the jsPDF library from a third-party CDN:

```text
cdnjs.cloudflare.com
```

Review the code before using it with sensitive documents.

## Legal and Ethical Use

Use this tool only with documents that you are authorized to access and reproduce.

Having the ability to view a document does not necessarily mean that you have permission to download, reproduce, redistribute, or share it.

The author does not encourage bypassing access controls, DRM, authentication, or other restrictions imposed by document owners or service providers.

## Troubleshooting

### `TrustedScriptURL` error

If Chrome displays:

```text
This document requires 'TrustedScriptURL' assignment.
```

the script's Trusted Types handling may not be compatible with the current page.

The current version uses a Trusted Types policy when available:

```javascript
const policy = window.trustedTypes.createPolicy(
    "jspdf-loader",
    {
        createScriptURL: (url) => url
    }
);
```

### `No Google Drive document images were found`

Try the following:

1. Make sure the document is actually open in the Google Drive viewer.
2. Scroll through the document manually once.
3. Wait for all visible pages to finish rendering.
4. Run the script again.
5. Check whether the viewer still uses `blob:https://drive.google.com/` image URLs.

### Only some pages appear

Google Drive may not have rendered every page before the script searched for images.

Try increasing the delay in the auto-scroll section:

```javascript
await new Promise(resolve =>
    setTimeout(resolve, 500)
);
```

For example:

```javascript
await new Promise(resolve =>
    setTimeout(resolve, 1000)
);
```

This gives Google Drive more time to render each section.

## Project Structure

A simple repository can contain:

```text
google-drive-to-pdf/
│
├── README.md
├── google-drive-to-pdf.js
└── LICENSE
```

## Dependencies

This project uses:

* JavaScript
* Browser DOM APIs
* HTML Canvas API
* [jsPDF](https://github.com/parallax/jsPDF)

jsPDF is loaded dynamically from cdnjs when the script runs.

## License

Choose an appropriate open-source license for your project.

For example, if you want a permissive license, you can use the MIT License.

See [choosealicense.com](https://choosealicense.com/) for information about available licenses.

---

## Disclaimer

This project is provided for educational and personal automation purposes.

The script depends on the current implementation of the Google Drive document viewer and may stop working if Google changes its internal page-rendering behavior.
