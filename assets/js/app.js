console.log("App.js loading...");
const { useState, useEffect } = React;
const { Search } = window.lucide || window.LucideReact || {};
const { Sidebar, ProductCard, Cart, Dashboard, ItemsManager, CustomersManager } = window;

const App = () => {
    const [activeTab, setActiveTab] = useState('pos');
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [sales, setSales] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Load initial data from IndexedDB
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [loadedItems, loadedCustomers, loadedSales] = await Promise.all([
                    DataStore.getItems(),
                    DataStore.getCustomers(),
                    DataStore.getSales()
                ]);
                setItems(loadedItems);
                setCustomers(loadedCustomers);
                setSales(loadedSales);
                console.log('✅ Data loaded:', {
                    items: loadedItems.length,
                    customers: loadedCustomers.length,
                    sales: loadedSales.length
                });
            } catch (error) {
                console.error('Failed to load data:', error);
                alert('Failed to load data. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // --- Actions ---

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1, cartId: Date.now() }];
        });
    };

    const updateQuantity = (cartId, newQty) => {
        if (newQty < 1) {
            setCart(prev => prev.filter(i => i.cartId !== cartId));
        } else {
            setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: newQty } : i));
        }
    };

    const clearCart = () => {
        setCart([]);
        setSelectedCustomer(null);
    };

    const generateTicket = (sale, shouldPrint) => {
        const ticketContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket #${sale.id}</title>
                <style>
                    @page { size: 80mm auto; margin: 0; }
                    body { font-family: monospace; width: 78mm; margin: 0 auto; padding: 5px; font-size: 12px; }
                    .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
                    .header h2 { font-size: 16px; margin: 5px 0; }
                    .header p { margin: 2px 0; }
                    .item { display: flex; justify-content: space-between; margin-bottom: 3px; }
                    .total { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; font-weight: bold; text-align: right; font-size: 14px; }
                    .footer { text-align: center; margin-top: 10px; font-size: 10px; }
                    hr { border-top: 1px dashed #000; border-bottom: none; margin: 5px 0; }
                    
                    #print-btn {
                        display: block;
                        width: 100%;
                        padding: 10px;
                        background: #22c55e;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        margin-bottom: 20px;
                    }
                    @media print {
                        #print-btn { display: none; }
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <button id="print-btn" onclick="window.print()">🖨️ PRINT TICKET</button>
                
                <div class="header">
                    <h2>Laundry Cat Vientiane</h2>
                    <p>Ticket #: ${sale.id}</p>
                    <p>Date Issued: ${new Date(sale.date).toLocaleString()}</p>
                    <p>Payment: <strong>${sale.paymentMethod}</strong></p>
                </div>
                <div>
                    <p>Customer: ${sale.customerName || 'Guest'}</p>
                    ${sale.customerId ? `<p>Customer ID: ${sale.customerId}</p>` : ''}
                    ${sale.customerPhone ? `<p>Phone: ${sale.customerPhone}</p>` : ''}
                </div>
                <hr/>
                <div>
                    ${sale.items.map(item => `
                        <div class="item">
                            <span>${item.quantity}x ${item.name}</span>
                            <span>${(item.price * item.quantity).toLocaleString()} LAK</span>
                        </div>
                    `).join('')}
                </div>
                <div class="total">
                    Total: ${sale.total.toLocaleString()} LAK
                </div>
                <div class="footer">
                    <p>Thank you for using our services!</p>
                </div>
            </body>
            </html>
        `;

        const ticketWindow = window.open('', '_blank', 'width=400,height=600');
        if (ticketWindow) {
            ticketWindow.document.open();
            ticketWindow.document.write(ticketContent);
            ticketWindow.document.close();
        } else {
            alert("Please allow popups to print tickets.");
        }
    };

    const handleCheckout = async (paymentMethod, shouldPrint) => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const sale = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: cart,
            total: total,
            customerId: selectedCustomer ? selectedCustomer.id : null,
            customerName: selectedCustomer ? selectedCustomer.name : null,
            customerPhone: selectedCustomer ? selectedCustomer.phone : null,
            paymentMethod: paymentMethod
        };

        try {
            await DataStore.addSale(sale);
            setSales(prev => [...prev, sale]);
            generateTicket(sale, shouldPrint);
            clearCart();
        } catch (error) {
            console.error('Failed to save sale:', error);
            alert('Failed to save sale. Please try again.');
        }
    };

    const handleSaveItem = async (item) => {
        try {
            let newItems;
            if (items.find(i => i.id === item.id)) {
                newItems = items.map(i => i.id === item.id ? item : i);
            } else {
                newItems = [...items, item];
            }
            setItems(newItems);
            await DataStore.saveItems(newItems);
        } catch (error) {
            console.error("Failed to save items:", error);
            alert("Failed to save item! Storage might be full. Please try removing some items or using smaller images.");
            // Revert state if save failed
            const reloadedItems = await DataStore.getItems();
            setItems(reloadedItems);
        }
    };

    const handleDeleteItem = async (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const newItems = items.filter(i => i.id !== id);
            setItems(newItems);
            await DataStore.saveItems(newItems);
        }
    };

    const handleSaveCustomer = async (customer) => {
        try {
            let newCustomers;
            if (customers.find(c => c.id === customer.id)) {
                newCustomers = customers.map(c => c.id === customer.id ? customer : c);
            } else {
                newCustomers = [...customers, customer];
            }
            setCustomers(newCustomers);
            await DataStore.saveCustomers(newCustomers);
        } catch (error) {
            console.error("Failed to save customer:", error);
            alert("Failed to save customer!");
        }
    };

    const handleDeleteCustomer = async (id) => {
        if (confirm('Delete this customer?')) {
            const newCustomers = customers.filter(c => c.id !== id);
            setCustomers(newCustomers);
            await DataStore.saveCustomers(newCustomers);
        }
    };

    const handleDeleteSale = async (id) => {
        if (confirm('Are you sure you want to delete this sale? This will affect your total revenue.')) {
            const newSales = sales.filter(s => s.id !== id);
            setSales(newSales);
            await DataStore.saveSales(newSales);
        }
    };

    const handleImportSales = async (newSales) => {
        try {
            const updatedSales = [...sales, ...newSales];
            setSales(updatedSales);
            await DataStore.saveSales(updatedSales);
        } catch (error) {
            console.error("Import failed:", error);
            alert("Failed to import demo data. Storage might be full.");
        }
    };

    const handleRestoreData = async (data) => {
        try {
            setItems(data.items);
            setCustomers(data.customers);
            setSales(data.sales);
            await DataStore.importData(data);
            alert("Data restored successfully!");
        } catch (error) {
            console.error("Restore failed:", error);
            alert("Failed to restore data.");
        }
    };

    // --- Render ---

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="loading mb-4"></div>
                    <p className="text-gray-600">Loading Laundry Cat POS...</p>
                </div>
            </div>
        );
    }

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans text-gray-900">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 ml-20 md:ml-64 h-full overflow-hidden flex">
                {activeTab === 'pos' && (
                    <>
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Header */}
                            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
                                <h1 className="text-xl font-bold text-gray-800">New Sale</h1>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredItems.map(item => (
                                        <ProductCard key={item.id} item={item} onAdd={addToCart} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cart Sidebar */}
                        <div className="w-96 h-full shadow-xl z-40 bg-white">
                            <Cart
                                cart={cart}
                                onUpdateQuantity={updateQuantity}
                                onRemove={(id) => updateQuantity(id, 0)}
                                onClear={clearCart}
                                onCheckout={handleCheckout}
                                customers={customers}
                                selectedCustomer={selectedCustomer}
                                onSelectCustomer={setSelectedCustomer}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'items' && (
                    <div className="flex-1 h-full overflow-y-auto">
                        <ItemsManager
                            items={items}
                            onSaveItem={handleSaveItem}
                            onDeleteItem={handleDeleteItem}
                        />
                    </div>
                )}

                {activeTab === 'customers' && (
                    <div className="flex-1 h-full overflow-y-auto">
                        <CustomersManager
                            customers={customers}
                            sales={sales}
                            onSaveCustomer={handleSaveCustomer}
                            onDeleteCustomer={handleDeleteCustomer}
                        />
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="flex-1 h-full overflow-y-auto">
                        <Dashboard
                            sales={sales}
                            onDeleteSale={handleDeleteSale}
                            customers={customers}
                            items={items}
                            onImportSales={handleImportSales}
                            onRestore={handleRestoreData}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('✅ App initialized');
