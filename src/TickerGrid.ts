interface TickerData {
    name: string;
    companyName: string;
    price: string;
    change: string;
    changePercent: string;
    marketCap: string;
}

export class TickerGrid {
    private snapshotData: string; // Stores the raw snapshot CSV data
    private deltasData: string; // Stores the raw deltas CSV data
    private data: Record<string, TickerData> = {}; // Stores the parsed snapshot data in an object

    constructor(snapshotData: string, deltasData: string) {
        this.snapshotData = snapshotData;
        this.deltasData = deltasData;
    }

    public initialize() {
        // Parse the snapshot data and render the initial grid
        this.parseSnapshotData();
        this.renderGrid();

        // Start processing the deltas for updates
        this.processDeltas();
    }

    private parseSnapshotData() {
        // Split the snapshot data into rows
        const rows = this.snapshotData.split('\n').slice(1); // Skip header row

        // Iterate over each row to populate the data object
        for (const row of rows) {
            const [name, companyName, price, change, changePercent, marketCap] = row.split(',');
            if (name) {
                this.data[name] = { name, companyName, price, change, changePercent, marketCap }; // Assign values to the ticker key
            }
        }
    }

    private renderGrid() {
        // Get the grid container element
        const container = document.getElementById('grid-container');
        if (container) {
            container.innerHTML = ''; // Clear any existing content

            // Iterate over the data object to create grid items
            for (const ticker in this.data) {
                const { companyName, price, change, changePercent, marketCap } = this.data[ticker];
                const item = document.createElement('div');
                item.className = 'grid-item'; // Apply the grid item class
                item.id = `ticker-${ticker}`; // Set a unique ID for the ticker
                item.innerHTML = `
                    <strong>${ticker}</strong><br>
                    ${companyName}<br>
                    ${price}<br>
                    ${change}<br>
                    ${changePercent}<br>
                    ${marketCap}`; // Set the content
                container.appendChild(item); // Append the item to the container
            }
        }
    }

    private async processDeltas() {
        const lines = this.deltasData.split('\n'); // Split deltas data into lines
        let index = 0;

        while (true) {
            // Loop through the deltas indefinitely
            if (index >= lines.length) {
                index = 0; // Reset to start if at the end
            }

            const line = lines[index];

            if (!isNaN(Number(line))) {
                // If the line is a number, wait for that duration in milliseconds
                await this.sleep(Number(line));
            } else {
                // Otherwise, apply the delta
                this.applyDelta(line);
            }

            index++;
        }
    }

    private applyDelta(delta: string) {
        const [ticker, ...values] = delta.split(',');

        if (this.data[ticker]) {
            // Update the data object with new values
            this.data[ticker] = {
                ...this.data[ticker],
                price: values[0],
                change: values[1],
                changePercent: values[2],
                marketCap: values[3]
            };

            // Update the corresponding grid item
            this.updateGridItem(ticker);
        }
    }

    private updateGridItem(ticker: string) {
        const item = document.getElementById(`ticker-${ticker}`);
        if (item) {
            const { companyName, price, change, changePercent, marketCap } = this.data[ticker];
            item.className = 'grid-item grid-item--updated'; // Apply updated class for visual flare
            item.innerHTML = `
                <strong>${ticker}</strong><br>
                ${companyName}<br>
                ${price}<br>
                ${change}<br>
                ${changePercent}<br>
                ${marketCap}`; // Update the content

            // Remove the visual flare after 300ms
            setTimeout(() => {
                item.className = 'grid-item';
            }, 300);
        }
    }

    private sleep(ms: number) {
        // Helper function to introduce a delay
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
