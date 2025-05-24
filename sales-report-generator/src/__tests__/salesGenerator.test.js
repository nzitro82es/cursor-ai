"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const salesGenerator_1 = require("../utils/salesGenerator");
const metricsCalculator_1 = require("../utils/metricsCalculator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sync_1 = require("csv-parse/sync");
describe('SalesGenerator', () => {
    const testOutputPath = path_1.default.join(__dirname, 'test-sales.csv');
    const testMetricsPath = path_1.default.join(__dirname, 'test-metrics.csv');
    afterEach(() => {
        // Cleanup test files
        [testOutputPath, testMetricsPath].forEach(file => {
            if (fs_1.default.existsSync(file)) {
                fs_1.default.unlinkSync(file);
            }
        });
    });
    it('should generate correct number of sales records', () => __awaiter(void 0, void 0, void 0, function* () {
        const generator = new salesGenerator_1.SalesGenerator();
        const numRecords = 100;
        yield generator.generateSalesFile(numRecords, testOutputPath);
        const fileContent = fs_1.default.readFileSync(testOutputPath, 'utf-8');
        const records = (0, sync_1.parse)(fileContent, { columns: true });
        expect(records.length).toBe(numRecords);
        expect(records[0]).toHaveProperty('id');
        expect(records[0]).toHaveProperty('order_id');
        expect(records[0]).toHaveProperty('customer_id');
        expect(records[0]).toHaveProperty('total');
        expect(records[0]).toHaveProperty('fecha');
    }));
});
describe('MetricsCalculator', () => {
    const testInputPath = path_1.default.join(__dirname, 'test-input.csv');
    const testOutputPath = path_1.default.join(__dirname, 'test-metrics.csv');
    beforeAll(() => {
        // Create a test input file with known data
        const testData = [
            'id,order_id,customer_id,total,fecha\n',
            '1,1001,1,100.00,2024-01-01\n',
            '2,1002,2,200.00,2024-01-01\n',
            '3,1003,3,300.00,2024-02-01\n'
        ].join('');
        fs_1.default.writeFileSync(testInputPath, testData);
    });
    afterAll(() => {
        // Cleanup test files
        [testInputPath, testOutputPath].forEach(file => {
            if (fs_1.default.existsSync(file)) {
                fs_1.default.unlinkSync(file);
            }
        });
    });
    it('should calculate correct metrics', () => __awaiter(void 0, void 0, void 0, function* () {
        const calculator = new metricsCalculator_1.MetricsCalculator();
        yield calculator.calculateMonthlyMetrics(testInputPath, testOutputPath);
        const fileContent = fs_1.default.readFileSync(testOutputPath, 'utf-8');
        const metrics = (0, sync_1.parse)(fileContent, { columns: true });
        expect(metrics.length).toBe(2); // Two months of data
        const januaryMetrics = metrics.find((m) => m.Month === '1' && m.Year === '2024');
        expect(januaryMetrics).toBeTruthy();
        expect(Number(januaryMetrics['Number of Sales'])).toBe(2);
        expect(Number(januaryMetrics.Minimum)).toBe(100);
        expect(Number(januaryMetrics.Maximum)).toBe(200);
        expect(Number(januaryMetrics.Mean)).toBe(150);
    }));
});
