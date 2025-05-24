export interface Sale {
    id: number;
    order_id: number;
    customer_id: number;
    total: number;
    fecha: Date;
}

export interface SaleMetrics {
    year: number;
    month: number;
    count: number;
    min: number;
    max: number;
    mean: number;
    standardDeviation: number;
} 