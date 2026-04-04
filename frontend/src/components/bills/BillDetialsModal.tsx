import { X, Printer, Download } from 'lucide-react';
import { Modal } from '../Modal';

interface BillItem {
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface BillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  billNumber: string;
  customerName: string;
  date: string;
  time: string;
  items: BillItem[];
  discountRate: number;
}

export function BillDetailModal({
  isOpen,
  onClose,
  billNumber,
  customerName,
  date,
  time,
  items,
  discountRate,
}: BillDetailModalProps) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = (subtotal * discountRate) / 100;
  const finalTotal = subtotal - discountAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Download feature - Coming soon!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bill Details">
      <div className="max-h-[70vh] overflow-y-auto">
        {/* Bill Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-6 border border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-primary mb-1">AutoHead Car Accessories</h2>
              <p className="text-sm text-muted-foreground">
                123 Main Street, City, State 12345
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: (555) 123-4567
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Bill Number</p>
              <p className="text-primary text-lg">{billNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p>{customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p>{date} • {time}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h3 className="mb-3">Items</h3>
          
          {/* Desktop View */}
          <div className="hidden md:block border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left">Product Name</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-0 ${
                      index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                    }`}
                  >
                    <td className="px-4 py-3">{item.productName}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">₹{item.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">₹{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-3 bg-card"
              >
                <p className="mb-2">{item.productName}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                  </span>
                  <span className="text-primary">₹{item.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          
          {discountRate > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountRate}%)</span>
              <span>- ₹{discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg">Total Amount</span>
              <span className="text-2xl text-primary">
                ₹{finalTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Thank you for your business!
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            This is a computer-generated bill
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-border">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Bill
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={onClose}
          className="sm:w-auto px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
