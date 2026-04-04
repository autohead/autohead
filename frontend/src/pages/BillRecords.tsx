import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Receipt, Eye } from 'lucide-react';
import { BillDetailModal } from '../components/bills/BillDetialsModal';

interface BillRecord {
  id: number;
  billNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  discountRate: number;
  finalAmount: number;
  date: string;
  time: string;
}

// Mock data for bill records
const mockBillRecords: BillRecord[] = [
  {
    id: 1,
    billNumber: '#1234',
    customerName: 'John Doe',
    productName: 'Premium Floor Mats',
    quantity: 2,
    price: 1200,
    totalPrice: 2400,
    discountRate: 10,
    finalAmount: 2160,
    date: '2024-12-10',
    time: '10:30 AM',
  },
  {
    id: 2,
    billNumber: '#1234',
    customerName: 'John Doe',
    productName: 'LED Headlight Kit',
    quantity: 1,
    price: 3500,
    totalPrice: 3500,
    discountRate: 10,
    finalAmount: 3150,
    date: '2024-12-10',
    time: '10:30 AM',
  },
  {
    id: 3,
    billNumber: '#1233',
    customerName: 'Sarah Smith',
    productName: 'Car Cover Waterproof',
    quantity: 2,
    price: 1800,
    totalPrice: 3600,
    discountRate: 5,
    finalAmount: 3420,
    date: '2024-12-10',
    time: '11:15 AM',
  },
  {
    id: 4,
    billNumber: '#1232',
    customerName: 'Mike Johnson',
    productName: 'Phone Mount Magnetic',
    quantity: 5,
    price: 750,
    totalPrice: 3750,
    discountRate: 0,
    finalAmount: 3750,
    date: '2024-12-09',
    time: '02:45 PM',
  },
  {
    id: 5,
    billNumber: '#1232',
    customerName: 'Mike Johnson',
    productName: 'Dash Camera HD',
    quantity: 2,
    price: 4500,
    totalPrice: 9000,
    discountRate: 0,
    finalAmount: 9000,
    date: '2024-12-09',
    time: '02:45 PM',
  },
  {
    id: 6,
    billNumber: '#1231',
    customerName: 'Emily Davis',
    productName: 'Seat Covers Leather',
    quantity: 1,
    price: 6500,
    totalPrice: 6500,
    discountRate: 15,
    finalAmount: 5525,
    date: '2024-12-09',
    time: '04:20 PM',
  },
  {
    id: 7,
    billNumber: '#1230',
    customerName: 'Robert Brown',
    productName: 'Tire Pressure Monitor',
    quantity: 3,
    price: 2500,
    totalPrice: 7500,
    discountRate: 5,
    finalAmount: 7125,
    date: '2024-12-08',
    time: '09:30 AM',
  },
  {
    id: 8,
    billNumber: '#1230',
    customerName: 'Robert Brown',
    productName: 'Steering Wheel Cover',
    quantity: 4,
    price: 550,
    totalPrice: 2200,
    discountRate: 5,
    finalAmount: 2090,
    date: '2024-12-08',
    time: '09:30 AM',
  },
  {
    id: 9,
    billNumber: '#1229',
    customerName: 'Lisa Anderson',
    productName: 'Premium Floor Mats',
    quantity: 1,
    price: 1200,
    totalPrice: 1200,
    discountRate: 0,
    finalAmount: 1200,
    date: '2024-12-08',
    time: '11:00 AM',
  },
  {
    id: 10,
    billNumber: '#1228',
    customerName: 'David Wilson',
    productName: 'LED Headlight Kit',
    quantity: 2,
    price: 3500,
    totalPrice: 7000,
    discountRate: 10,
    finalAmount: 6300,
    date: '2024-12-07',
    time: '03:15 PM',
  },
  {
    id: 11,
    billNumber: '#1227',
    customerName: 'Jennifer Taylor',
    productName: 'Dash Camera HD',
    quantity: 1,
    price: 4500,
    totalPrice: 4500,
    discountRate: 5,
    finalAmount: 4275,
    date: '2024-12-07',
    time: '05:40 PM',
  },
  {
    id: 12,
    billNumber: '#1226',
    customerName: 'Michael Clark',
    productName: 'Car Cover Waterproof',
    quantity: 3,
    price: 1800,
    totalPrice: 5400,
    discountRate: 12,
    finalAmount: 4752,
    date: '2024-12-06',
    time: '10:20 AM',
  },
  {
    id: 13,
    billNumber: '#1225',
    customerName: 'Amanda Martinez',
    productName: 'Phone Mount Magnetic',
    quantity: 2,
    price: 750,
    totalPrice: 1500,
    discountRate: 0,
    finalAmount: 1500,
    date: '2024-12-06',
    time: '01:30 PM',
  },
  {
    id: 14,
    billNumber: '#1224',
    customerName: 'Christopher Lee',
    productName: 'Seat Covers Leather',
    quantity: 2,
    price: 6500,
    totalPrice: 13000,
    discountRate: 20,
    finalAmount: 10400,
    date: '2024-12-05',
    time: '09:00 AM',
  },
  {
    id: 15,
    billNumber: '#1223',
    customerName: 'Patricia Harris',
    productName: 'Tire Pressure Monitor',
    quantity: 1,
    price: 2500,
    totalPrice: 2500,
    discountRate: 5,
    finalAmount: 2375,
    date: '2024-12-05',
    time: '12:45 PM',
  },
];

type SortField = 'date' | 'finalAmount' | 'customerName';
type SortDirection = 'asc' | 'desc';

export default function BillRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedBillNumber, setSelectedBillNumber] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Group records by bill number
  const billGroups = useMemo(() => {
    const groups = new Map<string, BillRecord[]>();
    mockBillRecords.forEach((record) => {
      if (!groups.has(record.billNumber)) {
        groups.set(record.billNumber, []);
      }
      groups.get(record.billNumber)!.push(record);
    });
    return groups;
  }, []);

  // Get unique bills for display
  const uniqueBills = useMemo(() => {
    const bills = new Map<string, BillRecord>();
    mockBillRecords.forEach((record) => {
      if (!bills.has(record.billNumber)) {
        bills.set(record.billNumber, record);
      }
    });
    return Array.from(bills.values());
  }, []);

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = uniqueBills.filter((record) =>
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort records
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`).getTime();
        const dateB = new Date(`${b.date} ${b.time}`).getTime();
        comparison = dateA - dateB;
      } else if (sortField === 'finalAmount') {
        comparison = a.finalAmount - b.finalAmount;
      } else if (sortField === 'customerName') {
        comparison = a.customerName.localeCompare(b.customerName);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredAndSortedRecords.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewBill = (billNumber: string) => {
    setSelectedBillNumber(billNumber);
  };

  const getSelectedBillData = () => {
    if (!selectedBillNumber) return null;
    
    const billItems = billGroups.get(selectedBillNumber);
    if (!billItems || billItems.length === 0) return null;

    const firstItem = billItems[0];
    return {
      billNumber: selectedBillNumber,
      customerName: firstItem.customerName,
      date: firstItem.date,
      time: firstItem.time,
      items: billItems.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      })),
      discountRate: firstItem.discountRate,
    };
  };

  const selectedBill = getSelectedBillData();

  // Calculate total items and total amount for each bill
  const getBillSummary = (billNumber: string) => {
    const items = billGroups.get(billNumber) || [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.finalAmount, 0);
    return { totalItems, totalAmount };
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Receipt className="w-8 h-8 text-primary" />
          <h1>AutoHead Bill Record</h1>
        </div>
        <p className="text-muted-foreground">
          Complete history of all transactions and bills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('date')}
              className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${
                sortField === 'date'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              Date
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSort('finalAmount')}
              className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${
                sortField === 'finalAmount'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              Amount
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} - {Math.min(endIndex, filteredAndSortedRecords.length)} of{' '}
            {filteredAndSortedRecords.length} records
          </p>
        </div>
      </div>

      {/* Desktop: Table View */}
      <div className="hidden lg:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-3 text-left">Bill #</th>
                <th className="px-4 py-3 text-left">Customer Name</th>
                <th className="px-4 py-3 text-center">Total Items</th>
                <th className="px-4 py-3 text-right">Discount %</th>
                <th className="px-4 py-3 text-right">Bill Amount</th>
                <th className="px-4 py-3 text-center">Date</th>
                <th className="px-4 py-3 text-center">Time</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => {
                const { totalItems, totalAmount } = getBillSummary(record.billNumber);
                return (
                  <tr
                    key={record.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-primary">{record.billNumber}</span>
                    </td>
                    <td className="px-4 py-3">{record.customerName}</td>
                    <td className="px-4 py-3 text-center">{totalItems}</td>
                    <td className="px-4 py-3 text-right">
                      {record.discountRate > 0 ? (
                        <span className="text-green-600">{record.discountRate}%</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{record.date}</td>
                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                      {record.time}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewBill(record.billNumber)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {currentRecords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bill records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Card View */}
      <div className="lg:hidden space-y-4">
        {currentRecords.map((record) => {
          const { totalItems, totalAmount } = getBillSummary(record.billNumber);
          return (
            <div
              key={record.id}
              className="bg-card rounded-xl p-4 border border-border shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-primary">{record.billNumber}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {record.date} • {record.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-primary">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-border pt-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Customer:</span>
                  <span className="text-sm">{record.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Items:</span>
                  <span className="text-sm">{totalItems}</span>
                </div>
                {record.discountRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Discount:</span>
                    <span className="text-sm text-green-600">{record.discountRate}%</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleViewBill(record.billNumber)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Full Bill
              </button>
            </div>
          );
        })}

        {currentRecords.length === 0 && (
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <p className="text-muted-foreground">No bill records found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-3 py-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Bill Detail Modal */}
      {selectedBill && (
        <BillDetailModal
          isOpen={!!selectedBillNumber}
          onClose={() => setSelectedBillNumber(null)}
          billNumber={selectedBill.billNumber}
          customerName={selectedBill.customerName}
          date={selectedBill.date}
          time={selectedBill.time}
          items={selectedBill.items}
          discountRate={selectedBill.discountRate}
        />
      )}
    </div>
  );
}