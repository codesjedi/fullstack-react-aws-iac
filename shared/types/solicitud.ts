export interface Solicitud {
  id: string;
  name: string;
  email: string;
  amount: number;
  type: string; 
  comments: string;
  createdAt: string;
}

export interface CreateSolicitudRequest {
  name: string;
  email: string;
  amount: number;
  type: string; 
  comments: string;
}

export interface CreateSolicitudResponse {
  message: string;
  data: Solicitud;
}

export interface GetSolicitudesResponse {
  count: number;
  data: Solicitud[];
}