import { Sale } from '../types';
import { createObjectCsvWriter } from 'csv-writer';
import cliProgress from 'cli-progress';
import { subYears } from 'date-fns';

export class SalesGenerator {
    private currentId = 1;
    private currentOrderId = 1000;

    private generateRandomSale(): Sale {
        const total = parseFloat((Math.random() * 1000 + 10).toFixed(2));
        const customerId = Math.floor(Math.random() * 1000) + 1;
        
        // Generate date within the last 5 years
        const endDate = new Date();
        const startDate = subYears(endDate, 5);
        const fecha = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

        return {
            id: this.currentId++,
            order_id: this.currentOrderId++,
            customer_id: customerId,
            total,
            fecha
        };
    }

    async generateSalesFile(numRecords: number, outputPath: string): Promise<void> {
        const csvWriter = createObjectCsvWriter({
            path: outputPath,
            header: [
                { id: 'id', title: 'id' },
                { id: 'order_id', title: 'order_id' },
                { id: 'customer_id', title: 'customer_id' },
                { id: 'total', title: 'total' },
                { id: 'fecha', title: 'fecha' }
            ]
        });

        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(numRecords, 0);

        const BATCH_SIZE = 10000;
        for (let i = 0; i < numRecords; i += BATCH_SIZE) {
            const batchSize = Math.min(BATCH_SIZE, numRecords - i);
            const batch = Array.from({ length: batchSize }, () => this.generateRandomSale());
            await csvWriter.writeRecords(batch);
            progressBar.update(i + batchSize);
        }

        progressBar.stop();
    }
} 