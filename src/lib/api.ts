import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const submitApplication = async (data: any) => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const fetchApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

export const runAudit = async (applicationId: string) => {
  const response = await api.post(`/applications/${applicationId}/audit`);
  return response.data;
};

export const extractOCR = async (file: File) => {
  const formData = new FormData();
  formData.append('document', file);
  const response = await api.post('/ocr/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
