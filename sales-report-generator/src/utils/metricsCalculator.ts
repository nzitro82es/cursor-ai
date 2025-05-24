import { createReadStream, createWriteStream } from 'fs';
import { parse, Parser } from 'csv-parse';
import { SaleMetrics } from '../types';
import cliProgress from 'cli-progress';
import { Transform } from 'stream';

interface CastContext {
    column: string;
}

interface Record {
    fecha: Date;
    total: number;
}

class MonthlyMetrics {
    private metrics: Map<string, {
        count: number;
        min: number;
        max: number;
        sum: number;
        sumSquares: number;
    }> = new Map();

    addValue(date: Date, value: number) {
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const current = this.metrics.get(key);

        if (!current) {
            this.metrics.set(key, {
                count: 1,
                min: value,
                max: value,
                sum: value,
                sumSquares: value * value
            });
        } else {
            current.count++;
            current.min = Math.min(current.min, value);
            current.max = Math.max(current.max, value);
            current.sum += value;
            current.sumSquares += value * value;
        }
    }

    getMetrics(): SaleMetrics[] {
        const result: SaleMetrics[] = [];
        
        for (const [key, data] of this.metrics.entries()) {
            const [year, month] = key.split('-').map(Number);
            const mean = data.sum / data.count;
            const standardDeviation = Math.sqrt(
                (data.sumSquares - data.count * mean * mean) / data.count
            );

            result.push({
                year,
                month,
                count: data.count,
                min: data.min,
                max: data.max,
                mean,
                standardDeviation
            });
        }

        return result;
    }
}

export class MetricsCalculator {
    async calculateMonthlyMetrics(inputPath: string, outputPath: string): Promise<void> {
        const monthlyMetrics = new MonthlyMetrics();
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        let recordCount = 0;

        await new Promise<void>((resolve, reject) => {
            const parser = parse({
                columns: true,
                cast: true
            }) as Parser;

            progressBar.start(100, 0);

            createReadStream(inputPath)
                .pipe(parser)
                .pipe(new Transform({
                    objectMode: true,
                    transform(chunk: Record, encoding, callback) {
                        try {
                            const record = {
                                fecha: new Date(chunk.fecha),
                                total: typeof chunk.total === 'string' ? parseFloat(chunk.total) : chunk.total
                            };
                            monthlyMetrics.addValue(record.fecha, record.total);
                            recordCount++;
                            if (recordCount % 10000 === 0) {
                                progressBar.update(Math.min(99, (recordCount / 1000000) * 100));
                            }
                            callback();
                        } catch (error) {
                            callback(error instanceof Error ? error : new Error(String(error)));
                        }
                    }
                }))
                .on('finish', () => {
                    progressBar.update(100);
                    resolve();
                })
                .on('error', (error) => {
                    progressBar.stop();
                    reject(error instanceof Error ? error : new Error(String(error)));
                });
        });

        progressBar.stop();
        console.log('Processing metrics...');

        // Write results to CSV
        const metrics = monthlyMetrics.getMetrics();
        const writeStream = createWriteStream(outputPath);

        // Write CSV header
        writeStream.write('Year,Month,Number of Sales,Minimum,Maximum,Mean,Standard Deviation\n');

        // Write data rows
        for (const metric of metrics) {
            writeStream.write(`${metric.year},${metric.month},${metric.count},${metric.min},${metric.max},${metric.mean},${metric.standardDeviation}\n`);
        }

        await new Promise<void>((resolve, reject) => {
            writeStream.end((err?: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
} 