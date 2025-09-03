import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReadingData } from "@/lib/types/readings";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export interface ReportData {
  readings: ReadingData[];
  dateRange: string;
  peakMagnitude: { value: number; time: string };
  avgMagnitude: string;
  significantReadings: number;
  peakActivity: { value: string; siAverage?: number };
  batteryLevel: number;
  aiSummary: string;
}

export function generateSeismicReport(data: ReportData): void {
  const doc = new jsPDF();
  let yPosition = 20;

  const colors = {
    primary: [25, 56, 103] as [number, number, number],
    primaryForeground: [255, 255, 255] as [number, number, number],
    accent: [53, 80, 122] as [number, number, number],
    text: [33, 37, 41] as [number, number, number],
    mutedText: [108, 117, 125] as [number, number, number],
    yellow: [255, 212, 59] as [number, number, number],
  };

  const addImageToDoc = (
    imageUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fallbackText?: string,
  ) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            doc.addImage(dataURL, "PNG", x, y, width, height);
            console.log(`Successfully loaded image: ${imageUrl}`);
            resolve(true);
          } else {
            console.warn(`No canvas context for: ${imageUrl}`);
            addFallbackText(x, y, fallbackText);
            resolve(false);
          }
        } catch (error) {
          console.warn(`Failed to process image: ${imageUrl}`, error);
          addFallbackText(x, y, fallbackText);
          resolve(false);
        }
      };
      img.onerror = (error) => {
        console.warn(`Failed to load image: ${imageUrl}`, error);
        addFallbackText(x, y, fallbackText);
        resolve(false);
      };
      img.src = imageUrl;
    });
  };

  const addFallbackText = (x: number, y: number, text?: string) => {
    if (text) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        colors.primaryForeground[0],
        colors.primaryForeground[1],
        colors.primaryForeground[2],
      );
      doc.text(text, x, y + 10);
    }
  };

  const createHeader = async () => {
    const pageWidth = doc.internal.pageSize.width;

    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 30, "F");

    await addImageToDoc("/queyk-logo-white.png", 10, 5, 25, 8, "QUEYK");

    await addImageToDoc(
      "https://elc-public-images.s3.ap-southeast-1.amazonaws.com/icc-logo.png",
      pageWidth - 18,
      5,
      8,
      8,
      "ICC",
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.yellow[0], colors.yellow[1], colors.yellow[2]);
    doc.text("Seismic Activity Report", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(220, 220, 220);
    doc.text("Immaculada Concepcion College", pageWidth / 2, 22, {
      align: "center",
    });

    yPosition = 40;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.text(`Report Period: ${data.dateRange}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 15;

    return generateContent();
  };

  const generateContent = () => {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Summary Statistics", 20, yPosition);
    yPosition += 12;

    if (data.aiSummary && data.aiSummary.trim()) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

      const splitSummary = doc.splitTextToSize(data.aiSummary, 170);
      doc.text(splitSummary, 20, yPosition);

      const summaryHeight = splitSummary.length * 5;
      yPosition += summaryHeight + 8;
    }

    const summaryData = [
      [
        "Peak SI Maximum",
        `${data.peakMagnitude.value.toFixed(3)} @ ${data.peakMagnitude.time}`,
      ],
      ["Average SI Reading", data.avgMagnitude],
      ["Significant Activity Readings", `${data.significantReadings} readings`],
      [
        "Peak Activity Time",
        `${data.peakActivity.value}${data.peakActivity.siAverage ? ` (${data.peakActivity.siAverage.toFixed(3)} SI)` : ""}`,
      ],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.primaryForeground,
        fontStyle: "bold",
      },
      margin: { left: 20, right: 20 },
    });

    const finalY = doc.lastAutoTable.finalY + 25;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Detailed Readings", 20, finalY);

    const tableData = data.readings
      .slice()
      .reverse()
      .map((reading) => [
        new Date(reading.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        reading.siAverage.toFixed(3),
        reading.siMaximum.toFixed(3),
        reading.siMinimum.toFixed(3),
        `${reading.battery}%`,
        reading.signalStrength,
      ]);

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Time", "SI Avg", "SI Max", "SI Min", "Battery", "Signal"]],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [240, 240, 240],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: colors.accent,
        textColor: colors.primaryForeground,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { halign: "center", cellWidth: 20 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "center", cellWidth: 20 },
        4: { halign: "center", cellWidth: 18 },
        5: { halign: "center", cellWidth: 18 },
      },
      margin: { left: 20, right: 20 },
      tableLineColor: [240, 240, 240],
      tableLineWidth: 0.1,
      showFoot: false,
    });

    const pageCount = doc.internal.pages.length - 1;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      doc.setFontSize(8);
      doc.setTextColor(
        colors.mutedText[0],
        colors.mutedText[1],
        colors.mutedText[2],
      );
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 12, {
        align: "right",
      });
    }

    doc.setPage(pageCount);
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(8);
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.text(
      "Generated by Queyk for Immaculada Concepcion College",
      20,
      pageHeight - 12,
    );

    const sanitizedDateRange = data.dateRange.replace(/[^a-zA-Z0-9-]/g, "_");
    const filename = `seismic_report_${sanitizedDateRange}.pdf`;

    doc.save(filename);
  };

  createHeader().catch((error) => {
    console.warn("Failed to load images, generating PDF without logos:", error);
    const pageWidth = doc.internal.pageSize.width;

    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.yellow[0], colors.yellow[1], colors.yellow[2]);
    doc.text("Seismic Activity Report", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(220, 220, 220);
    doc.text("Immaculada Concepcion College", pageWidth / 2, 22, {
      align: "center",
    });

    yPosition = 40;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.text(`Report Period: ${data.dateRange}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 15;

    generateContent();
  });
}
