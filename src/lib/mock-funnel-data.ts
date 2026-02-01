export type FunnelData = {
    id: number;
    status: 'Won' | 'Lost' | 'Pipeline';
    revenue: number;
    closureMonth: string; // e.g., "Jan", "Feb"
    region: string;
    segment: string;
    product: string;
    accountName: string;
    owner: string; // BDM / ISR
    probability: number; // 0 to 1
  };
  
  export const mockFunnelData: FunnelData[] = [
    { id: 1, status: 'Won', revenue: 120000, closureMonth: 'Jan', region: 'North', segment: 'Real Estate', product: 'Cloud Services', accountName: 'Apex Properties', owner: 'Alice', probability: 1 },
    { id: 2, status: 'Pipeline', revenue: 80000, closureMonth: 'Mar', region: 'South', segment: 'IT', product: 'Cybersecurity', accountName: 'Innovate Tech', owner: 'Bob', probability: 0.6 },
    { id: 3, status: 'Lost', revenue: 50000, closureMonth: 'Feb', region: 'East', segment: 'Manufacturing', product: 'Managed Services', accountName: 'Global Manuf.', owner: 'Charlie', probability: 0 },
    { id: 4, status: 'Won', revenue: 250000, closureMonth: 'Feb', region: 'West', segment: 'Real Estate', product: 'Data Center', accountName: 'Sunset Homes', owner: 'Alice', probability: 1 },
    { id: 5, status: 'Pipeline', revenue: 150000, closureMonth: 'Apr', region: 'North', segment: 'IT', product: 'AI Solutions', accountName: 'QuantumLeap', owner: 'David', probability: 0.75 },
    { id: 6, status: 'Won', revenue: 75000, closureMonth: 'Jan', region: 'South', segment: 'Manufacturing', product: 'Cloud Services', accountName: 'Precision Parts', owner: 'Bob', probability: 1 },
    { id: 7, status: 'Lost', revenue: 95000, closureMonth: 'Mar', region: 'East', segment: 'Real Estate', product: 'Cybersecurity', accountName: 'Urban Developers', owner: 'Charlie', probability: 0 },
    { id: 8, status: 'Pipeline', revenue: 200000, closureMonth: 'May', region: 'West', segment: 'IT', product: 'Managed Services', accountName: 'Cybernetics Inc.', owner: 'Alice', probability: 0.5 },
    { id: 9, status: 'Won', revenue: 180000, closureMonth: 'Mar', region: 'North', segment: 'Manufacturing', product: 'Data Center', accountName: 'Synergy Fab', owner: 'David', probability: 1 },
    { id: 10, status: 'Pipeline', revenue: 300000, closureMonth: 'Jun', region: 'South', segment: 'Real Estate', product: 'AI Solutions', accountName: 'Prime Holdings', owner: 'Bob', probability: 0.8 },
    { id: 11, status: 'Won', revenue: 60000, closureMonth: 'Apr', region: 'East', segment: 'IT', product: 'Cloud Services', accountName: 'Connect Solutions', owner: 'Charlie', probability: 1 },
    { id: 12, status: 'Lost', revenue: 110000, closureMonth: 'Jan', region: 'West', segment: 'Manufacturing', product: 'Cybersecurity', accountName: 'MegaCorp', owner: 'Alice', probability: 0 },
    { id: 13, status: 'Pipeline', revenue: 45000, closureMonth: 'Apr', region: 'North', segment: 'Real Estate', product: 'Managed Services', accountName: 'Gateway Realtors', owner: 'David', probability: 0.4 },
    { id: 14, status: 'Won', revenue: 135000, closureMonth: 'May', region: 'South', segment: 'IT', product: 'Data Center', accountName: 'Logic Sphere', owner: 'Bob', probability: 1 },
    { id: 15, status: 'Lost', revenue: 85000, closureMonth: 'Feb', region: 'East', segment: 'Manufacturing', product: 'AI Solutions', accountName: 'Automate Inc.', owner: 'Charlie', probability: 0 },
    { id: 16, status: 'Won', revenue: 220000, closureMonth: 'Jun', region: 'West', segment: 'Real Estate', product: 'Cloud Services', accountName: 'Golden Gate Est.', owner: 'Alice', probability: 1 },
    { id: 17, status: 'Pipeline', revenue: 165000, closureMonth: 'May', region: 'North', segment: 'IT', product: 'Cybersecurity', accountName: 'SecureNet', owner: 'David', probability: 0.9 },
    { id: 18, status: 'Won', revenue: 95000, closureMonth: 'Apr', region: 'South', segment: 'Manufacturing', product: 'Managed Services', accountName: 'Allied Industries', owner: 'Bob', probability: 1 },
    { id: 19, status: 'Lost', revenue: 70000, closureMonth: 'Mar', region: 'East', segment: 'Real Estate', product: 'Data Center', accountName: 'Cityscape Devs', owner: 'Charlie', probability: 0 },
    { id: 20, status: 'Pipeline', revenue: 125000, closureMonth: 'Jun', region: 'West', segment: 'IT', product: 'AI Solutions', accountName: 'FutureAI', owner: 'Alice', probability: 0.55 },
    { id: 21, status: 'Won', revenue: 320000, closureMonth: 'Jan', region: 'North', segment: 'Manufacturing', product: 'Cloud Services', accountName: 'Peak Performance', owner: 'David', probability: 1 },
    { id: 22, status: 'Pipeline', revenue: 90000, closureMonth: 'Mar', region: 'South', segment: 'Real Estate', product: 'Cybersecurity', accountName: 'Sunny Vales', owner: 'Bob', probability: 0.65 },
    { id: 23, status: 'Lost', revenue: 65000, closureMonth: 'Feb', region: 'East', segment: 'IT', product: 'Managed Services', accountName: 'IT Experts', owner: 'Charlie', probability: 0 },
    { id: 24, status: 'Won', revenue: 155000, closureMonth: 'Feb', region: 'West', segment: 'Manufacturing', product: 'Data Center', accountName: 'West-End Fab', owner: 'Alice', probability: 1 },
    { id: 25, status: 'Pipeline', revenue: 175000, closureMonth: 'Apr', region: 'North', segment: 'Real Estate', product: 'AI Solutions', accountName: 'Northern Light', owner: 'David', probability: 0.85 },
  ];
  