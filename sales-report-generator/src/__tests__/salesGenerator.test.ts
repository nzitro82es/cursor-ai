import { SalesGenerator } from '../utils/salesGenerator';
import { MetricsCalculator } from '../utils/metricsCalculator';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

describe('SalesGenerator', () => {
    const testOutputPath = path.join(__dirname, 'test-sales.csv');
    const testMetricsPath = path.join(__dirname, 'test-metrics.csv');

    afterEach(() => {
        // Cleanup test files
        [testOutputPath, testMetricsPath].forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
    });

    it('should generate correct number of sales records', async () => {
        const generator = new SalesGenerator();
        const numRecords = 100;

        await generator.generateSalesFile(numRecords, testOutputPath);

        const fileContent = fs.readFileSync(testOutputPath, 'utf-8');
        const records = parse(fileContent, { columns: true });

        expect(records.length).toBe(numRecords);
        expect(records[0]).toHaveProperty('id');
        expect(records[0]).toHaveProperty('order_id');
        expect(records[0]).toHaveProperty('customer_id');
        expect(records[0]).toHaveProperty('total');
        expect(records[0]).toHaveProperty('fecha');
    });
});

describe('MetricsCalculator', () => {
    const testInputPath = path.join(__dirname, 'test-input.csv');
    const testOutputPath = path.join(__dirname, 'test-metrics.csv');

    beforeAll(() => {
        // Create a test input file with known data
        const testData = [
            'id,order_id,customer_id,total,fecha\n',
            '1,1001,1,100.00,2024-01-01\n',
            '2,1002,2,200.00,2024-01-01\n',
            '3,1003,3,300.00,2024-02-01\n'
        ].join('');
        fs.writeFileSync(testInputPath, testData);
    });

    afterAll(() => {
        // Cleanup test files
        [testInputPath, testOutputPath].forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
    });

    it('should calculate correct metrics', async () => {
        const calculator = new MetricsCalculator();
        await calculator.calculateMonthlyMetrics(testInputPath, testOutputPath);

        const fileContent = fs.readFileSync(testOutputPath, 'utf-8');
        const metrics = parse(fileContent, { columns: true });

        expect(metrics.length).toBe(2); // Two months of data
        
        const januaryMetrics = metrics.find((m: any) => m.Month === '1' && m.Year === '2024');
        expect(januaryMetrics).toBeTruthy();
        expect(Number(januaryMetrics['Number of Sales'])).toBe(2);
        expect(Number(januaryMetrics.Minimum)).toBe(100);
        expect(Number(januaryMetrics.Maximum)).toBe(200);
        expect(Number(januaryMetrics.Mean)).toBe(150);
    });
}); 