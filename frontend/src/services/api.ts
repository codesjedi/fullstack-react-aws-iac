import { fetchAuthSession } from 'aws-amplify/auth';

import { awsConfig } from '../config/aws'
import type { Solicitud, CreateSolicitudRequest, CreateSolicitudResponse, GetSolicitudesResponse } from '@shared/types/solicitud'

const API_URL = awsConfig.apiUrl;

export const createdSolicitud = async (data: CreateSolicitudRequest): Promise<Solicitud> => {

  const response = await fetch(`${API_URL}/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create solicitud');
  }

  const result: CreateSolicitudResponse= await response.json();
  return result.data;
}

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const session = await fetchAuthSession();
  const token = session?.tokens?.idToken?.toString();

  if (!token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(`${API_URL}/solicitudes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch solicitudes');
  }

  const result: GetSolicitudesResponse = await response.json();
  return result.data;
}