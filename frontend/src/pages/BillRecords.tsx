import { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Receipt, Eye } from 'lucide-react';
import { BillDetailModal } from '../components/bills/BillDetialsModal';
import IsLoadingDisplay from '../components/common/IsLoadingDisplay';
import IsErrorDisplay from '../components/common/IsErrorDisplay';
import { useBillingAllData } from '../hooks/billing';
import type { BillAllListData } from '../types/billing';
import { formatTime, formatDate } from '../utils/datetimeUtils';


// ✅ Delay search API call until user stops typing for a short time (e.g., 500ms)
function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

type SortField = 'date' | 'finalAmount' | 'customerName';
type SortDirection = 'asc' | 'desc';


export default function BillRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedBillNumber, setSelectedBillNumber] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);


  // ✅ API call
  const { data, isLoading, isError } = useBillingAllData({
    page: currentPage,
    page_size: 10,
    search: debouncedSearch,
  });


  const bills = data?.billing_data ?? [];
  const totalPages = data?.total_pages ?? 1;
  const totalCount = data?.count ?? 0;



  // ✅ Group items (keep this if API returns split items)
  const billGroups = useMemo(() => {
    const groups = new Map<string, BillAllListData[]>();
    bills.forEach((record) => {
      if (!groups.has(record.invoice_no)) {
        groups.set(record.invoice_no, []);
      }
      groups.get(record.invoice_no)!.push(record);
    });
    return groups;
  }, [bills]);


  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = Array.from(billGroups.values()).map(group => group[0]);

    if (searchTerm) {
      filtered = filtered.filter((record) =>
        record.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'date') {
        comparison =
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime();
      } else if (sortField === 'finalAmount') {
        comparison = a.total_amount - b.total_amount;
      } else if (sortField === 'customerName') {
        comparison = a.customer_name.localeCompare(b.customer_name);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [billGroups, searchTerm, sortField, sortDirection]);

  if (isLoading) return <IsLoadingDisplay />;
  if (isError) return <IsErrorDisplay type="bills" />;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field); setSortDirection('desc');
    }
  };


  // modal data
  const getSelectedBillData = () => {
    if (!selectedBillNumber) return null;

    const billItems = billGroups.get(selectedBillNumber);
    if (!billItems) return null;

    const first = billItems[0];

    return {
      invoice_no: selectedBillNumber,
      customer_name: first.customer_name,
      created_at: first.created_at,
      items: billItems.flatMap((item) =>
        item.items.map((sub) => ({
          product_name: sub.product_name,
          quantity: sub.quantity,
          selling_price: sub.selling_price,
        }))
      ),
      total_amount: first.total_amount,
      discount: first.discount,
      net_amount: first.net_amount,
    };
  };

  const selectedBill = getSelectedBillData();


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
              className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${sortField === 'date'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
                }`}
            >
              Date
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSort('finalAmount')}
              className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${sortField === 'finalAmount'
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
            Showing page {currentPage} of {totalPages} ({totalCount} total records)
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
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Bill Amount</th>
                <th className="px-4 py-3 text-center">Date</th>
                <th className="px-4 py-3 text-center">Time</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedRecords.map((record, index) => {
                return (
                  <tr
                    key={record.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-accent/50 ${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                      }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-primary">{record.invoice_no}</span>
                    </td>
                    <td className="px-4 py-3">{record.customer_name}</td>
                    <td className="px-4 py-3 text-center">{record.items.length}</td>
                    <td className="px-4 py-3 text-right">
                      {record.discount > 0 ? (
                        <span className="text-green-600">{record.discount}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-primary">₹{record.total_amount}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{formatDate(record.created_at)}</td>
                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                      {formatTime(record.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedBillNumber(record.invoice_no)}
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

          {filteredAndSortedRecords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bill records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Card View */}
      <div className="lg:hidden space-y-4">
        {filteredAndSortedRecords.map((record) => {
          return (
            <div
              key={record.id}
              className="bg-card rounded-xl p-4 border border-border shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-primary">{record.invoice_no}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {record.created_at} • {record.created_at.split('T')[1].split('.')[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-primary">₹{record.total_amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-border pt-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Customer:</span>
                  <span className="text-sm">{record.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Items:</span>
                  <span className="text-sm">{record.items.length}</span>
                </div>
                {record.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Discount:</span>
                    <span className="text-sm text-green-600">{record.discount}%</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBillNumber(record.invoice_no)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Full Bill
              </button>
            </div>
          );
        })}

        {filteredAndSortedRecords.length === 0 && (
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <p className="text-muted-foreground">No bill records found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'font-bold' : ''}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Bill Detail Modal */}
      {selectedBill && (
        <BillDetailModal
          isOpen={!!selectedBillNumber}
          onClose={() => setSelectedBillNumber(null)}
          billData={selectedBill}
        />
      )}
    </div>
  );
}