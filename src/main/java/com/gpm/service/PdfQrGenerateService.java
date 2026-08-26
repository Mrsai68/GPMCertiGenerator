package com.gpm.service;

import com.gpm.entity.CertificateRequest;
import com.gpm.entity.IssuedCertificate;
import com.gpm.entity.StudentProfile;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

@Service
public class PdfQrGenerateService {

    @Value("https://gpmcertigenerator.onrender.com")
    private String frontendUrl;

    public byte[] generateQrCodeImage(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

    public byte[] generateCertificatePdf(IssuedCertificate cert, StudentProfile profile) throws Exception {
        CertificateRequest req = cert.getRequest();
        String verificationUrl = frontendUrl + "/verify/" + cert.getVerificationToken();

        // 1. Generate QR Code Image
        byte[] qrBytes = generateQrCodeImage(verificationUrl, 150, 150);
        Image qrImage = Image.getInstance(qrBytes);
        qrImage.scaleToFit(85, 85);
        qrImage.setAlignment(Element.ALIGN_CENTER);

        // 2. Setup OpenPDF Document
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        PdfWriter writer = PdfWriter.getInstance(document, out);

        document.open();

        // Border Frame
        PdfContentByte canvas = writer.getDirectContent();
        Rectangle pageRect = new Rectangle(20, 20, document.getPageSize().getWidth() - 20, document.getPageSize().getHeight() - 20);
        canvas.setLineWidth(2.5f);
        canvas.setColorStroke(new Color(30, 58, 138)); // Navy Blue
        canvas.rectangle(pageRect.getLeft(), pageRect.getBottom(), pageRect.getWidth(), pageRect.getHeight());
        canvas.stroke();

        // Fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(30, 58, 138));
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(71, 85, 105));
        Font certHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(185, 28, 28));
        Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.BLACK);
        Font boldTextFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.BLACK);
        Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, Color.GRAY);

        // Header / Letterhead
        Paragraph header = new Paragraph("GOVERNMENT POLYTECHNIC, MIRAJ", titleFont);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);

        Paragraph subHeader = new Paragraph("Mazi Sainik Vasahat, Miraj MIDC, Miraj\nTal- Miraj, Dist- Sangli - 416 410 ", subtitleFont);
        subHeader.setAlignment(Element.ALIGN_CENTER);
        subHeader.setSpacingAfter(15);
        document.add(subHeader);

        // Divider Line
        Paragraph line = new Paragraph("_______________________________________________________________________________", subtitleFont);
        line.setAlignment(Element.ALIGN_CENTER);
        line.setSpacingAfter(15);
        document.add(line);

        // Certificate Meta (No & Date)
        PdfPTable metaTable = new PdfPTable(2);
        metaTable.setWidthPercentage(100);

        PdfPCell cell1 = new PdfPCell(new Phrase("Ref No: " + cert.getCertificateNumber(), boldTextFont));
        cell1.setBorder(Rectangle.NO_BORDER);
        cell1.setHorizontalAlignment(Element.ALIGN_LEFT);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        String formattedDate = cert.getIssueDate().format(formatter);
        PdfPCell cell2 = new PdfPCell(new Phrase("Date: " + formattedDate, boldTextFont));
        cell2.setBorder(Rectangle.NO_BORDER);
        cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);

        metaTable.addCell(cell1);
        metaTable.addCell(cell2);
        metaTable.setSpacingAfter(25);
        document.add(metaTable);

        // Title: BONAFIDE CERTIFICATE
        Paragraph certTitle = new Paragraph("BONAFIDE CERTIFICATE", certHeaderFont);
        certTitle.setAlignment(Element.ALIGN_CENTER);
        certTitle.setSpacingAfter(25);
        document.add(certTitle);

        // Body Content
        Paragraph body = new Paragraph();
        body.setLeading(22);
        body.setFont(textFont);

        body.add(new Chunk("This is to certify that Mr. / Ms. "));
        body.add(new Chunk(profile.getFullName().toUpperCase(), boldTextFont));
        body.add(new Chunk(", bearing Enrollment No. "));
        body.add(new Chunk(profile.getEnrollmentNo(), boldTextFont));
        body.add(new Chunk(", is a genuine and bonafide student of this institution studying in "));
        body.add(new Chunk(profile.getYearOfStudy() + " (" + profile.getDepartment() + ")", boldTextFont));
        body.add(new Chunk(" during the Academic Year "));
        body.add(new Chunk(profile.getAcademicYear(), boldTextFont));
        body.add(new Chunk(".\n\n"));

        body.add(new Chunk("This certificate is issued upon the student's request for the purpose of: "));
        body.add(new Chunk(req.getPurpose().toUpperCase(), boldTextFont));
        body.add(new Chunk(". To the best of our knowledge, his/her character and conduct during the stay in the college have been GOOD."));
        body.setSpacingAfter(30);

        document.add(body);

        // Signatures and QR Code Table
        PdfPTable footerTable = new PdfPTable(3);
        footerTable.setWidthPercentage(100);
        footerTable.setWidths(new float[]{35, 30, 35});

        // Cell 1: QR Code
        PdfPCell qrCell = new PdfPCell();
        qrCell.setBorder(Rectangle.NO_BORDER);
        qrCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        qrCell.addElement(qrImage);
        Paragraph qrCaption = new Paragraph("Scan to Verify Authenticity", footerFont);
        qrCaption.setAlignment(Element.ALIGN_CENTER);
        qrCell.addElement(qrCaption);

        // Cell 2: Seal
        PdfPCell sealCell = new PdfPCell();
        sealCell.setBorder(Rectangle.NO_BORDER);
        sealCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        Paragraph sealText = new Paragraph("\n\n[ INSTITUTIONAL SEAL ]", footerFont);
        sealText.setAlignment(Element.ALIGN_CENTER);
        sealCell.addElement(sealText);

        // Cell 3: Principal Signature
        PdfPCell sigCell = new PdfPCell();
        sigCell.setBorder(Rectangle.NO_BORDER);
        sigCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        Paragraph sigText = new Paragraph("\n\n_______________________\nHead of Institution / HOD\n(Authorized Signatory)", boldTextFont);
        sigText.setAlignment(Element.ALIGN_CENTER);
        sigCell.addElement(sigText);

        footerTable.addCell(qrCell);
        footerTable.addCell(sealCell);
        footerTable.addCell(sigCell);
        footerTable.setSpacingAfter(20);

        document.add(footerTable);

        // Verification Footer Disclaimer
        Paragraph disclaimer = new Paragraph("Note: This is a system-generated smart digital certificate secured via cryptographic verification. Authenticity can be verified online at " + verificationUrl, footerFont);
        disclaimer.setAlignment(Element.ALIGN_CENTER);
        document.add(disclaimer);

        document.close();
        return out.toByteArray();
    }

}
