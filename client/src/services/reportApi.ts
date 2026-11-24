const API_URL = "http://localhost:3000";

export type Report = {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  location: string;
  incidentDate: string;
  imageUrl: string | null;
  reporterId: string;
  contactMethod: string;
  createdAt: string;
  status: string;
};


export async function getReports(
  filters: ReportFilters = {}
): Promise<Report[]> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${API_URL}/reports?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil data laporan");
  }

  const result = await response.json();

  return result.data;
}

export async function getReportById(id: string): Promise<Report> {
  const response = await fetch(`${API_URL}/reports/${id}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil detail laporan");
  }

  const result = await response.json();

  return result.data;
}

export type CreateReportPayload = {
  title: string;
  description: string;
  type: "LOST" | "FOUND";
  category: string;
  location: string;
  incidentDate: string;
  reporterId: string;
  contactMethod: "EMAIL" | "WHATSAPP";
};

export async function createReport(
  report: CreateReportPayload
): Promise<Report> {
  const response = await fetch(`${API_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    throw new Error("Gagal mengirim laporan");
  }

  const result = await response.json();

  return result.data;
}

export type ReportFilters = {
  search?: string;
  type?: string;
  category?: string;
  location?: string;
  status?: string;
  incidentDate?: string;
  page?: number;
  limit?: number;
};
