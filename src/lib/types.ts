export type FunnelData = {
    id: number;
    status: 'Won' | 'Lost' | 'Pipeline';
    revenue: number;
    closureMonth: string;
    region: string;
    segment: string;
    product: string;
    accountName: string;
    owner: string;
    probability: number;
  };
  