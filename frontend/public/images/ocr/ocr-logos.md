# OCR Engine Logos

This directory contains logos for OCR engines used in the OCR & AI Engines module.

## Required Logos

### OCR Engines
- **tesseract-logo.png** - Tesseract OCR open-source engine logo
- **google-vision-logo.png** - Google Cloud Vision OCR service logo
- **amazon-textract-logo.png** - Amazon Textract OCR service logo
- **abbyy-logo.png** - ABBYY FineReader/FlexiCapture logo
- **azure-ocr-logo.png** - Microsoft Azure OCR service logo
- **custom-ocr-logo.png** - Custom/In-house OCR engine logo

## Logo Requirements

- **Format**: PNG with transparent background preferred
- **Size**: Recommended 200x100px or similar aspect ratio
- **Quality**: High resolution for crisp display
- **Background**: Transparent or white background

## Usage

These logos are displayed in the OCR & AI Engines page as service provider cards grouped by category:

- **Open Source**: Tesseract OCR
- **Cloud Service**: Google Cloud Vision, Amazon Textract, Microsoft Azure OCR
- **Enterprise**: ABBYY FineReader
- **In-House**: Custom OCR Tool

## Example Logo Sources

- **Tesseract**: https://github.com/tesseract-ocr/tesseract
- **Google Cloud Vision**: https://cloud.google.com/vision
- **Amazon Textract**: https://aws.amazon.com/textract/
- **ABBYY**: https://www.abbyy.com/
- **Azure OCR**: https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/
- **Custom OCR**: Create a custom logo or use InvOom branding

## Card Layout

Each OCR engine card displays:
- Engine name and description
- Logo (64x64px display size)
- Status badge (Integrated/Not Connected)
- Category tag (Open Source, Cloud Service, Enterprise, In-House)
- Action buttons (Connect, Manage, Docs)

## Fallback

If logos are not available, the component will show:
- A colored placeholder with the engine's first letter/word
- Engine name as text
- Proper fallback styling using InvOom brand colors

## Configuration Modal

Each OCR engine has specific configuration fields:

### Tesseract OCR
- Installation Path
- Language Models

### Google Cloud Vision OCR
- API Key
- Project ID

### Amazon Textract
- AWS Access Key
- AWS Secret Key  
- AWS Region

### ABBYY FineReader
- License Key
- Server URL

### Microsoft Azure OCR
- Subscription Key
- Endpoint

### Custom OCR Tool
- API Endpoint
- Authentication Token 