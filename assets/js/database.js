// IndexedDB Database Manager for Laundry Cat Vientiane POS
// Handles 10,000+ customers efficiently

const DB_NAME = 'LaundryCatDB';
const DB_VERSION = 1;

class Database {
    constructor() {
        this.db = null;
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB initialized');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('items')) {
                    const itemStore = db.createObjectStore('items', { keyPath: 'id' });
                    itemStore.createIndex('category', 'category', { unique: false });
                    itemStore.createIndex('name', 'name', { unique: false });
                }

                if (!db.objectStoreNames.contains('customers')) {
                    const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
                    customerStore.createIndex('name', 'name', { unique: false });
                    customerStore.createIndex('phone', 'phone', { unique: false });
                }

                if (!db.objectStoreNames.contains('sales')) {
                    const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
                    salesStore.createIndex('date', 'date', { unique: false });
                    salesStore.createIndex('customerId', 'customerId', { unique: false });
                }

                console.log('✅ Database schema created');
            };
        });
    }

    // Generic add/update method
    async put(storeName, data) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic get method
    async get(storeName, id) {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic get all method
    async getAll(storeName) {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic delete method
    async delete(storeName, id) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Search customers by name or phone
    async searchCustomers(query) {
        const customers = await this.getAll('customers');
        const lowerQuery = query.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            (c.phone && c.phone.includes(query))
        );
    }

    // Get sales by customer
    async getSalesByCustomer(customerId) {
        const tx = this.db.transaction('sales', 'readonly');
        const store = tx.objectStore('sales');
        const index = store.index('customerId');
        return new Promise((resolve, reject) => {
            const request = index.getAll(customerId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Get sales by date range
    async getSalesByDateRange(startDate, endDate) {
        const sales = await this.getAll('sales');
        return sales.filter(s => {
            const saleDate = new Date(s.date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    // Bulk import (for migration from localStorage)
    async bulkImport(storeName, items) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        for (const item of items) {
            store.put(item);
        }

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    // Clear all data in a store
    async clear(storeName) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Export all data (for backup)
    async exportAll() {
        const [items, customers, sales] = await Promise.all([
            this.getAll('items'),
            this.getAll('customers'),
            this.getAll('sales')
        ]);

        return {
            items,
            customers,
            sales,
            exportDate: new Date().toISOString(),
            version: DB_VERSION
        };
    }

    // Import all data (for restore)
    async importAll(data) {
        await this.clear('items');
        await this.clear('customers');
        await this.clear('sales');

        await this.bulkImport('items', data.items || []);
        await this.bulkImport('customers', data.customers || []);
        await this.bulkImport('sales', data.sales || []);

        console.log('✅ Data imported successfully');
    }

    // Get database size estimate
    async getStorageEstimate() {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
                quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2),
                percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2)
            };
        }
        return null;
    }
}

// Initialize database instance
const db = new Database();

// Data Store API (compatible with old localStorage API)
window.DataStore = {
    initialized: false,

    async init() {
        if (!this.initialized) {
            await db.init();
            await this.migrateFromLocalStorage();
            this.initialized = true;
        }
    },

    // Migrate data from localStorage to IndexedDB
    async migrateFromLocalStorage() {
        try {
            const items = JSON.parse(localStorage.getItem('items') || '[]');
            const customers = JSON.parse(localStorage.getItem('customers') || '[]');
            const sales = JSON.parse(localStorage.getItem('sales') || '[]');

            if (items.length > 0 || customers.length > 0 || sales.length > 0) {
                console.log('🔄 Migrating data from localStorage to IndexedDB...');
                await db.bulkImport('items', items);
                await db.bulkImport('customers', customers);
                await db.bulkImport('sales', sales);
                console.log('✅ Migration complete');
            } else {
                // Load initial data if no data exists
                await this.loadInitialData();
            }
        } catch (error) {
            console.error('Migration error:', error);
            await this.loadInitialData();
        }
    },

    async loadInitialData() {
        const itemsCount = (await db.getAll('items')).length;
        if (itemsCount === 0) {
            const initialItems = [
                { id: 1, name: 'Wash & Fold', price: 15000, category: 'Laundry', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400' },
                { id: 2, name: 'Dry Clean - Shirt', price: 50000, category: 'Dry Cleaning', image: 'https://images.unsplash.com/photo-1594890716890-16b1f98b8b9b?w=400' },
                { id: 3, name: 'Dry Clean - Pants', price: 60000, category: 'Dry Cleaning', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400' },
                { id: 4, name: 'Comforter (Queen)', price: 250000, category: 'Bedding', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400' },
                { id: 5, name: 'Comforter (King)', price: 300000, category: 'Bedding', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400' },
                { id: 6, name: 'Blanket', price: 150000, category: 'Bedding', image: 'https://images.unsplash.com/photo-1580301762395-9c64265e9674?w=400' },
                { id: 7, name: 'Detergent Pod', price: 5000, category: 'Retail', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400' },
                { id: 8, name: 'Dryer Sheet (Box)', price: 40000, category: 'Retail', image: 'https://images.unsplash.com/photo-1626806775351-638e32543f19?w=400' },
            ];
            await db.bulkImport('items', initialItems);
            console.log('✅ Initial items loaded');
        }
    },

    // Items
    async getItems() {
        await this.init();
        return await db.getAll('items');
    },

    async saveItems(items) {
        await this.init();
        await db.clear('items');
        await db.bulkImport('items', items);
    },

    async addItem(item) {
        await this.init();
        return await db.put('items', item);
    },

    async deleteItem(id) {
        await this.init();
        return await db.delete('items', id);
    },

    // Customers
    async getCustomers() {
        await this.init();
        return await db.getAll('customers');
    },

    async saveCustomers(customers) {
        await this.init();
        await db.clear('customers');
        await db.bulkImport('customers', customers);
    },

    async addCustomer(customer) {
        await this.init();
        return await db.put('customers', customer);
    },

    async deleteCustomer(id) {
        await this.init();
        return await db.delete('customers', id);
    },

    async searchCustomers(query) {
        await this.init();
        return await db.searchCustomers(query);
    },

    // Sales
    async getSales() {
        await this.init();
        return await db.getAll('sales');
    },

    async saveSales(sales) {
        await this.init();
        await db.clear('sales');
        await db.bulkImport('sales', sales);
    },

    async addSale(sale) {
        await this.init();
        return await db.put('sales', sale);
    },

    async deleteSale(id) {
        await this.init();
        return await db.delete('sales', id);
    },

    async getSalesByCustomer(customerId) {
        await this.init();
        return await db.getSalesByCustomer(customerId);
    },

    // Backup & Restore
    async exportData() {
        await this.init();
        return await db.exportAll();
    },

    async importData(data) {
        await this.init();
        return await db.importAll(data);
    },

    async getStorageInfo() {
        return await db.getStorageEstimate();
    }
};

console.log('✅ Database module loaded');
