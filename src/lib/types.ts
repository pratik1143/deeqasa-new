export type FunnelData = {
    id: number;
    rowNumber: number;
    status: 'Won' | 'Lost' | 'Pipeline';
    revenue: number;
    closureMonth: string;
    region: string;
    segment: string;
    product: string;
    accountName: string;
    owner: string;
    probability: number;
    state?: string;
    oppCloseMonth?: string;
    productLine?: string;
    lastModified?: string;
  };
  