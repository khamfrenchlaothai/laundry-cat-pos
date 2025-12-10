console.log("Components.js loading...");
const { useState, useEffect, useMemo } = React;
const {
    LayoutDashboard,
    ShoppingBasket,
    Users,
    Package,
    Plus,
    Trash2,
    Search,
    Menu,
    X,
    ChevronRight,
    DollarSign,
    CreditCard,
    ChevronUp,
    ChevronDown,
    Download,
    Upload
} = window.lucide || window.LucideReact || {};

// --- Shared Components ---

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'pos', label: 'POS', icon: <ShoppingBasket size={24} /> },
        { id: 'items', label: 'Items', icon: <Package size={24} /> },
        { id: 'customers', label: 'Customers', icon: <Users size={24} /> },
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    ];

    return (
        <div className="w-20 md:w-64 bg-white h-screen shadow-lg flex flex-col fixed left-0 top-0 z-50">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-0 md:mr-3 overflow-hidden">
                    <img src="assets/images/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="hidden md:block font-bold text-xl text-gray-800">Laundry Cat Vientiane</span>
            </div>
            <nav className="flex-1 py-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center p-4 transition-colors ${activeTab === item.id
                            ? 'bg-green-50 text-green-600 border-r-4 border-green-500'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                    >
                        <div className="flex justify-center w-8">{item.icon}</div>
                        <span className="hidden md:block ml-3 font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

// --- POS Components ---

const ProductCard = ({ item, onAdd }) => (
    <div
        onClick={() => onAdd(item)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col h-48"
    >
        <div className="h-32 overflow-hidden bg-gray-100 relative">
            {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={32} />
                </div>
            )}
            <div className="absolute bottom-0 right-0 bg-green-500 text-white px-2 py-1 text-sm font-bold rounded-tl-lg">
                ${item.price.toLocaleString()} LAK
            </div>
        </div>
        <div className="p-3 flex-1 flex flex-col justify-center">
            <h3 className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</h3>
        </div>
    </div>
);

const PaymentModal = ({ total, onConfirm, onCancel }) => {
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [printTicket, setPrintTicket] = useState(true);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="font-bold text-xl text-center">Payment</h3>
                    <p className="text-center text-3xl font-bold text-green-600 mt-2">{total.toLocaleString()} LAK</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        {['Cash', 'One Pay', 'QR'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`py-3 rounded-lg font-medium border-2 transition-all ${paymentMethod === method
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    <label className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <input
                            type="checkbox"
                            checked={printTicket}
                            onChange={e => setPrintTicket(e.target.checked)}
                            className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                        />
                        <span className="font-medium text-gray-700">Print Ticket</span>
                    </label>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            className="py-3 rounded-lg border border-gray-300 font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(paymentMethod, printTicket)}
                            className="py-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Cart = ({ cart, onUpdateQuantity, onRemove, onClear, onCheckout, customers, selectedCustomer, onSelectCustomer }) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200">
            {/* Customer Section */}
            <div className="p-4 border-b border-gray-100">
                {selectedCustomer ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-200 text-green-700 rounded-full flex items-center justify-center font-bold mr-3">
                                {selectedCustomer.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-sm text-gray-800">{selectedCustomer.name}</p>
                            </div>
                        </div>
                        <button onClick={() => onSelectCustomer(null)} className="text-gray-400 hover:text-red-500">
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCustomerModalOpen(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-green-500 hover:text-green-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <Users size={18} />
                        Add Customer to Sale
                    </button>
                )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <ShoppingBasket size={48} className="mb-2 opacity-50" />
                        <p>Cart is empty</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.cartId} className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{item.name}</h4>
                                <p className="text-sm text-gray-500">{item.price.toLocaleString()} LAK x {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                                        className="p-1 hover:bg-gray-100 text-gray-600"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                                        className="p-1 hover:bg-gray-100 text-gray-600"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-right w-16 font-medium">
                                    {(item.price * item.quantity).toLocaleString()} LAK
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between mb-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>{total.toLocaleString()} LAK</span>
                </div>
                <div className="flex justify-between mb-6 text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>{total.toLocaleString()} LAK</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onClear}
                        className="py-3 px-4 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        disabled={cart.length === 0}
                        className={`py-3 px-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${cart.length === 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 hover:shadow-xl'
                            }`}
                    >
                        Charge {total.toLocaleString()} LAK
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <PaymentModal
                    total={total}
                    onConfirm={(method, print) => {
                        onCheckout(method, print);
                        setIsPaymentModalOpen(false);
                    }}
                    onCancel={() => setIsPaymentModalOpen(false)}
                />
            )}

            {/* Customer Selection Modal */}
            {isCustomerModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Select Customer</h3>
                                <button onClick={() => setIsCustomerModalOpen(false)}><X size={20} /></button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                autoFocus
                                onChange={(e) => {
                                    const term = e.target.value.toLowerCase();
                                    const items = document.querySelectorAll('.customer-item');
                                    items.forEach(item => {
                                        const text = item.textContent.toLowerCase();
                                        item.style.display = text.includes(term) ? 'flex' : 'none';
                                    });
                                }}
                            />
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {customers.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => {
                                        onSelectCustomer(c);
                                        setIsCustomerModalOpen(false);
                                    }}
                                    className="customer-item p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium">{c.name}</p>
                                        <p className="text-sm text-gray-500">{c.phone}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Dashboard Components ---

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const CustomerSearch = ({ customers, selectedCustomerId, onSelectCustomer }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Filter customers based on query
    const filteredCustomers = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            (c.phone && c.phone.includes(lowerQuery))
        ).slice(0, 10); // Limit to 10 results for performance
    }, [customers, query]);

    // Handle selection
    const handleSelect = (customer) => {
        onSelectCustomer(customer.id);
        setQuery('');
        setIsOpen(false);
    };

    // Handle clear
    const handleClear = () => {
        onSelectCustomer('');
        setQuery('');
    };

    // Get selected customer name for display
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    return (
        <div className="relative w-64">
            {selectedCustomerId ? (
                <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex flex-col">
                        <span className="font-bold text-green-800 text-sm">{selectedCustomer?.name}</span>
                        <span className="text-xs text-green-600">{selectedCustomer?.phone}</span>
                    </div>
                    <button
                        onClick={handleClear}
                        className="p-1 hover:bg-green-100 rounded-full text-green-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search customer..."
                            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setIsOpen(true);
                            }}
                            onFocus={() => setIsOpen(true)}
                        />
                    </div>

                    {isOpen && query && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleSelect(c)}
                                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                                    >
                                        <div className="font-medium text-gray-800">{c.name}</div>
                                        <div className="text-xs text-gray-500">{c.phone || 'No Phone'}</div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-sm text-gray-400 text-center">No customers found</div>
                            )}
                        </div>
                    )}

                    {isOpen && (
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

const Dashboard = ({ sales, onDeleteSale, customers, items, onImportSales, onRestore }) => {
    const [timeFilter, setTimeFilter] = useState('day');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get filtered sales based on time filter
    const getFilteredSales = () => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return sales.filter(sale => {
            const saleDate = new Date(sale.date);
            if (timeFilter === 'day') return saleDate >= startOfDay;
            if (timeFilter === 'week') return saleDate >= startOfWeek;
            if (timeFilter === 'month') return saleDate >= startOfMonth;
            return true;
        });
    };

    const filteredSales = getFilteredSales();
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Item stats
    const itemStats = {};
    filteredSales.forEach(sale => {
        sale.items.forEach(item => {
            if (!itemStats[item.name]) itemStats[item.name] = 0;
            itemStats[item.name] += item.quantity;
        });
    });
    const sortedItemStats = Object.entries(itemStats).sort(([, a], [, b]) => b - a);

    // Chart data
    const getChartData = () => {
        const data = {};
        if (timeFilter === 'day') {
            for (let i = 9; i <= 19; i++) data[i + ':00'] = 0;
        } else if (timeFilter === 'week') {
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => data[d] = 0);
        }

        filteredSales.forEach(sale => {
            const date = new Date(sale.date);
            let key;
            if (timeFilter === 'day') key = date.getHours() + ':00';
            else if (timeFilter === 'week') key = date.toLocaleDateString('en-US', { weekday: 'short' });
            else key = date.getDate();

            if (data[key] === undefined) data[key] = 0;
            data[key] += sale.total;
        });
        return data;
    };

    const chartData = getChartData();
    const maxChartValue = Math.max(...Object.values(chartData), 100000);

    // Customer specific logic
    const selectedCustomer = customers ? customers.find(c => c.id === selectedCustomerId) : null;
    const customerSales = selectedCustomer ? sales.filter(s => s.customerId === selectedCustomer.id) : [];
    const customerTotalSpent = customerSales.reduce((sum, s) => sum + s.total, 0);
    const customerTotalOrders = customerSales.length;

    const customerItemStats = {};
    customerSales.forEach(sale => {
        sale.items.forEach(item => {
            if (!customerItemStats[item.name]) customerItemStats[item.name] = 0;
            customerItemStats[item.name] += item.quantity;
        });
    });

    // Sort sales
    const sortedSales = [...sales].sort((a, b) => {
        if (sortConfig.key === 'date') {
            return sortConfig.direction === 'asc'
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortConfig.key === 'id') {
            return sortConfig.direction === 'asc' ? a.id - b.id : b.id - a.id;
        }
        return 0;
    });

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                    <button
                        onClick={() => {
                            if (confirm('Load demo sales data?')) {
                                const demoSales = [];
                                const today = new Date();
                                for (let i = 0; i < 50; i++) {
                                    const date = new Date(today);
                                    date.setDate(today.getDate() - Math.floor(Math.random() * 30));
                                    const numItems = Math.floor(Math.random() * 5) + 1;
                                    const saleItems = [];
                                    let total = 0;
                                    for (let j = 0; j < numItems; j++) {
                                        const item = items[Math.floor(Math.random() * items.length)];
                                        if (item) {
                                            saleItems.push({ ...item, quantity: 1 });
                                            total += item.price;
                                        }
                                    }
                                    if (saleItems.length > 0) {
                                        demoSales.push({
                                            id: Date.now() - Math.floor(Math.random() * 10000000),
                                            date: date.toISOString(),
                                            items: saleItems,
                                            total: total,
                                            paymentMethod: Math.random() > 0.5 ? 'Cash' : 'One Pay',
                                            customerName: Math.random() > 0.7 ? 'Walk-in' : 'Regular'
                                        });
                                    }
                                }
                                onImportSales(demoSales);
                            }
                        }}
                        className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1.5 rounded border border-purple-200 transition-colors"
                    >
                        Load Demo Data
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <CustomerSearch
                        customers={customers}
                        selectedCustomerId={selectedCustomerId}
                        onSelectCustomer={setSelectedCustomerId}
                    />

                    {!selectedCustomerId && (
                        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                            {['day', 'week', 'month'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeFilter(t)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${timeFilter === t ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedCustomerId && selectedCustomer ? (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h3>
                            <p className="text-gray-500">{selectedCustomer.phone || 'No Phone'}</p>
                            <p className="text-xs text-gray-400 font-mono mt-1">ID: {selectedCustomer.id}</p>
                        </div>
                        <div className="flex gap-8 mt-4 md:mt-0 text-right">
                            <div>
                                <p className="text-gray-500 text-sm">Total Spent</p>
                                <p className="text-xl font-bold text-green-600">{customerTotalSpent.toLocaleString()} LAK</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Orders</p>
                                <p className="text-xl font-bold text-blue-600">{customerTotalOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">Service & Product Usage</h3>
                            <div className="space-y-6 overflow-y-auto h-64">
                                {Object.keys(customerItemStats).length === 0 ? (
                                    <div className="text-center text-gray-400 py-10">No usage history</div>
                                ) : (
                                    Object.entries(
                                        Object.entries(customerItemStats).reduce((acc, [name, quantity]) => {
                                            const item = items.find(i => i.name === name);
                                            const category = item ? item.category : 'Other';
                                            if (!acc[category]) acc[category] = [];
                                            acc[category].push({ name, quantity });
                                            return acc;
                                        }, {})
                                    ).map(([category, items]) => (
                                        <div key={category}>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                                            <div className="space-y-2">
                                                {items.sort((a, b) => b.quantity - a.quantity).map(({ name, quantity }) => (
                                                    <div key={name} className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-700">{name}</span>
                                                        <span className="font-bold text-green-600">{quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-lg text-gray-800">Purchase History</h3>
                            </div>
                            <div className="overflow-y-auto h-64">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-sm sticky top-0">
                                        <tr>
                                            <th className="p-4 font-medium">ID</th>
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium">Items</th>
                                            <th className="p-4 font-medium text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {customerSales.slice().reverse().map((sale) => (
                                            <tr key={sale.id} className="hover:bg-gray-50">
                                                <td className="p-4 text-gray-500 font-mono text-xs">#{sale.id}</td>
                                                <td className="p-4 text-gray-600 text-sm">{new Date(sale.date).toLocaleString()}</td>
                                                <td className="p-4 text-gray-600 text-sm">{sale.items.length} items</td>
                                                <td className="p-4 text-right font-bold text-green-600 text-sm">{sale.total.toLocaleString()} LAK</td>
                                            </tr>
                                        ))}
                                        {customerSales.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-gray-400">No purchases found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Total Revenue" value={`${totalRevenue.toLocaleString()} LAK`} icon={<DollarSign size={24} />} color="bg-green-500" />
                        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingBasket size={24} />} color="bg-blue-500" />
                        <StatCard title="Average Order" value={`${averageOrder.toLocaleString()} LAK`} icon={<CreditCard size={24} />} color="bg-purple-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">Sales Overview</h3>
                            <div className="h-64 flex relative pl-12 pb-6">
                                <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-gray-400 text-right pr-2">
                                    <span>{(maxChartValue).toLocaleString()}</span>
                                    <span>{(maxChartValue * 0.75).toLocaleString()}</span>
                                    <span>{(maxChartValue * 0.5).toLocaleString()}</span>
                                    <span>{(maxChartValue * 0.25).toLocaleString()}</span>
                                    <span>0</span>
                                </div>

                                <div className="absolute left-12 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                                    <div className="border-b border-gray-100 w-full h-0"></div>
                                    <div className="border-b border-gray-100 w-full h-0"></div>
                                    <div className="border-b border-gray-100 w-full h-0"></div>
                                    <div className="border-b border-gray-100 w-full h-0"></div>
                                    <div className="border-b border-gray-200 w-full h-0"></div>
                                </div>

                                <div className="flex-1 flex items-end gap-2 z-10 h-full">
                                    {Object.entries(chartData).length === 0 ? (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No data for this period</div>
                                    ) : (
                                        Object.entries(chartData).map(([key, value]) => (
                                            <div key={key} className="flex-1 flex flex-col items-center group h-full justify-end">
                                                <div className="w-full bg-green-200 rounded-t-sm hover:bg-green-300 transition-all relative" style={{ height: `${(value / maxChartValue) * 100}%` }}>
                                                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                        {value.toLocaleString()} LAK
                                                    </div>
                                                </div>
                                                <span className="absolute bottom-0 text-xs text-gray-500 mt-2 truncate w-full text-center">{key}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">Top Items</h3>
                            <div className="space-y-4 overflow-y-auto h-64">
                                {sortedItemStats.length === 0 ? (
                                    <div className="text-center text-gray-400 py-10">No items sold</div>
                                ) : (
                                    sortedItemStats.map(([name, quantity], index) => (
                                        <div key={name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">{index + 1}</div>
                                                <span className="font-medium text-gray-700">{name}</span>
                                            </div>
                                            <span className="font-bold text-green-600">{quantity} sold</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-800">Recent Sales</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}>
                                            <div className="flex items-center gap-1">
                                                Date
                                                {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                            </div>
                                        </th>
                                        <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                                            <div className="flex items-center gap-1">
                                                ID
                                                {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                            </div>
                                        </th>
                                        <th className="p-4 font-medium">Customer ID</th>
                                        <th className="p-4 font-medium">Customer</th>
                                        <th className="p-4 font-medium">Items</th>
                                        <th className="p-4 font-medium text-right">Total</th>
                                        <th className="p-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50">
                                            <td className="p-4 text-gray-600">{new Date(sale.date).toLocaleString()}</td>
                                            <td className="p-4 text-gray-500 font-mono text-xs">#{sale.id}</td>
                                            <td className="p-4 text-gray-500 font-mono text-xs">{sale.customerId ? sale.customerId : '-'}</td>
                                            <td className="p-4 font-medium text-gray-800">{sale.customerName || 'Guest'}</td>
                                            <td className="p-4 text-gray-600">{sale.items.length} items</td>
                                            <td className="p-4 text-right font-bold text-green-600">{sale.total.toLocaleString()} LAK</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => onDeleteSale(sale.id)} className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors" title="Delete Sale">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sales.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="p-8 text-center text-gray-400">No sales yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
// --- Item Manager ---

const ItemsManager = ({ items, onSaveItem, onDeleteItem }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Items</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Item
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-medium w-16">Image</th>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Price</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                                        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                <td className="p-4 text-gray-600">{item.category}</td>
                                <td className="p-4 font-medium">{item.price.toLocaleString()} LAK</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                                    <button onClick={() => onDeleteItem(item.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ItemModal
                    item={editingItem}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(item) => {
                        onSaveItem(item);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

const ItemModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        image: ''
    });

    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: item ? item.id : Date.now(),
            price: parseFloat(formData.price)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="font-bold text-xl">{item ? 'Edit Item' : 'New Item'}</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                required
                                type="number"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                    if (file.size > 500000) { // 500KB limit
                                        alert('Image is too large! Please choose an image under 500KB.');
                                        e.target.value = ''; // Clear input
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFormData({ ...formData, image: reader.result });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                        )}
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold"
                        >
                            Save Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Customer Manager ---

const CustomersManager = ({ customers, sales = [], onSaveCustomer, onDeleteCustomer }) => {
    // Similar structure to ItemsManager, simplified for brevity
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [editingId, setEditingId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'orderCount', direction: 'desc' });

    // Calculate order counts
    const customersWithStats = useMemo(() => {
        return customers.map(c => {
            const orderCount = sales.filter(s => s.customerId === c.id || s.customerName === c.name).length;
            return { ...c, orderCount };
        });
    }, [customers, sales]);

    // Sort customers
    const sortedCustomers = useMemo(() => {
        let sortableCustomers = [...customersWithStats];
        if (sortConfig.key) {
            sortableCustomers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCustomers;
    }, [customersWithStats, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const existingCustomer = customers.find(c => c.phone === formData.phone && c.id !== editingId);
        if (existingCustomer) {
            alert(`Customer already exists: ${existingCustomer.name} (${existingCustomer.phone})`);
            return;
        }
        onSaveCustomer({ ...formData, id: editingId || 'C' + Date.now() });
        setIsModalOpen(false);
        setFormData({ name: '', phone: '' });
        setEditingId(null);
    };

    const handleEdit = (customer) => {
        setFormData({ name: customer.name, phone: customer.phone });
        setEditingId(customer.id);
        setIsModalOpen(true);
    };

    const handleExport = () => {
        const headers = ['ID,Name,Phone,Total Orders'];
        const rows = customersWithStats.map(c => `${c.id},${c.name},${c.phone},${c.orderCount}`);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            let importedCount = 0;
            let skippedCount = 0;

            // Skip header if present
            const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(',');
                // Handle simple CSV: Name,Phone or ID,Name,Phone
                let name, phone;

                if (parts.length >= 3) {
                    // ID,Name,Phone format (export format)
                    name = parts[1];
                    phone = parts[2];
                } else if (parts.length === 2) {
                    // Name,Phone format
                    name = parts[0];
                    phone = parts[1];
                } else {
                    continue;
                }

                if (name && phone) {
                    // Check duplicate
                    if (customers.find(c => c.phone === phone)) {
                        skippedCount++;
                    } else {
                        onSaveCustomer({
                            id: 'C' + Date.now() + Math.random().toString(36).substr(2, 5),
                            name: name.trim(),
                            phone: phone.trim()
                        });
                        importedCount++;
                    }
                }
            }
            alert(`Import complete!\nAdded: ${importedCount}\nSkipped (Duplicate): ${skippedCount}`);
            e.target.value = ''; // Reset input
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50"
                    >
                        <Download size={20} />
                        Export CSV
                    </button>
                    <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                        <Upload size={20} />
                        Import CSV
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleImport}
                        />
                    </label>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '', phone: '' });
                            setIsModalOpen(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Customer
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-medium">ID</th>
                            <th
                                className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-1">
                                    Name
                                    {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                    )}
                                </div>
                            </th>
                            <th className="p-4 font-medium">Phone</th>
                            <th
                                className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('orderCount')}
                            >
                                <div className="flex items-center gap-1">
                                    Total Orders
                                    {sortConfig.key === 'orderCount' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                    )}
                                </div>
                            </th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedCustomers.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-500 font-mono text-xs">{c.id}</td>
                                <td className="p-4 font-medium text-gray-800">{c.name}</td>
                                <td className="p-4 text-gray-600">{c.phone}</td>
                                <td className="p-4 text-gray-600 font-bold">{c.orderCount}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(c)}
                                        className="text-blue-500 hover:text-blue-700 font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => onDeleteCustomer(c.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-bold text-xl">{editingId ? 'Edit Customer' : 'New Customer'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input
                                required placeholder="Name"
                                className="w-full p-2 border rounded-lg"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                required placeholder="Phone" type="tel"
                                className="w-full p-2 border rounded-lg"
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-bold">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Expose components to window
window.Sidebar = Sidebar;
window.ProductCard = ProductCard;
window.Cart = Cart;
window.Dashboard = Dashboard;
window.ItemsManager = ItemsManager;
window.CustomersManager = CustomersManager;
